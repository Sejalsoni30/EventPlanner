# 🎉 CelebrateAI — Intelligent Celebration & Event Orchestrator

> **Challenge 5: Celebration & Event Planner** — AI-powered event planning for individuals and corporate teams.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-5.x-6E9F18?logo=vitest)](https://vitest.dev)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-brightgreen?logo=github&style=for-the-badge)](https://sejalsoni30.github.io/EventPlanner/)

**🌐 Live Demo:** [https://sejalsoni30.github.io/EventPlanner/](https://sejalsoni30.github.io/EventPlanner/)

---

## 📌 Problem Statement Alignment (Challenge 5)

CelebrateAI directly addresses **Challenge 5 — Celebration & Event Planner** by providing:

| Challenge Requirement | CelebrateAI Implementation |
|---|---|
| Help individuals and teams plan events | Interactive 3-step Event Setup Wizard |
| Budget management | Smart Budget Allocator (5 tiers, sums to 100%) |
| Schedule and timeline management | Dynamic Hourly Itinerary Generator (10–14 items) |
| Guest management | RSVP & Milestone Checklist Board (Kanban-style) |
| AI-driven orchestration | Gemini 2.0 Flash API integration with mock fallback |
| Communication tools | Personalized vendor & guest communication scripts |
| Multiple event types | Birthday, Wedding, Corporate Gala, College Fest, Anniversary, Tech Conference |

---

## 🚀 Features

### 1. Interactive Event Setup Wizard
A guided 3-step form with real-time validation:
- **Step 1**: Event name, type (6 categories), date, venue
- **Step 2**: Guest count, total budget (INR/USD), theme/vibe (8 presets + custom)
- **Step 3**: Review summary, optional notes, optional Gemini API key

### 2. AI-Powered Event Synthesis Engine

#### 🕐 Dynamic Hourly Itinerary
Auto-generates a full event-day timeline from setup to teardown with:
- Time slots, duration, activity description
- Designated POC (Point of Contact) roles
- Category badges: Setup, Guest, Program, Catering, Break, Teardown

#### 💰 Smart Budget Allocator
Divides total budget into 5 evidence-based tiers:
| Tier | Allocation |
|------|-----------|
| 🏛️ Venue & Decor | 40% |
| 🍽️ Catering & Bar | 30% |
| 🎶 Entertainment & AV | 15% |
| 🚚 Logistics & Permits | 10% |
| 🛡️ Emergency Reserve | 5% |

**Guaranteed**: All percentages always sum to exactly **100%**.

#### 📝 Communication Script Generator
Synthesizes 4 context-aware templates:
1. **Guest Invite** (Email) — themed, formal invitation
2. **Dietary Reminder** (WhatsApp) — pre-event dietary confirmation
3. **Vendor Negotiation** (Email) — structured vendor inquiry
4. **Thank You Note** (Email) — post-event appreciation message

### 3. RSVP & Checklist Board
Kanban-style milestone management with:
- **Status columns**: To Do → In Progress → Completed
- **Priority tags**: 🔴 Critical, 🟠 High, 🔵 Normal (click-to-cycle)
- Overall progress bar with percentage complete
- Filter by priority; collapse/expand detail cards
- Auto-generated milestones with due dates relative to event date

---

## 🧠 Gen AI Architecture

### Prompt Design Strategy

CelebrateAI uses a **structured JSON prompt** with the Gemini 2.0 Flash model:

```
Model: gemini-2.0-flash
Temperature: 0.8 | Top-K: 40 | Top-P: 0.95 | Max Tokens: 4096
```

#### Itinerary Prompt Pattern
```
"Generate 10–14 itinerary items covering full event day from venue 
 setup to teardown, specific to [EventType] and [Theme] theme, 
 with realistic time slots and designated POC roles."
```

#### Budget Prompt
Budget allocation is handled deterministically in code (not by AI) to ensure mathematical precision — 40/30/15/10/5% always sums to 100%.

#### Communication Scripts Prompt Pattern
```
"Generate 4 vendor scripts: Invite (Email), DietaryReminder (WhatsApp),
 VendorNegotiation (Email), ThankYou (Email). 
 Tone: formal yet warm, specific to [EventType] and [GuestCount] guests."
```

### Fallback Architecture
If no API key is provided, or if the Gemini API call fails, the system automatically switches to a **rich mock generator** that produces:
- Event-type-specific itinerary templates (6 complete variants)
- Fully personalized vendor scripts with event name/date/theme injection

```
User submits form
      │
      ▼
  API Key provided?
  ┌───┴───┐
  Yes     No
  │       │
  ▼       ▼
Gemini   Mock
API      Generator
  │       │
  └───┬───┘
      ▼
Event Plan Dashboard
```

---

## 🧪 Test Suite Documentation

### Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode (re-runs on file change)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Test Coverage

Located in `src/__tests__/eventPlanner.test.tsx` — **50+ test cases** across 6 describe blocks:

| Test Suite | Cases | What It Tests |
|---|---|---|
| `calculateBudgetDistribution` | 14 | Percentage sums, tier amounts, currency, edge cases, error throwing |
| `validateEventInput` | 17 | Empty names, negative guests, zero budgets, past dates, multiple errors |
| `filterGuestMilestones` | 12 | Status/priority filtering, sort order, combined filters, immutability |
| `groupMilestonesByStatus` | 5 | Grouping accuracy, empty buckets |
| `BudgetBreakdown` (UI) | 5 | Rendering, tier display, progress bars |
| `ChecklistBoard` (UI) | 7 | Heading, progress, Kanban columns, filter buttons, expand, interactions |

### Test Stack
- **Vitest 5.x** — Fast native ESM test runner
- **React Testing Library 16.x** — Component behavior testing
- **@testing-library/user-event** — Real user interaction simulation
- **jsdom** — Browser DOM environment
- **@testing-library/jest-dom** — Extended DOM matchers

---

## 🗂️ Folder Structure

```
d:/Event_Planner/
├── index.html                     # SEO-optimized HTML entry point
├── package.json                   # Dependencies & scripts
├── vite.config.ts                 # Vite + React + Tailwind config
├── vitest.config.ts               # Vitest + jsdom config
├── tsconfig.app.json              # TypeScript config
└── src/
    ├── main.tsx                   # React DOM entry point
    ├── App.tsx                    # Root app state manager
    ├── index.css                  # Global styles (Tailwind v4 + Inter font)
    ├── types/
    │   └── index.ts               # All TypeScript types & interfaces
    ├── utils/
    │   ├── budgetCalculator.ts    # Budget distribution + validation
    │   ├── milestoneUtils.ts      # Milestone filtering, grouping, generation
    │   └── aiGenerator.ts         # Gemini API + mock generator
    ├── components/
    │   ├── EventSetupWizard.tsx   # 3-step form wizard
    │   ├── EventDashboard.tsx     # Main dashboard layout
    │   ├── BudgetBreakdown.tsx    # Budget tiers with progress bars
    │   ├── ItineraryTimeline.tsx  # Chronological event timeline
    │   ├── ChecklistBoard.tsx     # Kanban milestone board
    │   ├── VendorScripts.tsx      # Tabbed communication templates
    │   └── LoadingScreen.tsx      # AI generation loading state
    └── __tests__/
        ├── setup.ts               # jest-dom setup
        └── eventPlanner.test.tsx  # Comprehensive test suite (50+ tests)
```

---

## ⚙️ Setup & Deployment

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd Event_Planner

# Install all dependencies
npm install

# Start development server (hot-reload)
npm run dev

# Open browser at http://localhost:5173
```

### Running Tests

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Production Build

```bash
npm run build             # Outputs to dist/
npm run preview           # Preview production build locally
```

### Using Gemini AI (Optional)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com)
2. In the wizard's **Step 3**, paste your API key in the Gemini API key field
3. If no key is provided, the app uses a rich mock generator automatically

### Environment Variable (Alternative)

Create a `.env` file at the project root:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks |
| **TypeScript** | Type safety across all modules |
| **Vite 8** | Lightning-fast dev server & bundler |
| **Tailwind CSS v4** | Utility-first styling with dark mode |
| **Lucide React** | Icon library (consistent, accessible) |
| **Gemini 2.0 Flash** | AI content generation (itinerary, scripts) |
| **Vitest 5** | Test runner (ESM-native, Vite-integrated) |
| **React Testing Library** | Component behavior testing |
| **jsdom** | Browser simulation for tests |

---

## ♿ Accessibility (WCAG 2.1)

- Semantic HTML5 elements: `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<ol>`
- ARIA attributes: `aria-label`, `aria-labelledby`, `aria-required`, `aria-invalid`, `aria-live`, `aria-expanded`, `aria-pressed`, `aria-checked`, `role="alert"`, `role="status"`, `role="progressbar"`
- Keyboard navigability: All interactive elements reachable via Tab key
- Focus states: Custom `focus:ring-2 focus:ring-purple-500` on all controls
- High-contrast text: Minimum 4.5:1 contrast ratio maintained
- Screen reader support: Descriptive `aria-label` on icon-only buttons

---

## 📄 License

MIT License. Built for the **Gen AI Challenge — Challenge 5: Celebration & Event Planner**.
