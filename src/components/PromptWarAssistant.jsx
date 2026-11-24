import React, { useState } from 'react';
import { 
  Award, 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Flame, 
  Baby, 
  Wrench, 
  HelpCircle,
  Cpu
} from 'lucide-react';

const PRESET_PROMPTS = [
  {
    id: 'pediatric',
    title: 'Pediatric Asthma Winter Smog Emergency Plan',
    category: 'Vulnerable Family Protocol',
    icon: Baby,
    summary: 'Clinical-grade protocol for an asthmatic child living in a city with AQI > 250.',
    prompt: `You are an expert pediatric pulmonologist and environmental health specialist.
Task: Create an actionable, hour-by-hour Winter Smog Mitigation Plan for a family with a 6-year-old child diagnosed with mild persistent asthma in an urban area where current outdoor PM2.5 is 220 µg/m³ (Severe Smog / AQI 270).

Constraints & Requirements:
1. Hourly Routine: Define specific actions for 07:00 (morning wake up & school transit), 12:00 (lunch & recess guidance), 15:30 (afternoon pickup), and 20:00 (bedroom sleep preparation).
2. Mask & Gear: Specify exact respirator certification required (N95 vs KF94 vs surgical) and how to test for seal on a child's face.
3. Indoor Clean Air Zone: Provide instructions to maintain bedroom PM2.5 below 15 µg/m³ using low-cost air filtration.
4. Red Flag Symptoms: List 4 immediate warning signs (chest retractions, wheeze frequency) that require emergency medical escalation.
5. Format: Output as a crisp, bulleted checklist with bold operational steps. Avoid generic fluff.`,
  },
  {
    id: 'budget_diy',
    title: 'Zero-Budget Apartment Smog Lockdown & DIY Purifier',
    category: 'Engineering & Low Cost Hacks',
    icon: Wrench,
    summary: 'Maximum aerosol reduction for renters on a strict $30-$50 budget.',
    prompt: `You are an aerosol scientist and practical DIY bio-defense engineer.
Task: Design a low-cost, maximum-efficiency indoor air purification and leak-sealing strategy for a 650 sq ft rental apartment during a severe winter inversion (outdoor AQI 320). The total budget is under $50.

Specifications:
1. DIY Corsi-Rosenthal Box optimization: Specify filter rating (MERV-13 vs HEPA), fan type, and the aerodynamic reason why a cardboard shroud ring increases airflow by 35-40%.
2. Draft Proofing: Detail 3 zero-cost hacks to seal leaky windows and door sweeps without damaging rental paint/surfaces.
3. Cooking Emissions Control: Give the exact 3-step kitchen ventilation protocol to prevent cooking PM2.5 spikes when outdoor air cannot be brought in.
4. Carbon Dioxide vs Smog Tradeoff: How to calculate the exact 15-minute afternoon window when outdoor smog dips to exchange indoor CO2 without poisoning the living space.`,
  },
  {
    id: 'school_carpool',
    title: 'School Community Low-Emission Clean Air Zone Initiative',
    category: 'Community Low-Emission Routine',
    icon: ShieldAlert,
    summary: 'Parent-teacher committee proposal to cut morning school gate smog by 60%.',
    prompt: `You are an urban planner specializing in low-emission school transit zones and public health advocacy.
Task: Draft a concise, high-impact proposal for a school principal and parent-teacher association to eliminate dangerous toxic smog hot-spots at the school entrance during winter mornings (07:30 - 08:30).

Key Elements to Address:
1. The "Anti-Idling" Enforcement Plan: Practical policy and gentle signage to stop parents leaving car engines running with heaters on during drop-off.
2. Staggered Arrival & Carpool Matrix: A simple 3-tier neighborhood carpooling model that cuts incoming vehicle volume by 50%.
3. Indoor Clean Room Protocol: How the school can convert the gym or library into a positive-pressure "Clean Air Sanctuary" for high-AQI recess days.
4. Measurable KPI: Define 2 metrics the parent committee can track with a low-cost outdoor air sensor to demonstrate success.`,
  },
  {
    id: 'biomass_swap',
    title: 'Winter Inversion Physics & Clean Domestic Heating Guide',
    category: 'Public Health Education',
    icon: Flame,
    summary: 'Explaining temperature inversions and clean heating swaps to non-technical citizens.',
    prompt: `You are a climate communicator and atmospheric physicist.
Task: Write a compelling, accessible, 400-word advisory for urban homeowners explaining why winter smog is exponentially more dangerous than summer pollution, and how domestic heating habits directly contribute to neighborhood air toxicity.

Structure:
1. The "Cold Inversion Lid" Metaphor: Explain atmospheric thermal inversion using a simple everyday kitchen metaphor (like a saucepan with a lid).
2. The Combustion Reality: Contrast the particulate footprint of wood/biomass fireplaces vs electric heat pump or radiant heaters (cite standard EPA particulate emission ratios).
3. The 3 Smart Habits: 3 practical heating adjustments that keep a family warm while reducing neighborhood emissions today.
4. Tone: Urgent yet empowering, free of academic jargon.`,
  },
];

