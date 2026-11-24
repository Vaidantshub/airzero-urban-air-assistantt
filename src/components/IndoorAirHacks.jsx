import React, { useState } from 'react';
import { 
  Sparkles, 
  DollarSign, 
  Sliders, 
  Layers, 
  Flame, 
  Droplets, 
  TreePine,
  Copy,
  Check
} from 'lucide-react';

export default function IndoorAirHacks() {
  // Room dimensions in feet
  const [roomLength, setRoomLength] = useState(16);
  const [roomWidth, setRoomWidth] = useState(14);
  const [ceilingHeight, setCeilingHeight] = useState(9);
  const [copiedBom, setCopiedBom] = useState(false);

  // Calculations
  const roomArea = roomLength * roomWidth; // sq ft
  const roomVolume = roomArea * ceilingHeight; // cu ft
  // EPA / CDC recommendation: at least 4 to 6 air changes per hour (ACH) for smoke/smog defense
  const targetAch = 5;
  const requiredCadr = Math.round((roomVolume * targetAch) / 60); // CFM (Cubic Feet per Minute)

  // DIY Corsi-Rosenthal Box specs:
  // Standard 20" box fan with 4 x MERV-13 filters delivers ~450 - 550 CFM of clean air.
  const crBoxCadr = 480;

  const diyCost = 45; // $45 estimated parts cost
  const commercialPurifierCost = 260; // Average comparable 450 CFM commercial purifier
  const moneySaved = commercialPurifierCost - diyCost;

  const actualAch = Math.round(((crBoxCadr * 60) / roomVolume) * 10) / 10;

  const copyBom = () => {
    const text = `Corsi-Rosenthal Box (DIY Air Purifier) Bill of Materials:
1. 1x 20-inch standard 3-speed box fan ($20)
2. 4x MERV-13 furnace filters (20"x20"x2" or 20"x20"x1") ($24)
3. 1x roll of standard duct tape or painter's tape ($4)
4. 1x cardboard bottom base & cardboard circular shroud
Estimated Clean Air Delivery: ~480 CFM (Handles up to 600 sq ft room with 5 ACH)
Total Cost: ~$48 (Saves >$200 vs commercial HEPA units)`;
    navigator.clipboard.writeText(text);
    setCopiedBom(true);
    setTimeout(() => setCopiedBom(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900/80 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Engineering Hack Lab
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Indoor Air Hacks & DIY Purifier Sizing Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Commercial HEPA purifiers for large family rooms can cost $300-$500. A DIY Corsi-Rosenthal Box delivers higher Clean Air Delivery Rate (CADR) for under $50 using standard MERV-13 filters.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-2 rounded-xl">
          <DollarSign className="w-5 h-5 text-cyan-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Average Family Savings</span>
            <span className="text-sm font-bold text-emerald-400">${moneySaved} Saved / Unit</span>
          </div>
        </div>
      </div>

      {/* Interactive DIY Purifier Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Interactive Room CADR & Purifier Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Adjust your living room or bedroom dimensions to calculate required airflow.
            </p>
          </div>
          <button
            onClick={copyBom}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copiedBom ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedBom ? 'BOM Copied!' : 'Copy Parts List (BOM)'}
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Room Length:</span>
              <span className="text-cyan-400 font-mono font-bold">{roomLength} ft ({Math.round(roomLength * 0.3048 * 10) / 10} m)</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              value={roomLength}
              onChange={(e) => setRoomLength(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Room Width:</span>
              <span className="text-cyan-400 font-mono font-bold">{roomWidth} ft ({Math.round(roomWidth * 0.3048 * 10) / 10} m)</span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Ceiling Height:</span>
              <span className="text-cyan-400 font-mono font-bold">{ceilingHeight} ft ({Math.round(ceilingHeight * 0.3048 * 10) / 10} m)</span>
            </div>
            <input
              type="range"
              min="7"
              max="16"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Room Volume</span>
            <span className="text-lg font-black text-white mt-1 block">{roomVolume.toLocaleString()} cu ft</span>
            <span className="text-[10px] text-slate-500">~{roomArea} sq ft floor</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Clean Air (CADR)</span>
            <span className="text-lg font-black text-amber-400 mt-1 block">{requiredCadr} CFM</span>
            <span className="text-[10px] text-slate-500">For 5 Air Changes/hr</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Corsi-Rosenthal CADR</span>
            <span className="text-lg font-black text-emerald-300 mt-1 block">{crBoxCadr} CFM</span>
            <span className="text-[10px] text-emerald-400/80 font-medium">Exceeds requirement!</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actual Air Turnover</span>
            <span className="text-lg font-black text-cyan-400 mt-1 block">{actualAch} ACH</span>
            <span className="text-[10px] text-slate-500">Filters entire room in {Math.round(60 / actualAch)}m</span>
          </div>
        </div>

        {/* Build Blueprint Guide */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            DIY Corsi-Rosenthal Box Assembly Blueprint
          </h4>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
            <li>
              <strong className="text-white">Build the Cube:</strong> Tape 4 MERV-13 filters (20"x20") into a square column with arrows pointing <em>inward</em> toward the center.
            </li>
            <li>
              <strong className="text-white">Seal the Bottom:</strong> Cut a 20"x20" cardboard base and tape it securely to the bottom opening so air can only enter through the filters.
            </li>
            <li>
              <strong className="text-white">Mount the Fan:</strong> Place a 20" box fan on top blowing <em>upward/outward</em>, and duct tape the edges airtight.
            </li>
            <li>
              <strong className="text-white">The Secret Cardboard Shroud (+40% Boost):</strong> Cut a 15-inch circular hole in a cardboard sheet and tape it to the front face of the fan. This eliminates blade tip vortex backflow and boosts clean air airflow by nearly 40%!
            </li>
          </ol>
        </div>
      </div>

      {/* 4 Essential Zero-Cost Indoor Smog Hacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Hack 1: Kitchen Exhaust Protocol */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" /> Hack #1: Kitchen Cooking Exhaust
            </div>
            <h4 className="text-sm font-bold text-white">The 5-Minute Pre-Exhaust Rule</h4>
            <p className="text-xs text-slate-300 mt-1.5">
              Stir-frying, oil searing, and gas stoves generate PM2.5 concentrations exceeding 400 µg/m³ inside closed winter homes—worse than the street outside!
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Action:</strong> Turn on your range hood exhaust on High <strong>5 minutes before</strong> lighting the stove to establish a negative pressure drafting column, and keep it on for 10 minutes post-cooking with kitchen door closed.
            </div>
          </div>
        </div>

        {/* Hack 2: Wet Cleaning vs Dry Sweeping */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Droplets className="w-4 h-4" /> Hack #2: Floor Dust Resuspension
            </div>
            <h4 className="text-sm font-bold text-white">Wet Microfiber Mop vs Broom</h4>
            <p className="text-xs text-slate-300 mt-1.5">
              Dry sweeping with conventional brooms kicks settled toxic heavy metal and tire soot particles right back into the toddler and pet breathing zone (0–3 ft off the ground).
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Action:</strong> Switch exclusively to damp microfiber flat mopping. Water surface tension traps PM2.5/PM10 permanently in the mop head instead of aerosolizing it.
            </div>
          </div>
        </div>

        {/* Hack 3: Winter Humidity Sweet Spot */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Droplets className="w-4 h-4" /> Hack #3: Particulate Settling Physics
            </div>
            <h4 className="text-sm font-bold text-white">Maintain 40% – 50% Indoor Humidity</h4>
            <p className="text-xs text-slate-300 mt-1.5">
              In bone-dry heated winter air (&lt;25% RH), fine aerosol particles remain airborne indefinitely. At 45% relative humidity, moisture adheres to PM2.5, increasing aerodynamic diameter and causing them to precipitate onto surfaces faster.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Zero-Cost Hack:</strong> Place a shallow pan of water near heating radiators or hang damp laundry in the bedroom to naturally stabilize humidity.
            </div>
          </div>
        </div>

        {/* Hack 4: NASA Clean Air Plants */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TreePine className="w-4 h-4" /> Hack #4: Nighttime Bedroom Oxygenation
            </div>
            <h4 className="text-sm font-bold text-white">Snake Plants (Sansevieria) for Closed Rooms</h4>
            <p className="text-xs text-slate-300 mt-1.5">
              When bedrooms are sealed tight against winter smog, indoor CO2 spikes past 1,800 ppm, causing morning headaches and sluggishness.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Biological Hack:</strong> Unlike most plants, Snake Plants perform Crassulacean Acid Metabolism (CAM), meaning they absorb CO2 and release clean oxygen <em>at night</em> while filtering traces of formaldehyde and benzene.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
