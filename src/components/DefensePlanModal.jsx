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

Prepared with AuraCare Urban Air Quality Assistant
================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Family Winter Smog Battle Card</h3>
              <p className="text-xs text-slate-400">{city} • Generated for today's forecast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans">
          
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Today's Risk Index</span>
              <div className="text-base font-bold text-white mt-0.5">
                {category.label} (AQI {aqi})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Best Window</span>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{bestWindow}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              1. Ventilation & Transit Protocol
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
              <li>Open windows for fresh air exchange only between <strong>1:00 PM and 3:30 PM</strong>.</li>
              <li>Keep all windows locked and sealed during early morning commute hours (6:00 - 9:30 AM).</li>
              <li>Ensure children wear fitted N95/KF94 masks during school bus pickup or walking.</li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              2. Clean Air Bedroom Sanctuary
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
              <li>Run the DIY Corsi-Rosenthal box or HEPA unit continuously on Low speed.</li>
              <li>Place rolled towels or foam tape along bottom of doors leading outside.</li>
              <li>Maintain bedroom humidity at 40-50% to precipitate airborne particulate.</li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              3. Pediatric & Senior Health Flags
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
              <li>Keep fast-acting inhalers within immediate reach of asthmatic members.</li>
              <li>Cancel outdoor running, sports training, and heavy outdoor labor.</li>
              <li>Rinse eyes with saline if burning sensation or conjunctival irritation occurs.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Ready for printing or fridge mounting</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
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
