<!-- All code fences are properly closed; this README renders cleanly on GitHub. -->

<h1 align="center">credit-scoring-ui</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <br/>
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js"></a>
  <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript"></a>
  <a href="https://tailwindcss.com/"><img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4-38b2ac?logo=tailwindcss"></a>
</p>

> **Credit Scoring UI** — Front-end for a machine-learning powered credit scoring system.  
> Includes dashboards: **Overview**, **Factor Analysis**, **What-if Simulator**, **Profile**, **Settings**, **Help**.  
> Modern design with consistent **neon green (#00FF88)** branding, smooth performance, and extensible architecture.

---

## Table of Contents

1. [Screens & Features](#1-screens--features)  
2. [Tech Stack](#2-tech-stack)  
3. [Project Structure](#3-project-structure)  
4. [Getting Started](#4-getting-started)  
5. [Scripts](#5-scripts)  
6. [Environment Variables](#6-environment-variables)  
7. [Mock API & Data Flow](#7-mock-api--data-flow)  
8. [Backend Integration Guide](#8-backend-integration-guide)  
9. [Styling & Design System](#9-styling--design-system)  
10. [Libraries Reference](#10-libraries-reference)  
11. [Code Quality](#11-code-quality)  
12. [Troubleshooting](#12-troubleshooting)  
13. [Roadmap](#13-roadmap)  
14. [License](#14-license)

---

## 1. Screens & Features

- **Credit Score Overview** – Gauge, key metrics, trend chart, factor breakdown, alert feed.  
- **Credit Factor Analysis** – Correlation heatmap, ranking table, performance chart, global controls.  
- **What-if Scenario Simulator** – Control Panel, Timeline Slider, Visualization (Line/Area + Confidence Interval), Results Panel, Scenario Comparison (load/delete).  
- **Profile Management** – Profile completion (progress), avatar presets (glowing halo by preset color), personal information (inline edit, validation, Save button).  
- **Settings** – General, Security, Notifications, Data Export.  
- **Help & Support** – Help sections, FAQs, Contact Support.

> All pages are **responsive**, feature **micro-interactions** (Framer Motion), and keep the **neon green #00FF88** brand color consistent.

---

## 2. Tech Stack

- **Runtime/Framework**: Next.js 15 (Hybrid SSR/CSR), React 19  
- **Language**: TypeScript 5  
- **Styles**: Tailwind CSS 4 + CSS Variables (design tokens)  
- **Charts**: Recharts (primary), Chart.js (optional)  
- **Forms/State**: React Hook Form; Redux Toolkit included (use when you need global state)  
- **Animation**: Framer Motion  
- **Icons**: `lucide-react` (wrapper `AppIcon`)  
- **Utils**: axios, date-fns, PapaParse, jsPDF  
- **Linting**: ESLint (Next config) + Tailwind plugins

**Recommended Node LTS**: v20+.

---

## 3. Project Structure

> **Aliases (tsconfig)**:  
> `@/* → src/*`, `@styles/* → src/styles/*`, `@components/* → src/components/*`

<details>
  <summary><strong>Folder tree (click to expand)</strong></summary>

```text
src/
├─ components/
│  ├─ common/                 # selects, inputs, etc.
│  ├─ layouts/                # DashboardShell (page frame)
│  ├─ notifications/          # notification store
│  ├─ survey/                 # survey wizard
│  └─ ui/                     # button, input, sidebar, modal, ...
├─ configs/                   # section/survey configs
├─ contexts/                  # React contexts
├─ hooks/                     # custom hooks
├─ lib/
│  ├─ layout.ts
│  └─ mockApi.ts              # wrapper for Mock API calls
├─ pages/
│  ├─ api/mock/               # Next API routes (mock backend)
│  │  ├─ simulator/projection.ts
│  │  ├─ dashboard.ts
│  │  ├─ scenarios.ts
│  │  └─ simulate.ts
│  ├─ dashboard/
│  │  ├─ alert-management-dashboard/...
│  │  ├─ credit-factor-analysis-dashboard/...
│  │  ├─ credit-score-overview-dashboard/...
│  │  ├─ help-dashboard/...
│  │  ├─ profile-management-dashboard/...
│  │  ├─ settings-dashboard/...
│  │  └─ what-if-scenario-simulator-dashboard/...
│  ├─ _app.tsx
│  ├─ _document.tsx
│  ├─ index.tsx               # landing page
│  └─ survey.tsx
├─ styles/
│  └─ globals.css
└─ utils/
   └─ cn.ts                   # classNames helper

root/
├─ package.json
├─ next.config.ts
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ README.md
```
</details>

**Regenerate tree (optional):**
```bash
npx @hyrious/tree -L 4 -I "node_modules,.next,.git,dist,coverage" > STRUCTURE.txt
```

---

## 4. Getting Started

```bash
# 1) Check Node
node -v   # v20+ recommended

# 2) Install deps
npm install

# 3) Run dev
npm run dev
# -> http://localhost:3000

# 4) Production build
npm run build
npm run start
```

---

## 5. Scripts

```json
{
  "dev":   "next dev",
  "build": "next build",
  "start": "next start",
  "lint":  "next lint"
}
```

- **dev** – run development mode.  
- **build** – build production bundle.  
- **start** – run production server.  
- **lint** – run ESLint with Next config.

---

## 6. Environment Variables

Create **`.env.local`** at project root (do not commit):

```env
# Base URL of real backend (when not using mock API)
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com

# Toggle mock (depends on your mockApi.ts usage)
NEXT_PUBLIC_USE_MOCK=1
```

> Next.js auto-loads `.env.local` into `process.env` at runtime.  
> Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 7. Mock API & Data Flow

- **Mock location**: `src/pages/api/mock/*` (Next API routes).  
- **Wrapper**: `src/lib/mockApi.ts` exposes functions:

```
fetchDashboard()
simulateScenario(scenario, months)
saveScenario(scenario)
deleteScenario(id)
exportResults(data)
```

**Example Flow (Simulator):**

- `ScenarioControlPanel` updates inputs → debounced (300ms) → calls `simulateScenario`.  
- `ScenarioVisualization` receives `currentScenario` + `selectedTimeframe` to render Line/Area + CI.  
- `ResultsPanel` displays `projectedResults`, `factorImpacts`, `timeline`.  
- `ScenarioComparison` renders saved list; **Load** triggers `onLoadScenario(s)` to refresh the page state.

---

## 8. Backend Integration Guide

**Goal:** swap mock with real backend without touching UI components.

**Step 1 — Set base URL**

```ts
// src/lib/mockApi.ts (example)
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1';
```

**Step 2 — Switch endpoints**

```ts
import axios from 'axios';

export async function fetchDashboard() {
  if (USE_MOCK) {
    return (await fetch('/api/mock/dashboard')).json();
  }
  const { data } = await axios.get(`${BASE}/dashboard`);
  return data;
}

export async function simulateScenario(payload: any, months: number) {
  if (USE_MOCK) {
    const res = await fetch(`/api/mock/simulate?months=${months}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }
  const { data } = await axios.post(`${BASE}/simulate?months=${months}`, payload);
  return data;
}
```

**Step 3 — Suggested endpoint mapping**

- `GET /dashboard` → data for Overview.  
- `POST /simulate?months=12` → returns `projectedResults` (target score, CI, factor impacts, monthlyProgress).  
- `GET /simulator/projection?months=12` → line/area projection.  
- `POST /scenarios` (save), `DELETE /scenarios/:id`, `GET /scenarios` (list).  
- `POST /export` → export results (server returns file or downloadable URL).

**Step 4 — CORS & Auth**

- Enable CORS for the front-end domain.  
- If using Bearer tokens: add an axios interceptor to attach `Authorization`.

**Step 5 — Error handling**

- In `mockApi.ts`: wrap calls with `try/catch` and normalize errors `{ message, code }`.  
- In UI: show toast/inline errors and keep skeletons during loading.

---

## 9. Styling & Design System

- **Primary color**: Neon Green `#00FF88` (token: `--color-neon`).  
- **Text color**: avoid light gray for body text; prefer `text-foreground` or `#0F172A`.  
- **Pills & badges**: large radius, subtle shadows (`shadow-elevation-1/2`).  
- **Charts**: smooth Line/Area transitions; confidence interval in a lighter green; animate when toggling between line/area.  
- **Avatar presets**: background + halo by preset; glowing border on select.  
- **Tailwind 4**: several classes map to your CSS design tokens in `globals.css`.

---

## 10. Libraries Reference

- **UI/UX**: `framer-motion`, `lucide-react`  
- **Forms**: `react-hook-form`  
- **Charts**: `recharts`, `chart.js`, `react-chartjs-2`  
- **Data**: `axios`, `papaparse`, `date-fns`  
- **Build**: `next`, `tailwindcss`, `postcss`, `autoprefixer`  
- **Quality**: `eslint`, `eslint-config-next`

---

## 11. Code Quality

- **ESLint**: `npm run lint`  
- **ErrorBoundary**: `src/components/ui/ErrorBoundary.tsx`  
- **Naming**: components `PascalCase`, hooks `camelCase`, component files `.tsx`.  
- **Types**: define explicit interfaces for API responses (see `ResultsPanel.tsx`, `ScenarioComparison.tsx`).

---

## 12. Troubleshooting

- **“Unexpected token … Expected jsx identifier”**  
  → Usually caused by an *unclosed code block in README* or a bad merge. Verify all triple backticks ``` in README/MDX.

- **Lag when toggling Line ↔ Area**  
  → Add smooth motion transitions; avoid re-mounting the whole chart; memoize data.

- **CORS when connecting to backend**  
  → Enable CORS on the server or use a proxy in `next.config.ts`.

- **ENV not loading**  
  → Public variables must be prefixed with `NEXT_PUBLIC_`. Restart dev server after editing `.env.local`.

---

## 13. Roadmap

- Auth & Role integration  
- Server-side PDF/CSV export  
- Test suites (unit/E2E)  
- Dark mode  
- i18n

---

**Author**  
Truong Hoang Ngoc Nhi — @Lyfee-synr

If this project helps you, consider giving it a ⭐!
