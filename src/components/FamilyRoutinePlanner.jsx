import React, { useState, useMemo, useCallback } from 'react';
import { 
  Users, 
  Baby, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Dog, 
  ShieldCheck, 
  Car, 
  Flame, 
  CheckSquare, 
  ChevronRight
} from 'lucide-react';

const PROFILES = Object.freeze([
  { id: 'baby', label: 'Infant / Toddler', icon: Baby, risk: 'Extreme (Immature Lungs)', tip: 'Breathing rate is 2x adults; keep floor-level air clean (particulate settles near ground).' },
  { id: 'elderly', label: 'Senior / Asthmatic', icon: HeartPulse, risk: 'High Cardiovascular Risk', tip: 'Keep emergency bronchodilator on hand; avoid any outdoor exertion when AQI > 150.' },
  { id: 'school', label: 'School Child', icon: GraduationCap, risk: 'High Morning Exposure', tip: 'Coordinate with school for indoor recess during smog peaks; ensure fitted N95/FFP2 for commute.' },
  { id: 'commuter', label: 'Daily Commuter', icon: Briefcase, risk: 'Direct Traffic Exhaust', tip: 'Set car ventilation to Recirculate (Cabin air) before entering tunnel or congested intersections.' },
  { id: 'pets', label: 'Household Pets', icon: Dog, risk: 'Ground-Level Particulate', tip: 'Wipe paws & coat with damp cloth after walks to prevent tracking toxic soot into sleeping areas.' },
]);

const EMISSIONS_SAVINGS_MAP = Object.freeze({
  carpool: { co2: '3.4 kg', pm25Avoided: '42 g', badge: '65% emission reduction vs solo car' },
  metro: { co2: '6.8 kg', pm25Avoided: '90 g', badge: '90% emission reduction + zero road exhaust' },
  solocar: { co2: '0 kg', pm25Avoided: '0 g', badge: 'High baseline tailpipe emissions' },
  cycle: { co2: '7.5 kg', pm25Avoided: '100 g', badge: 'Zero emission (Only when AQI < 100 with N95)' },
});

/**
 * FamilyRoutinePlanner Component
 * Personalized vulnerable-group routines, commute mode emission calculations,
 * and smog lockdown action checklist.
 */
