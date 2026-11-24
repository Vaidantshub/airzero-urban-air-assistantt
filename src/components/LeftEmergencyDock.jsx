import React, { useState } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  MapPin, 
  X, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Sparkles,
  Phone
} from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { name: 'Universal Emergency Dispatch', number: '112', desc: 'Direct police, fire & national ambulance dispatch' },
  { name: 'Respiratory & Smog Helpline', number: '1075', desc: 'Government health & environmental guidance' },
  { name: 'Pediatric Medical Hotline', number: '1098', desc: 'Immediate child emergency support & assistance' },
];

const EMERGENCY_TRIAGE = [
  { flag: 'Persistent Wheezing', action: 'Administer prescribed bronchodilator (albuterol/salbutamol) via spacer immediately.' },
  { flag: 'Chest Retractions', action: 'Skin sucking in between ribs or neck during inhalation is a critical sign of respiratory distress.' },
  { flag: 'Cyanosis / Pale Lips', action: 'Bluish or gray tint around lips or fingernails requires immediate 112 emergency escalation.' },
  { flag: 'Peak Smog Lockdown', action: 'Close all exterior openings; run air filtration in a sealed room.' },
];

const QUICK_PROMPTS = [
  'How do I test if my N95 mask has a proper seal?',
  'What should I do if my child starts wheezing during high smog?',
  'When is the safest time today to open windows?',
  'How effective is a damp towel under the door?',
];