const SIMULATED_KNOWLEDGE_BASE = [
  {
    keywords: ['exercise', 'jog', 'run', 'walk', 'gym'],
    answer: `When outdoor AQI exceeds 150 (and especially >200 in winter smog), outdoor cardiovascular exercise must be suspended. During aerobic exercise, your minute ventilation volume spikes from 6-8 L/min up to 60-100 L/min, and oral breathing bypasses nasal filtration, depositing fine PM2.5 deep into pulmonary alveoli. Shift your workout indoors and run a HEPA or Corsi-Rosenthal unit on Medium speed in the workout room.`
  },
  {
    keywords: ['mask', 'n95', 'cloth', 'surgical', 'kn95'],
    answer: `Cloth masks and surgical masks are completely ineffective against winter smog particulate (they filter only 10-30% of PM2.5). You need a certified respirator: NIOSH N95, FFP2 (European), or KF94 (Korean). The most critical factor is the facial perimeter seal: if air leaks around your nose bridge or cheeks, filtration efficiency drops by over 60%. Use masks with an adjustable metal nose clip.`
  },
  {
    keywords: ['fan', 'merv', 'cadr', 'purifier', 'box fan', 'diy'],
    answer: `Yes! A 20-inch box fan paired with MERV-13 filters (the Corsi-Rosenthal box) is validated by UC Davis and Harvard aerosol labs. It achieves ~450–550 CFM of clean air delivery rate (CADR), outperforming many $300 commercial purifiers. Crucial hack: always attach a cardboard shroud ring (a circle with 15" diameter cut in cardboard taped to the fan face) to prevent air vortex recirculation at the blade tips!`
  },
  {
    keywords: ['window', 'ventilation', 'stale', 'co2', 'air out'],
    answer: `During winter inversions, outdoor air is dirtiest during early morning (6–9 AM) and late evening (8–11 PM) due to cold air trapping emissions. The safest window to crack windows for a quick 10-15 minute flush of indoor CO2 is between 1:00 PM and 3:30 PM, when solar radiation warms the surface and partially breaks the inversion layer.`
  },
  {
    keywords: ['cooking', 'kitchen', 'stove', 'gas'],
    answer: `Stir-frying, oil searing, or gas stoves can spike indoor PM2.5 above 400 µg/m³ in minutes. Always turn your exhaust hood on High 5 minutes BEFORE igniting burners to establish chimney draft, keep the kitchen door closed to isolate other living areas, and continue exhaust for 10 minutes after cooking.`
  }
];

export default function PromptWarAssistant({ currentAqi, cityName }) {
  const [selectedPrompt, setSelectedPrompt] = useState(PRESET_PROMPTS[0]);
  const [copied, setCopied] = useState(false);
  
  // Custom Prompt Builder State
  const [customRole, setCustomRole] = useState('Pediatric Pulmonologist');
  const [familyMembers, setFamilyMembers] = useState('Toddler (2 yrs) and Elderly Grandparent');
  const [homeType, setHomeType] = useState('Mid-rise Apartment (leaky windows)');
  const [budgetTier, setBudgetTier] = useState('Strict budget (< $50)');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedCustom, setCopiedCustom] = useState(false);

  // AI Q&A Simulator
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your Urban Air Quality & Smog Defense AI. Ask me anything about winter inversion smog, N95 mask seals, DIY purifier construction, or low-emission family routines!`
    }
  ]);

  const handleCopy = (text, setCopiedFn) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const handleGenerateCustomPrompt = () => {
    const prompt = `You are a world-class ${customRole} and environmental health strategist.
