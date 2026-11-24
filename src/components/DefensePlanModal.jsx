import React, { useState } from 'react';
import { ShieldCheck, X, Printer, Copy, Check, Wind, AlertTriangle, Home } from 'lucide-react';

export default function DefensePlanModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { city, aqi, pm25, category, bestWindow, peakDanger, updatedAt } = data;

  const planText = `================================================
FAMILY WINTER SMOG DEFENSE BATTLE PLAN
City: ${city} | Current AQI: ${aqi} (${category.label})
Fine Particulate PM2.5: ${pm25} µg/m³
Updated: ${updatedAt}
================================================

1. CRITICAL SMOG TIMING
• Safest Ventilation & Outdoor Window: ${bestWindow}
  (Solar warming lifts ground inversion layer. Open windows for 10-15 mins only)
• Peak Toxic Smog Danger: ${peakDanger}
  (Lock all exterior doors and windows. Do not exercise outdoors)

2. DAILY FAMILY DEFENSE ACTIONS
[ ] Check child & commuter backpacks for certified N95 / KF94 masks
[ ] Set vehicle air conditioning intake to 'Cabin Recirculate' mode
[ ] Seal door bottoms & window sills with rolled towels or foam tape
[ ] Damp-mop hard surfaces (do not dry sweep fine soot into air)
[ ] Run DIY Corsi-Rosenthal Box / HEPA purifier in bedroom on Low speed

3. KITCHEN & HOME HEATING DISCIPLINE
[ ] Turn range hood exhaust ON 5 minutes BEFORE cooking begins
[ ] Avoid burning unseasoned wood or biomass in indoor fireplaces
[ ] Keep indoor relative humidity between 40% and 50% so dust settles

4. EMERGENCY PULMONARY ESCALATION
Seek immediate medical attention if child or elderly family member shows:
- Persistent wheezing unresponsive to bronchodilator
- Intercostal retractions (ribs sucking inward during breathing)
- Lethargy, pale skin, or bluish tint around lips

Prepared with AIRZERO Urban Air Quality Assistant
================================================`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="defense-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
    >
      <div className="glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/30">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/15 flex items-center justify-between glass-subcard">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl glass-pill text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 id="defense-modal-title" className="text-base font-bold text-white">Family Winter Smog Battle Card</h3>
              <p className="text-xs text-slate-100">{city} • Generated for today's forecast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Battle Plan Modal"
            className="p-1.5 rounded-full glass-pill text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-white font-sans">
          
          <div className="p-3.5 rounded-2xl glass-subcard flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/80 uppercase font-semibold">Today's Risk Index</span>
              <div className="text-base font-black text-white mt-0.5">
                {category.label} (AQI {aqi})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/80 uppercase font-semibold">Best Window</span>
              <div className="text-xs font-black text-emerald-300 mt-0.5">{bestWindow}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-300" />
              1. Ventilation & Transit Protocol
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-100 leading-relaxed">
              <li>Open windows for fresh air exchange only between <strong>1:00 PM and 3:30 PM</strong>.</li>
              <li>Keep all windows locked and sealed during early morning commute hours (6:00 - 9:30 AM).</li>
              <li>Ensure children wear fitted N95/KF94 masks during school bus pickup or walking.</li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <Home className="w-3.5 h-3.5 text-emerald-300" />
              2. Clean Air Bedroom Sanctuary
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-100 leading-relaxed">
              <li>Run the DIY Corsi-Rosenthal box or HEPA unit continuously on Low speed.</li>
              <li>Place rolled towels or foam tape along bottom of doors leading outside.</li>
              <li>Maintain bedroom humidity at 40-50% to precipitate airborne particulate.</li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              3. Pediatric & Senior Health Flags
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-100 leading-relaxed">
              <li>Keep fast-acting inhalers within immediate reach of asthmatic members.</li>
              <li>Cancel outdoor running, sports training, and heavy outdoor labor.</li>
              <li>Rinse eyes with saline if burning sensation or conjunctival irritation occurs.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/15 glass-subcard flex items-center justify-between">
          <span className="text-[11px] text-white/80 font-medium">Ready for printing or fridge mounting</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label="Copy battle plan text to clipboard"
              className="px-3.5 py-1.5 rounded-full glass-pill text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              aria-label="Print battle plan card"
              className="px-4 py-1.5 rounded-full glass-pill text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Battle Card
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
