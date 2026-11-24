import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LeftEmergencyDock from './components/LeftEmergencyDock';
import AirZeroFirstPrinciples from './components/AirZeroFirstPrinciples';
import AqiOverview from './components/AqiOverview';
import FamilyRoutinePlanner from './components/FamilyRoutinePlanner';
import IndoorAirHacks from './components/IndoorAirHacks';
import PromptWarAssistant from './components/PromptWarAssistant';
import DefensePlanModal from './components/DefensePlanModal';
import ElsewhereHero from '@/components/ui/elsewhere-hero';
import AmbientElsewhereBackground from '@/components/ui/AmbientElsewhereBackground';
import { POPULAR_CITIES } from './data/cities';
import { fetchLiveAirQuality, getFallbackData } from './services/airQualityService';
import { ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(POPULAR_CITIES[0]); // Default Delhi NCR
  const [aqiData, setAqiData] = useState(() => getFallbackData(POPULAR_CITIES[0].name));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('airzero');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHero, setShowHero] = useState(false); // Can be toggled from navbar anytime

  const contentRef = useRef(null);

  // GSAP Glass Entrance Animation on tab change
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, filter: 'blur(10px)', y: 15 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.45, ease: 'power3.out' }
    );
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchLiveAirQuality(selectedCity.lat, selectedCity.lon, selectedCity.name);
        if (isMounted) setAqiData(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setAqiData(getFallbackData(selectedCity.name));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedCity]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveAirQuality(selectedCity.lat, selectedCity.lon, selectedCity.name);
      setAqiData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const customCity = {
          name: 'My Location',
          country: 'Local',
          lat: latitude,
          lon: longitude,
          tag: 'Detected via GPS'
        };
        setSelectedCity(customCity);
        setIsDetecting(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setIsDetecting(false);
        alert('Could not detect location. Defaulting to selected city.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      
      {/* Exact ambient living video & audio soundscape layer across the whole app */}
      <AmbientElsewhereBackground />

      {/* Floating Left Live Chatbot, Emergency Call & Location Verification Dock */}
      <LeftEmergencyDock
        selectedCity={selectedCity}
        onDetectLocation={handleDetectLocation}
        isDetecting={isDetecting}
        aqiData={aqiData}
      />

      {/* Floating Glass Pill Navigation Dock */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onDetectLocation={handleDetectLocation}
        isDetecting={isDetecting}
        lastUpdated={aqiData?.updatedAt}
        onRefresh={handleRefresh}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsModalOpen(true)}
        showHero={showHero}
        setShowHero={setShowHero}
      />

      {/* Expandable Cinematic Hero Banner */}
      {showHero && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-20 animate-in fade-in zoom-in-95 duration-500">
          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <ElsewhereHero
              headline="Breathe somewhere better."
              subline="Ambient soundscapes and real-time smog defense routines that protect your family from winter inversion."
              primaryCta={{ label: "Activate AIRZERO Defense", href: "#airzero" }}
              brand="AIRZERO x Elsewhere"
              links={[
                { label: "Exposure Detective", href: "#" },
                { label: "Counterfactual AI", href: "#" },
                { label: "Proof of Improvement", href: "#" },
              ]}
              signature={{
                name: "AIRZERO First Principles",
                url: "https://hack2skill.com",
              }}
            />
          </div>
        </section>
      )}

      {/* Main Glass Animated Content Area */}
      <main ref={contentRef} className="flex-1 max-w-7xl w-full mx-auto px-4 pl-18 sm:pl-22 xl:px-8 py-2 relative z-10">
        
        {/* Tab 0: AIRZERO First-Principles Exposure Defense System */}
        {activeTab === 'airzero' && (
          <AirZeroFirstPrinciples aqiData={aqiData} />
        )}

        {/* Tab 1: Dashboard & Live Smog Radar */}
        {activeTab === 'dashboard' && (
          <AqiOverview
            data={aqiData}
            loading={loading}
            onJumpToPlanner={() => setActiveTab('planner')}
            onJumpToIndoor={() => setActiveTab('indoor')}
          />
        )}

        {/* Tab 2: Family Defense & Low-Emission Routines */}
        {activeTab === 'planner' && (
          <FamilyRoutinePlanner aqiData={aqiData} />
        )}

        {/* Tab 3: Indoor Air Hacks & DIY Purifier Sizing */}
        {activeTab === 'indoor' && (
          <IndoorAirHacks />
        )}

        {/* Tab 4: Hackathon Prompt War Studio */}
        {activeTab === 'promptwar' && (
          <PromptWarAssistant
            currentAqi={aqiData?.aqi}
            cityName={selectedCity.name}
          />
        )}

      </main>

      {/* Reusable Family Smog Battle Plan Modal */}
      <DefensePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={aqiData}
      />

      {/* Hackathon Glassy Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8 w-full relative z-10">
        <div className="glass-panel rounded-full px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white">
          
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">AIRZERO</span>
            <span>•</span>
            <span className="text-white/80">First-Principles Exposure Engineering • Spatial Glass Architecture</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <a 
              href="https://air-quality-api.open-meteo.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
            >
              Open-Meteo Live API <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
            >
              WHO Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Web Audio API Synthesis</span>
          </div>

          <div className="text-center md:text-right">
            <span className="text-white font-bold">Hack2Skill Prompt War Leaderboard</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
