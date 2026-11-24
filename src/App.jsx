import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AqiOverview from './components/AqiOverview';
import FamilyRoutinePlanner from './components/FamilyRoutinePlanner';
import IndoorAirHacks from './components/IndoorAirHacks';
import PromptWarAssistant from './components/PromptWarAssistant';
import DefensePlanModal from './components/DefensePlanModal';
import { POPULAR_CITIES } from './data/cities';
import { fetchLiveAirQuality, getFallbackData } from './services/airQualityService';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(POPULAR_CITIES[0]); // Default Delhi NCR
  const [aqiData, setAqiData] = useState(() => getFallbackData(POPULAR_CITIES[0].name));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Navigation Bar */}
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
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

      {/* Hackathon Footer with Links & Submission Prompt */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AuraCare</span>
            <span>•</span>
            <span>Built for the <strong>Urban Air Quality Assistant</strong> Challenge</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="https://air-quality-api.open-meteo.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              Open-Meteo API <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://github.com/topics/free-for-developers" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              free-for-developers <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://reactbits.dev" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              reactbits.dev <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-center md:text-right">
            <span className="text-slate-400">Hack2Skill Prompt War Leaderboard Edition</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
