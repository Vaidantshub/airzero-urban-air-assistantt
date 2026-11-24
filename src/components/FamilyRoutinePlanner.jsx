import React, { useState } from 'react';
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

const PROFILES = [
  { id: 'baby', label: 'Infant / Toddler', icon: Baby, risk: 'Extreme (Immature Lungs)', tip: 'Breathing rate is 2x adults; keep floor-level air clean (particulate settles near ground).' },
  { id: 'elderly', label: 'Senior / Asthmatic', icon: HeartPulse, risk: 'High Cardiovascular Risk', tip: 'Keep emergency bronchodilator on hand; avoid any outdoor exertion when AQI > 150.' },
  { id: 'school', label: 'School Child', icon: GraduationCap, risk: 'High Morning Exposure', tip: 'Coordinate with school for indoor recess during smog peaks; ensure fitted N95/FFP2 for commute.' },
  { id: 'commuter', label: 'Daily Commuter', icon: Briefcase, risk: 'Direct Traffic Exhaust', tip: 'Set car ventilation to Recirculate (Cabin air) before entering tunnel or congested intersections.' },
  { id: 'pets', label: 'Household Pets', icon: Dog, risk: 'Ground-Level Particulate', tip: 'Wipe paws & coat with damp cloth after walks to prevent tracking toxic soot into sleeping areas.' },
];

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

  const toggleProfile = (id) => {
    if (selectedProfiles.includes(id)) {
      if (selectedProfiles.length > 1) {
        setSelectedProfiles(selectedProfiles.filter(p => p !== id));
      }
    } else {
      setSelectedProfiles([...selectedProfiles, id]);
    }
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Low emission savings calculation
  const emissionsSaved = {
    carpool: { co2: '3.4 kg', pm25Avoided: '42 g', badge: '65% emission reduction vs solo car' },
    metro: { co2: '6.8 kg', pm25Avoided: '90 g', badge: '90% emission reduction + zero road exhaust' },
    solocar: { co2: '0 kg', pm25Avoided: '0 g', badge: 'High baseline tailpipe emissions' },
    cycle: { co2: '7.5 kg', pm25Avoided: '100 g', badge: 'Zero emission (Only when AQI < 100 with N95)' },
  }[commuteMode];

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Family Defense Protocol • Local AQI: {currentAqi}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Personalized Low-Emission Winter Routines
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Winter temperature inversions trap tailpipe and biomass exhaust right at street level. Select your family makeup to customize daily smog protection windows and green daily swaps.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Active Defenses</span>
            <span className="text-sm font-bold text-white">
              {Object.values(checklist).filter(Boolean).length} of 5 Active
            </span>
          </div>
        </div>
      </div>

      {/* Household Profile Selection */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
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
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selected
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-lg ${selected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {selected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>

                <div className="mt-3">
                  <span className="text-xs font-bold block">{prof.label}</span>
                  <span className="text-[10px] text-amber-400/90 font-medium block mt-0.5">
                    {prof.risk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Vulnerabilities Advice */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          {selectedProfiles.map(id => {
            const p = PROFILES.find(item => item.id === id);
            if (!p) return null;
            return (
              <div key={id} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">{p.label}: </strong>
                  {p.tip}
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
                <Car className="w-4 h-4 text-cyan-400" />
                2. Morning School & Work Commute Optimization
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Low-Emission
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
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
                  className={`p-3 rounded-xl border text-left transition-all ${
                    commuteMode === mode.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{mode.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{mode.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Emission Impact</span>
                <span className="text-xs font-semibold text-emerald-400">{emissionsSaved.badge}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-white">{emissionsSaved.co2} CO₂</span>
                <span className="text-[10px] text-slate-400 block">Saved today</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <strong className="text-slate-200">Pro-Tip for Drivers:</strong> Always press the <strong>Cabin Air Recirculation button</strong> (the car with the curved arrow). It routes cabin air through the pollen/HEPA filter and cuts incoming exhaust particulate by up to 80%.
          </div>
        </div>

        {/* Clean Winter Heating & Home Practice */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                3. Zero-Smog Winter Heating Protocol
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Indoor Air Hack
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
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
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    heatingMode === item.id
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.tag.includes('Avoid') ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <strong className="text-slate-200">The 2°C Thermostat Hack:</strong> Lowering winter thermostat by just 2°C and wearing thermal layers cuts household heating emissions by 14% across the winter season.
          </div>
        </div>

      </div>

      {/* Daily Smog Defense Checklist */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
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
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                checklist[item.key]
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist[item.key]}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-slate-900 cursor-pointer"
              />
              <div>
                <span className={`text-xs font-bold block ${checklist[item.key] ? 'text-white' : 'text-slate-400'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
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
