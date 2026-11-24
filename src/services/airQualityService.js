/**
 * @file airQualityService.js
 * @description Real-time atmospheric telemetry and air quality service.
 * Interfaces with Open-Meteo's non-commercial API with an in-memory TTL cache,
 * strict request timeouts, and resilient deterministic offline fallbacks.
 */

/**
 * @typedef {Object} AqiCategory
 * @property {number} max - Maximum AQI threshold for this category
 * @property {string} label - Human-readable category label
 * @property {string} color - Tailwind semantic color key
 * @property {string} bg - Background style classes
 * @property {string} border - Border style classes
 * @property {string} text - Text color classes
 * @property {string} desc - Advisory description
 */

export const AQI_LEVELS = Object.freeze([
  { max: 50, label: 'Good', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', desc: 'Air quality is satisfactory and poses little or no health risk.' },
  { max: 100, label: 'Moderate', color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', desc: 'Acceptable; sensitive individuals should consider limiting prolonged outdoor exertion.' },
  { max: 150, label: 'Unhealthy for Sensitive Groups', color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', desc: 'Members of sensitive groups may experience health effects; general public is less likely to be affected.' },
  { max: 200, label: 'Unhealthy', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', desc: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.' },
  { max: 300, label: 'Very Unhealthy', color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', desc: 'Health alert: risk of health effects is increased for everyone in the household.' },
  { max: 9999, label: 'Hazardous (Smog Emergency)', color: 'red', bg: 'bg-red-600/20', border: 'border-red-600/50', text: 'text-red-400', desc: 'Health warning of emergency conditions. Entire population is more likely to be severely affected.' },
]);

/**
 * In-memory LRU-style cache with 5-minute TTL to optimize efficiency and minimize redundant network fetches.
 * @type {Map<string, { timestamp: number, data: Object }>}
 */
const apiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Classifies an AQI value into a standard EPA categorization bracket.
 * Complexity: O(1)
 * @param {number|string} aqi - The raw or computed Air Quality Index value
 * @returns {AqiCategory} The matching category object
 */
export function getAqiCategory(aqi) {
  const num = Math.round(Number(aqi) || 0);
  return AQI_LEVELS.find(lvl => num <= lvl.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

/**
 * Fetches real-time AQI and chemical pollutant concentration telemetry.
 * Automatically utilizes in-memory cache if queried within TTL.
 * 
 * @param {number} lat - Latitude in decimal degrees
 * @param {number} lon - Longitude in decimal degrees
 * @param {string} [cityName='Current Location'] - Human-readable city identifier
 * @returns {Promise<Object>} Formatted air quality metrics and hourly exposure timeline
 */
export async function fetchLiveAirQuality(lat, lon, cityName = 'Current Location') {
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = apiCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return { ...cached.data, city: cityName, fromCache: true };
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,pm10&forecast_days=2`;
    
    // Efficient request with 6-second timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const currentAqi = Math.round(data.current?.us_aqi ?? 145);
    const pm25 = Math.round((data.current?.pm2_5 ?? 52.4) * 10) / 10;
    const pm10 = Math.round((data.current?.pm10 ?? 88.1) * 10) / 10;
    const no2 = Math.round((data.current?.nitrogen_dioxide ?? 35) * 10) / 10;
    const o3 = Math.round((data.current?.ozone ?? 22) * 10) / 10;

    // Process hourly timeline (Next 24 hours)
    const hours = data.hourly?.time?.slice(0, 24) || [];
    const aqiValues = data.hourly?.us_aqi?.slice(0, 24) || [];
    const pm25Values = data.hourly?.pm2_5?.slice(0, 24) || [];

    const timeline = hours.map((t, idx) => {
      const date = new Date(t);
      const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const val = Math.round(aqiValues[idx] ?? currentAqi);
      return {
        time: hourStr,
        hourRaw: date.getHours(),
        aqi: val,
        pm25: Math.round(pm25Values[idx] ?? pm25),
        category: getAqiCategory(val),
      };
    });

    // Determine optimal ventilation vs peak danger windows
    let minAqiItem = timeline[0];
    let maxAqiItem = timeline[0];
    for (let i = 0; i < timeline.length; i++) {
      if (timeline[i].aqi < minAqiItem.aqi) minAqiItem = timeline[i];
      if (timeline[i].aqi > maxAqiItem.aqi) maxAqiItem = timeline[i];
    }

    const result = {
      source: 'live',
      city: cityName,
      aqi: currentAqi,
      pm25,
      pm10,
      no2,
      o3,
      category: getAqiCategory(currentAqi),
      whoExceedance: Math.max(1, Math.round(pm25 / 5)), // WHO guideline: 5 µg/m³
      timeline,
      bestWindow: minAqiItem ? `${minAqiItem.time} (AQI ~${minAqiItem.aqi})` : '1:00 PM - 3:00 PM',
      peakDanger: maxAqiItem ? `${maxAqiItem.time} (AQI ~${maxAqiItem.aqi})` : '6:00 AM - 9:00 AM',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Store in cache for subsequent calls
    apiCache.set(cacheKey, { timestamp: Date.now(), data: result });

    return result;
  } catch {
    return getFallbackData(cityName);
  }
}

/**
 * Generates deterministic fallback simulation data when offline or network fails.
 * 
 * @param {string} cityName - Name of the target city
 * @returns {Object} Realistic simulated atmospheric dataset
 */
export function getFallbackData(cityName) {
  const currentAqi = 188;
  const pm25 = 94.2;
  const pm10 = 168.0;

  const hours = Array.from({ length: 24 }).map((_, i) => {
    const hour = (i + 6) % 24;
    const isNightSpike = hour < 9 || hour > 20;
    const simulatedAqi = isNightSpike ? 210 + Math.floor(Math.sin(i) * 30) : 120 + Math.floor(Math.cos(i) * 25);
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      hourRaw: hour,
      aqi: simulatedAqi,
      pm25: Math.round(simulatedAqi * 0.52),
      category: getAqiCategory(simulatedAqi),
    };
  });

  return {
    source: 'simulated',
    city: cityName,
    aqi: currentAqi,
    pm25,
    pm10,
    no2: 44.5,
    o3: 28.0,
    category: getAqiCategory(currentAqi),
    whoExceedance: Math.max(1, Math.round(pm25 / 5)),
    timeline: hours,
    bestWindow: '1:30 PM - 3:30 PM (AQI ~125)',
    peakDanger: '6:30 AM - 9:00 AM (AQI ~245)',
    updatedAt: 'Simulated Baseline',
  };
}
