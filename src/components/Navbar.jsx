import React from 'react';
import { Wind, MapPin, RefreshCw, ShieldAlert, Award, Sparkles, LayoutDashboard, Film, ChevronDown, ChevronUp } from 'lucide-react';
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
  showHero,
  setShowHero,
}) {
  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 pointer-events-none">
      <div className="glass-panel rounded-full px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl pointer-events-auto">
        
        {/* Brand & Hero Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Wind className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  AIRZERO
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Glass Edition
                </span>
              </div>
              <p className="text-[10px] text-white/80 font-medium hidden sm:block">
                First-Principles Exposure Shield {lastUpdated ? `• ${lastUpdated}` : ''}
              </p>
            </div>
          </div>

          {/* Toggle Cinematic Hero Button */}
          <button
            onClick={() => setShowHero(!showHero)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full glass-pill text-white transition-all cursor-pointer"
          >
            <Film className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">{showHero ? 'Hide Hero' : 'Cinematic Hero'}</span>
            {showHero ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Tab Navigation Pill Dock */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto justify-start md:justify-center py-1">
          {[
            { id: 'airzero', label: 'AIRZERO Exposure', icon: Sparkles },
            { id: 'dashboard', label: 'Smog Radar', icon: Wind },
            { id: 'planner', label: 'Family Routines', icon: ShieldAlert },
            { id: 'indoor', label: 'DIY Purifier', icon: ShieldAlert },
            { id: 'promptwar', label: 'Prompt War', icon: Award },
            { id: 'glassy', label: 'Spatial Workspace', icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'glass-pill-active'
                    : 'text-white/80 hover:text-white hover:bg-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white font-bold' : 'text-white/70'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* City Selector & Quick Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative">
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = POPULAR_CITIES.find(c => c.name === e.target.value);
                if (city) onSelectCity(city);
              }}
              className="appearance-none glass-input text-white text-xs rounded-full pl-3 pr-7 py-1.5 focus:outline-none transition-all cursor-pointer"
            >
              {POPULAR_CITIES.map((city) => (
                <option key={city.name} value={city.name} className="bg-slate-900 text-white">
                  {city.name}
                </option>
              ))}
            </select>
            <MapPin className="w-3 h-3 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onDetectLocation}
            disabled={isDetecting}
            title="Auto-detect GPS location"
            className="p-1.5 rounded-full glass-pill text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <MapPin className={`w-3.5 h-3.5 ${isDetecting ? 'animate-bounce text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={onRefresh}
            title="Refresh live data"
            className="p-1.5 rounded-full glass-pill text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenReport}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Battle Plan
          </button>
        </div>

      </div>
    </header>
  );
}