export default function FamilyRoutinePlanner({ aqiData }) {
  const [selectedProfiles, setSelectedProfiles] = useState(['school', 'elderly']);
  const [commuteMode, setCommuteMode] = useState('carpool');
  const [heatingMode, setHeatingMode] = useState('heatpump');
  const [checklist, setChecklist] = useState({
    sealDoors: true,
    n95Packed: true,
    cabinRecirc: false,
    wetMop: true,
    diyPurifierOn: true,
  });

  const currentAqi = aqiData?.aqi || 188;

  const toggleProfile = useCallback((id) => {
    setSelectedProfiles((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter(p => p !== id) : prev;
      }
      return [...prev, id];
    });
  }, []);

  const toggleCheck = useCallback((key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Memoized low emission savings calculation
  const emissionsSaved = useMemo(() => {
    return EMISSIONS_SAVINGS_MAP[commuteMode] || EMISSIONS_SAVINGS_MAP.carpool;
  }, [commuteMode]);

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-300" /> Family Defense Protocol • Local AQI: {currentAqi}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Personalized Low-Emission Winter Routines
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 mt-1 max-w-2xl leading-relaxed">
            Winter temperature inversions trap tailpipe and biomass exhaust right at street level. Select your family makeup to customize daily smog protection windows and green daily swaps.
          </p>
        </div>

        <div className="flex items-center gap-2 glass-subcard px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <div className="text-right">
            <span className="text-[10px] text-white/80 block font-semibold">Active Defenses</span>
            <span className="text-sm font-black text-white">
              {Object.values(checklist).filter(Boolean).length} of 5 Active
            </span>
          </div>
        </div>
      </div>

      {/* Household Profile Selection */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          1. Who is in your household? (Select all that apply)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROFILES.map((prof) => {
            const Icon = prof.icon;
            const selected = selectedProfiles.includes(prof.id);
            return (
              <button
                key={prof.id}
                onClick={() => toggleProfile(prof.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selected
                    ? 'glass-pill-active text-white'
                    : 'glass-subcard text-white/80 hover:text-white hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-xl ${selected ? 'bg-white text-slate-950 font-bold' : 'glass-pill text-white'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {selected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                </div>

                <div className="mt-3">
                  <span className="text-xs font-bold block text-white">{prof.label}</span>
                  <span className="text-[10px] text-amber-300 font-medium block mt-0.5">
                    {prof.risk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Vulnerabilities Advice */}
        <div className="mt-4 pt-4 border-t border-white/15 space-y-2">
          {selectedProfiles.map(id => {
            const p = PROFILES.find(item => item.id === id);
            if (!p) return null;
            return (
              <div key={id} className="flex items-start gap-2.5 text-xs text-white glass-subcard p-3 rounded-xl">
                <ChevronRight className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">{p.label}: </strong>
                  <span className="text-slate-100">{p.tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Optimization: Morning Commute & Low Emission Swaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Commute Strategy */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-300" />
                2. Morning School & Work Commute Optimization
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider glass-pill px-2.5 py-0.5 rounded text-white">
                Low-Emission
              </span>
            </div>

            <p className="text-xs text-slate-100 mb-4 leading-relaxed">
              Idling in morning school pick-up zones creates toxic micro-environments where PM2.5 can spike &gt;450 µg/m³. Choose your family transit mode:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'carpool', label: 'School Carpool', desc: 'Pool 3 families, cuts 2 cars off road' },
                { id: 'metro', label: 'Electric Metro / Bus', desc: 'Zero street exposure, high filtration' },
                { id: 'solocar', label: 'Solo Vehicle Drive', desc: 'Cabin air filter must be fresh' },
                { id: 'cycle', label: 'Brisk Walk / Cycle', desc: 'Only when AQI < 100 with N95 mask' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setCommuteMode(mode.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    commuteMode === mode.id
                      ? 'glass-pill-active text-white'
                      : 'glass-subcard text-white/80 hover:text-white hover:border-white/40'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">{mode.label}</span>
                  <span className="text-[10px] text-slate-100 mt-0.5 block">{mode.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl glass-subcard flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/80 block">Daily Emission Impact</span>
                <span className="text-xs font-semibold text-emerald-300">{emissionsSaved.badge}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-white">{emissionsSaved.co2} CO₂</span>
                <span className="text-[10px] text-white/70 block">Saved today</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-slate-100">
            <strong className="text-white">Pro-Tip for Drivers:</strong> Always press the <strong>Cabin Air Recirculation button</strong> (the car with the curved arrow). It routes cabin air through the pollen/HEPA filter and cuts incoming exhaust particulate by up to 80%.
          </div>
        </div>

        {/* Clean Winter Heating & Home Practice */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-300" />
                3. Zero-Smog Winter Heating Protocol
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider glass-pill px-2.5 py-0.5 rounded text-white">
                Indoor Air Hack
              </span>
            </div>

            <p className="text-xs text-slate-100 mb-4 leading-relaxed">
              Heating homes with unseasoned wood, coal, or biomass during winter is the #1 domestic driver of local smog inversions.
            </p>

            <div className="space-y-2.5">
              {[
                { 
                  id: 'heatpump', 
                  title: 'Electric Heat Pump / Inverter AC in Heat Mode', 
                  benefit: 'Zero indoor combustion, 3.5x more energy efficient than resistance heaters.',
                  tag: 'Recommended'
                },
                { 
                  id: 'radiator', 
                  title: 'Oil-Filled Electric Radiator + Draft Stopper', 
                  benefit: 'Gentle radiant warmth without burning dust or drying air excessively.',
                  tag: 'Low-Emission'
                },
                { 
                  id: 'biomass', 
                  title: 'Fireplace / Solid Fuel Stoves', 
                  benefit: 'WARNING: Emits up to 300x more PM2.5 than electric heat inside living spaces.',
                  tag: 'Avoid During Inversions'
                },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setHeatingMode(item.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    heatingMode === item.id
                      ? 'glass-pill-active text-white'
                      : 'glass-subcard text-white/80 hover:text-white hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.tag.includes('Avoid') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'glass-pill text-white'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-100 mt-1 leading-relaxed">{item.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-slate-100">
            <strong className="text-white">The 2°C Thermostat Hack:</strong> Lowering winter thermostat by just 2°C and wearing thermal layers cuts household heating emissions by 14% across the winter season.
          </div>
        </div>

      </div>

      {/* Daily Smog Defense Checklist */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4 text-emerald-300" />
          4. Today's Family Smog Checklist (Interactive Daily Tracker)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'sealDoors', label: 'Door & Window Weatherstripping', desc: 'Placed rolled towels or foam tape at bottom of exterior doors to prevent draft infiltration.' },
            { key: 'n95Packed', label: 'N95 / FFP2 Masks in Backpacks', desc: 'Fitted particulate masks for all children & commuters (cloth masks do not stop PM2.5).' },
            { key: 'cabinRecirc', label: 'Car AC Set to Recirculate', desc: 'Switched off fresh air intake on vehicles before navigating arterial smog corridors.' },
            { key: 'wetMop', label: 'Wet-Mop Hard Floors', desc: 'Used damp microfiber mop instead of broom to trap fine soot without resuspension.' },
            { key: 'diyPurifierOn', label: 'Corsi-Rosenthal Box Running', desc: 'Box fan filter running on Low speed in child/elderly bedroom for continuous CADR.' },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => toggleCheck(item.key)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                checklist[item.key]
                  ? 'glass-pill-active text-white'
                  : 'glass-subcard text-white/80 hover:text-white hover:border-white/40'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist[item.key]}
                onChange={() => {}}
                className="mt-0.5 rounded text-white focus:ring-white border-white/40 bg-white/10 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold block text-white">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-100 mt-1 block leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
