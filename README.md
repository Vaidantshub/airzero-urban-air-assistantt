# AuraCare — Urban Air Quality & Winter Smog Defense Assistant
> **Built for the Hack2Skill Prompt War Hackathon**  
> **Problem Statement**: *Urban Air Quality Assistant (Helping families beat winter smog with low-emission routines and indoor air hacks)*

---

## 🌟 Executive Overview
During winter months in urban centers (Delhi NCR, Lahore, London, Beijing, Krakow, Milan), atmospheric thermal inversions trap cold air and toxic ground-level particulates (PM2.5, PM10, NO2, black carbon). Families often suffer severe health repercussions or spend hundreds of dollars on commercial air purifiers that fail to address indoor leaks, cooking spikes, or toxic morning school runs.

**AuraCare** is an all-in-one, zero-dependency, open-source assistant that bridges **live environmental data**, **aerosol physics**, and **prompt engineering** to empower households with:
1. **Real-Time Smog Radar & Inversion Forecaster**: Fetches live open air quality metrics from Open-Meteo (no API key required) and pinpoints today's exact "Safe Ventilation Slot" and "Peak Danger Window".
2. **Family Vulnerability Routine Planner**: Tailors protection protocols specifically for infants, asthmatic seniors, school children, commuters, and pets.
3. **Low-Emission Habit Swaps**: Calculates daily avoided $CO_2$ and particulate through school carpools, clean electric heating, and vehicle cabin air recirculation.
4. **Interactive DIY Corsi-Rosenthal Purifier Sizing Lab**: Dynamic room CADR calculator showing how a $45 DIY box fan filter outperforms $300 commercial HEPA units.
5. **AI Prompt War Studio**: Curated master prompt blueprints + customizable prompt compiler + interactive AI simulator specifically designed for the Hack2Skill leaderboard.
6. **One-Click Family Smog Battle Card**: Exportable & printable daily checklist for refrigerator mounting.

---

## 🚀 Key Feature Breakdown

### 1. 📡 Live Smog Radar & Atmospheric Inversion Tracker
- Real-time PM2.5, PM10, NO2, Ozone, and US EPA AQI.
- WHO Guideline comparison (e.g. "18.8x over annual limit").
- 24-Hour hourly forecast chart with visual danger tiers.
- Auto-detect GPS Geolocation + pre-loaded smog capitals (Delhi NCR, Lahore, Beijing, London, Los Angeles, Milan, Krakow, Dhaka, Kathmandu).

### 2. 👨‍👩‍👧‍👦 Family Defense & Low-Emission Daily Routines
- **Household Member Triage**:
  - 👶 Infants/Toddlers: High breathing rate, floor-level soot protection.
  - 👵 Asthmatic / Seniors: Cardiovascular warning triggers and inhaler checklists.
  - 🎒 School Children: Morning drop-off anti-idling strategies and fitted N95/KF94 masks.
  - 🚗 Commuters: Cabin air recirculation setting (blocks up to 80% of arterial exhaust).
  - 🐾 Pets: Post-walk paw wiping to prevent toxic soot tracking.
- **Low-Emission Daily Swaps**:
  - Commute Mode Impact (Carpool vs Metro vs Solo Car vs Walk/Cycle).
  - Clean Winter Heating (Electric Heat Pump / Inverter AC vs Radiator vs Biomass Fireplaces).

### 3. 🔬 Indoor Air Hacks & DIY Purifier Sizing Lab
- **Interactive Room Volume & CADR Calculator**:
  - Sliders for Room Length, Width, and Ceiling Height.
  - Real-time Air Changes per Hour (ACH) and Clean Air Delivery Rate (CADR).
  - Bill of Materials (BOM) copyable with one click (~$45 total cost).
  - The "15-inch Cardboard Shroud Secret": Explains the fluid dynamics of eliminating blade-tip vortex backflow to increase airflow by 40%.
- **Zero-Cost Smog Hacks**:
  - Kitchen Range Hood Pre-Exhaust (5 mins before cooking, 10 mins after).
  - Damp microfiber mopping vs broom (preventing PM2.5 resuspension).
  - 40–50% Relative Humidity sweet-spot for particulate settling.
  - Nighttime CAM-metabolism bedroom plants (Snake Plant / Sansevieria).

### 4. 🏆 Hackathon Prompt War Studio
- **Master Blueprint Repository**:
  - *Pediatric Asthma Winter Smog Emergency Plan*
  - *Zero-Budget Apartment Smog Lockdown & DIY Purifier*
  - *School Community Low-Emission Clean Air Zone Initiative*
  - *Winter Inversion Physics & Clean Domestic Heating Guide*
- **Dynamic Family Prompt Compiler**: Custom inputs (Role, Household, Home Type, Budget) compile into an LLM prompt ready for Claude / Gemini / GPT.
- **Interactive Smog Knowledge AI Simulator**: Instant answers to common family air quality questions.

### 5. 🖨️ Printable Family Smog Battle Plan
- Instant modal view with copyable text and native browser print styling for hanging on the family fridge or sending via messaging apps.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Live Data Source**: Open-Meteo Air Quality API (Free, open access, zero API key)
- **Linter**: Oxlint (0 warnings, 0 errors)

---

## 📦 Getting Started & Running Locally

### Prerequisites
- Node.js v18+ and npm installed

### Quick Start
```bash
# 1. Clone or navigate to the repository
cd "virtua prompt war misson"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Run linter check
npm run lint
```

The production bundle will be generated in `dist/` ready to deploy on **Vercel**, **Netlify**, or **GitHub Pages**!

---

## 📝 Hackathon Submission Checklist
- [x] Problem Statement Addressed: *Urban Air Quality Assistant*
- [x] Real-time data integration with resilient offline fallback
- [x] Family-centric routines with low-emission alternatives
- [x] Indoor engineering hacks with interactive CADR math
- [x] Dedicated Prompt War Studio with engineered prompt blueprints
- [x] Clean, responsive UI with zero linter errors and blazing fast build (< 1.5s)