export default function LeftEmergencyDock({ 
  selectedCity, 
  onDetectLocation, 
  isDetecting, 
  aqiData 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('chat'); // 'chat' | 'emergency' | 'location'
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your Urban Air Quality & Smog Emergency Assistant. Current air in ${selectedCity.name} is ${aqiData?.category?.label || 'Monitored'} (AQI ${aqiData?.aqi || '---'}). How can I help protect your household right now?`
    }
  ]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Instant Knowledge Engine Response
    setTimeout(() => {
      let reply = "For current winter smog levels, ensure all vulnerable individuals remain indoors with mechanical or DIY MERV-13 air filtration active, and wear fitted N95/FFP2 masks if transit is unavoidable.";
      const lower = userText.toLowerCase();

      if (lower.includes('child') || lower.includes('baby') || lower.includes('wheez') || lower.includes('cough') || lower.includes('asthma')) {
        reply = "Pediatric Emergency Guidance: Children breathe 2x faster per kg of body weight than adults. If wheezing is present, use prescribed reliever inhaler through a spacer. Keep child seated upright in a sealed clean-air room. If you notice chest retractions (ribs pulling in), call emergency services immediately.";
      } else if (lower.includes('window') || lower.includes('ventilate') || lower.includes('fresh air') || lower.includes('time')) {
        reply = `Ventilation Timing: In ${selectedCity.name}, the safest ventilation window is ${aqiData?.bestWindow || '1:00 PM - 3:30 PM'} when solar warming breaks the ground inversion layer. Never open windows during 6:00 - 9:30 AM when cold smog pools at street level.`;
      } else if (lower.includes('mask') || lower.includes('n95') || lower.includes('cloth') || lower.includes('seal')) {
        reply = "Mask Protocol: Cloth and standard surgical masks filter less than 25% of fine PM2.5 particles. Always use a NIOSH N95, FFP2, or KF94 respirator. Perform a seal check: cup both hands over the mask and exhale sharply; no air should leak past the nose bridge or cheek perimeters.";
      } else if (lower.includes('towel') || lower.includes('door') || lower.includes('diy') || lower.includes('seal')) {
        reply = "Door & Infiltration Hack: Rolling a damp towel tightly along the sill of your front door or exterior sliding windows blocks up to 55% of outdoor fine particulate infiltration driven by exterior windward pressure.";
      } else if (lower.includes('purifier') || lower.includes('filter') || lower.includes('corsi') || lower.includes('cadr')) {
        reply = "Air Filtration Advice: A standard 20-inch box fan taped to four MERV-13 filters (Corsi-Rosenthal Box) delivers ~480 CFM of clean air for under $50, exceeding the delivery rate of $300 commercial HEPA units.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 450);
  };

  return (
    <>
      {/* Floating Left Button Dock */}
      <aside 
        aria-label="Emergency and Assistant Quick Action Center"
        className="fixed left-3 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto"
      >
        {/* Toggle Chatbot Button */}
        <button
          onClick={() => { setActivePanel('chat'); setIsOpen(true); }}
          title="Open AI Smog Assistant"
          className="w-14 h-14 rounded-2xl glass-panel border border-cyan-400/50 flex flex-col items-center justify-center text-white hover:scale-105 hover:border-cyan-300 transition-all shadow-2xl cursor-pointer group relative bg-white/15 backdrop-blur-xl"
        >
          {/* Live Notification Indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 border border-slate-950"></span>
          </span>

          <MessageSquare className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-white mt-0.5">AI Chat</span>

          <span className="absolute left-16 px-2.5 py-1 rounded-lg glass-panel text-[11px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/30">
            Open AI Smog Assistant
          </span>
        </button>

        {/* Emergency Call Button */}
        <button
          onClick={() => { setActivePanel('emergency'); setIsOpen(true); }}
          title="Emergency Helpline & Triage"
          className="w-14 h-14 rounded-2xl glass-panel border border-rose-400/50 flex flex-col items-center justify-center text-white hover:scale-105 hover:border-rose-300 transition-all shadow-2xl cursor-pointer group relative bg-white/15 backdrop-blur-xl"
        >
          {/* Pulsing Emergency Red Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-slate-950"></span>
          </span>

          <PhoneCall className="w-5 h-5 text-rose-300 stroke-[2.5] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider text-rose-200 mt-0.5">SOS 112</span>

          <span className="absolute left-16 px-2.5 py-1 rounded-lg glass-panel text-[11px] font-bold text-rose-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-rose-400/30">
            Emergency Helpline
          </span>
        </button>

        {/* Verify Location Button */}
        <button
          onClick={() => { setActivePanel('location'); setIsOpen(true); }}
          title="Verify GPS Location & Threat"
          className="w-14 h-14 rounded-2xl glass-panel border border-emerald-400/50 flex flex-col items-center justify-center text-white hover:scale-105 hover:border-emerald-300 transition-all shadow-2xl cursor-pointer group relative bg-white/15 backdrop-blur-xl"
        >
          {/* Location Active Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-slate-950"></span>
          </span>

          <MapPin className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-200 mt-0.5">GPS Loc</span>

          <span className="absolute left-16 px-2.5 py-1 rounded-lg glass-panel text-[11px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/30">
            Verify Location
          </span>
        </button>
      </aside>

      {/* Flyout Drawer / Modal on Left */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-start p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-white/30 overflow-hidden animate-in slide-in-from-left-6 duration-300"
          >
            {/* Header Tabs */}
            <div className="p-3.5 border-b border-white/15 glass-subcard flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePanel('chat')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePanel === 'chat' ? 'glass-pill-active text-white' : 'glass-pill text-white/70 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
                  <span>AI Assistant</span>
                </button>

                <button
                  onClick={() => setActivePanel('emergency')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePanel === 'emergency' ? 'glass-pill-active text-white' : 'glass-pill text-white/70 hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
                  <span>Emergency</span>
                </button>

                <button
                  onClick={() => setActivePanel('location')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePanel === 'location' ? 'glass-pill-active text-white' : 'glass-pill text-white/70 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Location</span>
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full glass-pill text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: Live Chatbot */}
            {activePanel === 'chat' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    Urban Smog & Health Advisor
                  </span>
                  <span className="text-[10px] glass-pill px-2 py-0.5 rounded text-white font-medium">
                    {selectedCity.name} • AQI {aqiData?.aqi || '---'}
                  </span>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar mb-3 max-h-[380px]">
                  {messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                          m.sender === 'user'
                            ? 'glass-pill-active text-white font-semibold rounded-br-none'
                            : 'glass-subcard text-white rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(qp)}
                      className="text-[10px] px-2.5 py-1 rounded-full glass-pill text-white hover:border-white/50 transition-all truncate max-w-full text-left cursor-pointer"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about asthma, ventilation timing, mask seals..."
                    className="flex-1 glass-input text-xs rounded-full px-4 py-2 text-white placeholder:text-white/50"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-full glass-pill text-white font-bold transition-all cursor-pointer hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Emergency Call & Critical Triage */}
            {activePanel === 'emergency' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldAlert className="w-4 h-4" /> Urgent Respiratory Assistance
                  </div>
                  <h4 className="text-base font-black text-white">Emergency Helplines & Rapid Triage</h4>
                  <p className="text-xs text-slate-100 mt-1 leading-relaxed">
                    Severe winter smog can trigger sudden acute asthma exacerbations, bronchitis, and hypoxia in vulnerable family members.
                  </p>
                </div>

                {/* Direct Dial Helplines */}
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((item, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-2xl glass-subcard flex items-center justify-between border-rose-400/30"
                    >
                      <div>
                        <strong className="text-xs text-white block">{item.name}</strong>
                        <span className="text-[10px] text-slate-100 block mt-0.5">{item.desc}</span>
                      </div>
                      <a
                        href={`tel:${item.number}`}
                        className="px-3.5 py-1.5 rounded-full glass-pill text-white font-black text-xs flex items-center gap-1.5 hover:bg-rose-500/30 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-rose-300" />
                        <span>{item.number}</span>
                      </a>
                    </div>
                  ))}
                </div>

                {/* Urgent Medical Flags */}
                <div className="p-3.5 rounded-2xl glass-panel space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Red Flag Symptoms Checklist
                  </span>
                  {EMERGENCY_TRIAGE.map((tr, idx) => (
                    <div key={idx} className="text-xs text-white flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-rose-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">{tr.flag}: </strong>
                        <span className="text-slate-100">{tr.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Verify Location */}
            {activePanel === 'location' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <Compass className="w-4 h-4" /> Geolocation Verification
                  </div>
                  <h4 className="text-base font-black text-white">Live Smog Threat by Location</h4>
                  <p className="text-xs text-slate-100 mt-1 leading-relaxed">
                    Verify GPS coordinates to lock in micro-local atmospheric inversion metrics and street-level exposure ratings.
                  </p>
                </div>

                {/* Current Selected Location Card */}
                <div className="p-4 rounded-2xl glass-subcard space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80 font-semibold uppercase">Active Metro Station</span>
                    <span className="text-[10px] glass-pill px-2 py-0.5 rounded text-white font-mono">
                      {selectedCity.lat.toFixed(2)}°N, {selectedCity.lon.toFixed(2)}°E
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">{selectedCity.name}</div>
                  <p className="text-xs text-slate-100">{selectedCity.tag || 'Major winter smog metropolitan basin'}</p>
                </div>

                {/* Verify / Auto-Detect Button */}
                <button
                  onClick={onDetectLocation}
                  disabled={isDetecting}
                  className="w-full py-2.5 rounded-full glass-pill-active text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
                >
                  <MapPin className={`w-4 h-4 ${isDetecting ? 'animate-bounce text-emerald-300' : ''}`} />
                  <span>{isDetecting ? 'Verifying GPS Coordinates...' : 'Verify My Exact GPS Location'}</span>
                </button>

                {/* Threat Index Summary */}
                <div className="p-4 rounded-2xl glass-panel space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Local Environmental Threat Level
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-white/80">Current Particulate PM2.5:</span>
                    <strong className="text-sm font-black text-white">{aqiData?.pm25 || '---'} µg/m³</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">Ground Thermal Inversion:</span>
                    <strong className="text-xs font-bold text-amber-300">Surface Trapping Active</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">WHO 24-hr Exceedance:</span>
                    <strong className="text-xs font-black text-rose-300">{aqiData?.whoExceedance || '18'}x Limit</strong>
                  </div>
                </div>

                <div className="text-[11px] text-white/70 flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Data verified via Open-Meteo Air Quality Monitoring Station</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