Context:
- Location: ${cityName} (Current Outdoor AQI: ${currentAqi || 185})
- Household Profile: ${familyMembers}
- Living Space: ${homeType}
- Financial Constraints: ${budgetTier}

Task:
Produce a hyper-tailored Winter Smog Survival & Low-Emission Living Guide for this specific household.

Specific Requirements:
1. Hourly Tactical Schedule: Detail specific protective actions from morning school/commute through evening bedtime.
2. Low-Cost Engineering Hacks: Provide 3 tangible indoor air improvements that strictly fit within the "${budgetTier}" constraint.
3. Tailpipe & Home Emission Reduction: Detail 2 practical routine swaps the family can make this week to minimize their own contribution to local urban smog.
4. Clinical Risk Checklist: Specific symptoms to watch out for based on the household vulnerabilities, and emergency home triage protocols before hospital transport.

Format as clean, executive markdown with clear actionable headings and zero generic filler.`;
    setGeneratedPrompt(prompt);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    setChatInput('');

    // Find match in knowledge base
    const lower = userText.toLowerCase();
    const match = SIMULATED_KNOWLEDGE_BASE.find(item => 
      item.keywords.some(k => lower.includes(k))
    );

    const reply = match ? match.answer : `Regarding your question on "${userText}": During winter smog episodes (AQI ~${currentAqi || 185}), prioritize keeping bedroom PM2.5 below 15 µg/m³ with active filtration (like a Corsi-Rosenthal box), seal exterior door thresholds with draft stoppers, set car ventilation to Recirculate, and wear a well-fitted N95/KF94 mask for any outdoor transit.`;

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Hackathon Prompt War Header */}
      <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-purple-300" /> Hack2Skill Prompt War Mission
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            AI Smog Assistant & Prompt Engineering Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 mt-1 max-w-2xl leading-relaxed">
            Designed for the Hackathon's <strong>Prompt War</strong> problem statement: Helping families beat winter smog with low-emission routines and indoor air hacks. Use these benchmark-tested prompt blueprints or generate custom prompts for your submission.
          </p>
        </div>

        <div className="flex items-center gap-2 glass-subcard px-3.5 py-2 rounded-xl">
          <Terminal className="w-5 h-5 text-purple-300" />
          <div className="text-right">
            <span className="text-[10px] text-white/80 block font-semibold">Prompt Quality</span>
            <span className="text-sm font-black text-white">Leaderboard Ready</span>
          </div>
        </div>
      </div>

      {/* Preset Master Prompt Blueprints */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-purple-300" />
          Curated Battle-Tested Prompt Blueprints
        </h3>
        <p className="text-xs text-slate-100 mb-4">
          Click any blueprint below to inspect the engineered system prompt with role definition, constraints, and chain-of-thought instructions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROMPTS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPrompt.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPrompt(item)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'glass-pill-active text-white'
                    : 'glass-subcard text-white/80 hover:text-white hover:border-white/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider glass-pill px-2 py-0.5 rounded text-white">
                      {item.category}
                    </span>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-100 mt-1 line-clamp-2 leading-relaxed">{item.summary}</p>
                </div>
                <span className="text-[10px] text-white font-bold mt-3 block">
                  {isSelected ? '● Active Blueprint' : 'Click to inspect'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Prompt Display & Copy */}
        <div className="mt-4 p-4 rounded-2xl glass-subcard relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-300" />
              Engineered Prompt Code: {selectedPrompt.title}
            </span>
            <button
              onClick={() => handleCopy(selectedPrompt.prompt, setCopied)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl glass-pill text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
            </button>
          </div>
          <pre className="text-xs text-white font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto no-scrollbar p-3 glass-input rounded-xl">
            {selectedPrompt.prompt}
          </pre>
        </div>
      </div>

      {/* Dynamic Custom Prompt Generator */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          Dynamic Family Prompt Compiler
        </h3>
        <p className="text-xs text-slate-100 mb-4">
          Customize family variables and generate a tailored prompt to paste into Claude, GPT, or Gemini for instant high-score evaluations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-white block mb-1.5">Target AI Persona / Role</label>
            <select
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full glass-input text-xs rounded-xl p-2.5 text-white outline-none cursor-pointer"
            >
              <option value="Pediatric Pulmonologist" className="bg-slate-900 text-white">Pediatric Pulmonologist</option>
              <option value="Aerosol Environmental Scientist" className="bg-slate-900 text-white">Aerosol Environmental Scientist</option>
              <option value="Community Low-Emission Urban Planner" className="bg-slate-900 text-white">Community Low-Emission Urban Planner</option>
              <option value="Zero-Budget Bio-Defense Engineer" className="bg-slate-900 text-white">Zero-Budget Bio-Defense Engineer</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-white block mb-1.5">Household Demographics</label>
            <input
              type="text"
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
              placeholder="e.g. Newborn + 70yo asthmatic"
              className="w-full glass-input text-xs rounded-xl p-2.5 text-white outline-none placeholder:text-white/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white block mb-1.5">Residence & Building Type</label>
            <input
              type="text"
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              placeholder="e.g. 2BHK rental apartment"
              className="w-full glass-input text-xs rounded-xl p-2.5 text-white outline-none placeholder:text-white/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white block mb-1.5">Budget & Equipment Constraint</label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="w-full glass-input text-xs rounded-xl p-2.5 text-white outline-none cursor-pointer"
            >
              <option value="Strict zero budget ($0 using household items)" className="bg-slate-900 text-white">Zero Budget ($0 items only)</option>
              <option value="Strict budget (< $50 for DIY box fan purifier)" className="bg-slate-900 text-white">Budget &lt; $50 (DIY box fan)</option>
              <option value="Moderate budget ($100 - $200 for HEPA filters)" className="bg-slate-900 text-white">Moderate ($100 - $200)</option>
              <option value="Unconstrained commercial clean air infrastructure" className="bg-slate-900 text-white">Full Commercial Setup</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleGenerateCustomPrompt}
            className="text-xs font-black px-4 py-2.5 rounded-full glass-pill text-white flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Cpu className="w-3.5 h-3.5" />
            Compile Custom Hackathon Prompt
          </button>

          {generatedPrompt && (
            <button
              onClick={() => handleCopy(generatedPrompt, setCopiedCustom)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl glass-pill text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedCustom ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCustom ? 'Prompt Copied!' : 'Copy Compiled Prompt'}
            </button>
          )}
        </div>

        {generatedPrompt && (
          <div className="mt-4 p-4 rounded-2xl glass-subcard">
            <pre className="text-xs text-white font-mono whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto no-scrollbar">
              {generatedPrompt}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive AI Smog Knowledge Assistant */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-cyan-300" />
          Interactive Smog Defense AI Simulator
        </h3>
        <p className="text-xs text-slate-100 mb-4">
          Test real family queries against the embedded air quality & low-emission knowledge base.
        </p>

        {/* Chat Stream */}
        <div className="space-y-3 max-h-64 overflow-y-auto p-4 rounded-2xl glass-subcard mb-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'glass-pill-active text-white font-semibold rounded-br-none'
                    : 'glass-subcard text-white rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about exercise during smog, mask fit, DIY filters, or cooking..."
            className="flex-1 glass-input text-xs rounded-full px-4 py-2.5 text-white placeholder:text-white/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full glass-pill text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5" />
            Ask AI
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-white/70 font-semibold">Quick suggestions:</span>
          {[
            'Can I exercise outdoors today?',
            'Do cloth masks filter PM2.5?',
            'How to make a Corsi-Rosenthal box?',
            'When should I open windows?',
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setChatInput(q);
              }}
              className="text-[10px] px-2.5 py-0.5 rounded-full glass-pill text-white hover:text-white transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
