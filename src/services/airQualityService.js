// Live Air Quality Service using Open-Meteo free API with resilient fallback

export const AQI_LEVELS = [
  { max: 50, label: 'Good', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', desc: 'Air quality is satisfactory and poses little or no health risk.' },
  { max: 100, label: 'Moderate', color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', desc: 'Acceptable; sensitive individuals should consider limiting prolonged outdoor exertion.' },
  { max: 150, label: 'Unhealthy for Sensitive Groups', color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', desc: 'Members of sensitive groups may experience health effects; general public is less likely to be affected.' },
  { max: 200, label: 'Unhealthy', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', desc: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.' },
  { max: 300, label: 'Very Unhealthy', color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', desc: 'Health alert: risk of health effects is increased for everyone in the household.' },
  { max: 9999, label: 'Hazardous (Smog Emergency)', color: 'red', bg: 'bg-red-600/20', border: 'border-red-600/50', text: 'text-red-400', desc: 'Health warning of emergency conditions. Entire population is more likely to be severely affected.' },
];

export function getAqiCategory(aqi) {
  const num = Math.round(Number(aqi) || 0);
  return AQI_LEVELS.find(lvl => num <= lvl.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

export async function fetchLiveAirQuality(lat, lon, cityName = 'Current Location') {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,pm10&forecast_days=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const currentAqi = Math.round(data.current?.us_aqi ?? 145);
    const pm25 = Math.round((data.current?.pm2_5 ?? 52.4) * 10) / 10;
    const pm10 = Math.round((data.current?.pm10 ?? 88.1) * 10) / 10;
    const no2 = Math.round((data.current?.nitrogen_dioxide ?? 35) * 10) / 10;
    const o3 = Math.round((data.current?.ozone ?? 22) * 10) / 10;

    // Process hourly timeline
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

    // Determine best and worst windows
    let minAqiItem = timeline[0];
    let maxAqiItem = timeline[0];
    timeline.forEach(item => {
      if (item.aqi < minAqiItem.aqi) minAqiItem = item;
      if (item.aqi > maxAqiItem.aqi) maxAqiItem = item;
    });

    return {
      source: 'live',
      city: cityName,
      aqi: currentAqi,
      pm25,
      pm10,
      no2,
      o3,
      category: getAqiCategory(currentAqi),
      whoExceedance: Math.max(1, Math.round(pm25 / 5)), // WHO annual guideline is 5 µg/m³
      timeline,
      bestWindow: minAqiItem ? `${minAqiItem.time} (AQI ~${minAqiItem.aqi})` : '1:00 PM - 3:00 PM',
      peakDanger: maxAqiItem ? `${maxAqiItem.time} (AQI ~${maxAqiItem.aqi})` : '6:00 AM - 9:00 AM',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Using cached mock data due to network error:', err);
    return getFallbackData(cityName);
  }
}

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
    o3: 18.2,
    category: getAqiCategory(currentAqi),
    whoExceedance: 19,
    timeline: hours,
    bestWindow: '2:00 PM - 4:00 PM (AQI ~125)',
    peakDanger: '6:30 AM - 9:30 AM (AQI ~245)',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
