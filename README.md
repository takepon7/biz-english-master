# Biz English Master

An AI-powered business English conversation trainer that simulates real workplace scenarios — from daily standups to difficult negotiations — and delivers instant, HR-grade feedback with Japanese coaching notes.

---

## Overview

Biz English Master helps professionals practice situation-specific business English in a safe, repeatable environment. Users select a workplace scenario, chat with an AI role-play partner (Google Gemini 2.5 Flash), and immediately receive a refactored version of their message alongside a detailed Japanese coaching note explaining *why* the suggested phrasing is more appropriate for that context.

The app ships as a **Progressive Web App (PWA)** and supports three company-culture modes (Tech Startup, Traditional Corporate, Global Team) to calibrate coaching style to the user's actual workplace.

---

## Screenshots

> _Screenshots coming soon._

| Landing / Scenario Select | Practice Screen | Coaching Feedback |
|---|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Practice](docs/screenshots/practice.png) | ![Feedback](docs/screenshots/feedback.png) |

---

## Key Features

- **12 Workplace Scenarios** — Coffee break small talk, pushing back on deadlines, reporting bad news, daily standups, goal-setting talks, and more
- **AI Role-Play Partner** — Powered by Gemini 2.5 Flash with streamed responses for a real-time conversation feel
- **Instant Refactored English** — Every message is rewritten into natural, situation-appropriate business English
- **Japanese Coaching Notes** — HR-perspective analysis explaining grammar, tone, and cultural nuance in Japanese
- **Text-to-Speech** — Tap to hear the refactored phrase using the Web Speech API
- **Company Culture Mode** — Switches coaching style between Tech Startup (BLUF, casual), Traditional Corporate (formal, indirect), and Global Team (plain, idiom-free)
- **Free / Pro Tier** — Free users get 5 AI turns per day; Pro users get unlimited access via Stripe subscription
- **PWA Support** — Installable on iOS and Android with offline-ready shell
- **Practice History** — Conversation history persisted in `localStorage`
- **Auth** — Sign-up / sign-in via Clerk; Pro status stored in Clerk `publicMetadata`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Framer Motion, Lucide React |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Auth | Clerk (`@clerk/nextjs` v6) |
| Payments | Stripe (subscription checkout + webhook) |
| PWA | `@ducanh2912/next-pwa` |
| Testing | Playwright (E2E) |
| Deployment | Vercel |

---

## Environment Variables

Create a `.env.local` file in the project root with the following keys. **Never commit values to version control.**

```env
# Google AI
GEMINI_API_KEY=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

# Stripe Payments
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
ADMIN_EMAIL=
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini 2.5 Flash |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |
| `CLERK_SECRET_KEY` | Clerk server-side secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Path for Clerk-hosted sign-in (e.g. `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Path for Clerk-hosted sign-up (e.g. `/sign-up`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `STRIPE_PRICE_ID` | Stripe Price ID for the Pro subscription (`price_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) |
| `NEXT_PUBLIC_APP_URL` | Production base URL used for Stripe redirect (e.g. `https://yourdomain.com`) |
| `ADMIN_EMAIL` | Comma-separated email(s) granted Pro access without a subscription |

---

## Local Development

**Prerequisites:** Node.js 20+, npm

```bash
# 1. Clone the repository
git clone https://github.com/your-username/biz-english-master.git
cd biz-english-master

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build          # Production build
npm run start          # Start production server
npm run lint           # ESLint
npm run test:e2e       # Playwright E2E tests
npm run test:e2e:ui    # Playwright with interactive UI
```

### Stripe Webhook (local)

To test the subscription flow locally, forward Stripe events using the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the displayed webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Author

**TKDR**
- GitHub: [@takeponn](https://github.com/takeponn)
- Email: takeponn7@gmail.com
