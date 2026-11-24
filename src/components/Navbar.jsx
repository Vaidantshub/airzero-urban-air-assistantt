import React from 'react';
import { Wind, MapPin, RefreshCw, ShieldAlert, Award } from 'lucide-react';
import { POPULAR_CITIES } from '../data/cities';

export default function Navbar({
  selectedCity,
  onSelectCity,
  onDetectLocation,
  isDetecting,
  lastUpdated,
  onRefresh,
  activeTab,
  setActiveTab,
  onOpenReport,
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wind className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  AuraCare
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award className="w-3 h-3" /> Prompt War Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Urban Air Quality & Winter Smog Defense Assistant {lastUpdated ? `(Sync: ${lastUpdated})` : ''}
              </p>
            </div>
          </div>

          {/* City Selector & Geolocation */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = POPULAR_CITIES.find(c => c.name === e.target.value);
                  if (city) onSelectCity(city);
                }}
                className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
              >
                {POPULAR_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={onDetectLocation}
              disabled={isDetecting}
              title="Detect my current location"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <MapPin className={`w-3.5 h-3.5 ${isDetecting ? 'animate-bounce text-emerald-400' : ''}`} />
              <span className="hidden md:inline">{isDetecting ? 'Locating...' : 'Auto-Detect'}</span>
            </button>

            <button
              onClick={onRefresh}
              title="Refresh live data"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenReport}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Smog Battle Plan
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-800/60 overflow-x-auto no-scrollbar gap-2 py-2">
          {[
            { id: 'dashboard', label: 'Smog Radar & AQI', icon: Wind },
            { id: 'planner', label: 'Family Low-Emission Routines', icon: ShieldAlert },
            { id: 'indoor', label: 'Indoor Hacks & DIY Purifier', icon: Award },
            { id: 'promptwar', label: 'AI Prompt War Studio', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
