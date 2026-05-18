# Open Bass Dashboard

Mobile-first AI-powered bass fishing intelligence PWA built for anglers actively fishing from a phone.

## What it is

Open Bass Dashboard is not a basic weather app, map app, or tackle shopping app. It is a fishing intelligence system that combines weather, moon/solunar, waterbody profiles, water temperature estimation, rule-based bait logic, saved gear, and a catch log.

## Current features

- Mobile-first React + TypeScript + Vite PWA
- Dark glassmorphism UI with bottom navigation
- Open-Meteo weather integration
- Offline app shell via service worker
- Local-first persistence with IndexedDB
- Bass Activity Score
- Water temperature estimation for ponds/lakes/rivers without sensors
- Moon phase and solunar influence scoring
- Rule-based fishing pattern engine
- Full bait database covering major bass techniques
- Hourly bait planner
- Gear matching with preloaded setups
- Catch log starter
- Map tab foundation

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL on your phone from the same Wi-Fi network.

## Build

```bash
npm run build
npm run preview
```

## Tech stack

- React
- TypeScript
- Vite
- Zustand
- IndexedDB via idb-keyval
- Open-Meteo API
- Leaflet dependency included for future interactive maps

## Project structure

```text
open-bass-dashboard/
├── public/
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── components/
│   ├── data/
│   ├── engine/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── styles.css
├── README.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## Important note

Fishing recommendations are generated with deterministic rule-based scoring. This avoids random suggestions and makes the system easier to inspect, improve, and contribute to.
