import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Wind, 
  Activity, 
  Flame, 
  TrendingDown
} from 'lucide-react';

export default function AqiOverview({ data, loading, onJumpToPlanner, onJumpToIndoor }) {
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800/80 animate-pulse p-8 text-center">
        <div>
          <Wind className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Fetching real-time atmospheric & particulate data...</p>
          <p className="text-slate-500 text-xs mt-1">Connecting to Open-Meteo Air Quality Monitoring Station</p>
        </div>
      </div>
    );
  }

  const { aqi, pm25, pm10, no2, o3, category, whoExceedance, timeline, bestWindow, peakDanger, city, updatedAt } = data;

  const getAqiColorBadge = (val) => {
    if (val <= 50) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val <= 100) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    if (val <= 150) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    if (val <= 200) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (val <= 300) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    return 'text-red-400 border-red-600/40 bg-red-600/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className={`p-4 rounded-2xl border ${category.border} ${category.bg} backdrop-blur-sm transition-all`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border ${category.border} bg-slate-950/60`}>
              <AlertTriangle className={`w-5 h-5 ${category.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Current Smog Status • {city}
                </span>
                <span className="text-[10px] text-slate-500">Updated {updatedAt}</span>
              </div>
              <h2 className={`text-lg sm:text-xl font-bold ${category.text}`}>
                {category.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {category.desc}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
            <span className="text-xs text-slate-400">WHO Guideline (5 µg/m³)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-rose-400">{whoExceedance}x</span>
              <span className="text-xs font-semibold text-rose-300">over limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Core AQI Dial */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">US EPA Air Quality Index</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tight text-white">{aqi}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getAqiColorBadge(aqi)}`}>
                AQI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Scale: 0 (Pure) to 500 (Severe Emergency). In winter inversions, cold air traps particulate at ground level.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Inversion Risk:</span>
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> High Morning Trap
            </span>
          </div>
        </div>

        {/* Card 2: Particulates Breakdown */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Microscopic Particulates</span>
              <Wind className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">PM 2.5 (Fine)</span>
                <div className="text-2xl font-black text-rose-400 mt-1">{pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 mt-1 block">Penetrates deep into lungs & bloodstream</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">PM 10 (Coarse)</span>
                <div className="text-2xl font-black text-amber-400 mt-1">{pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 mt-1 block">Dust, vehicle brake wear & construction</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>NO₂: <strong className="text-slate-200">{no2} µg/m³</strong></span>
            <span>O₃: <strong className="text-slate-200">{o3} µg/m³</strong></span>
          </div>
        </div>

        {/* Card 3: Winter Smog Window Advisor */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Daily Smog Windows</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Best Ventilation Window
                  </span>
                  <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Safest Slot
                  </span>
                </div>
                <p className="text-sm font-bold text-white mt-1">{bestWindow}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Solar heating breaks surface inversion layer, dispersing particulate.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Peak Smog Danger
                  </span>
                  <span className="text-[10px] font-semibold uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                    Lock Windows
                  </span>
                </div>
                <p className="text-sm font-bold text-white mt-1">{peakDanger}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Night cooling + morning commute exhaust = maximum ground-level toxicity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={onJumpToPlanner}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Plan Family Schedule &rarr;
            </button>
            <button
              onClick={onJumpToIndoor}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Indoor Purifier Hacks &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 24-Hour Smog Projection Timeline */}
      <div className="p-6 rounded-2xl glass-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              24-Hour Smog Forecast & Activity Window
            </h3>
            <p className="text-xs text-slate-400">
              Hour-by-hour particulate projection. Green indicates safe ventilation / school transit slots.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Safe (&lt;100)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Severe Smog
            </span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-end gap-2.5 min-w-[700px] h-36 pt-4">
            {timeline.map((item, idx) => {
              const maxVal = 300;
              const barHeight = Math.min(100, Math.max(15, (item.aqi / maxVal) * 100));
              let barColor = 'bg-emerald-500';
              if (item.aqi > 100 && item.aqi <= 150) barColor = 'bg-yellow-500';
              if (item.aqi > 150 && item.aqi <= 200) barColor = 'bg-orange-500';
              if (item.aqi > 200 && item.aqi <= 250) barColor = 'bg-rose-500';
              if (item.aqi > 250) barColor = 'bg-purple-600';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-950 border border-slate-700 text-slate-200 text-[10px] rounded px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                    {item.time} — AQI {item.aqi} ({item.category.label})
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 mb-1">
                    {item.aqi}
                  </span>
                  
                  <div 
                    style={{ height: `${barHeight}%` }} 
                    className={`w-full rounded-t-md transition-all group-hover:brightness-125 ${barColor} opacity-85 hover:opacity-100`}
                  />
                  
                  <span className="text-[9px] text-slate-500 mt-2 font-mono whitespace-nowrap">
                    {item.time.replace(':00', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
