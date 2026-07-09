# PromptBurger

A structured prompt editor that turns rough ideas into polished, copy-ready prompts for Claude Code — with iterative AI refinement, version history, and diff tracking.

## What It Does

PromptBurger is a tool for composing high-quality prompts. Instead of writing prompts as raw text and hoping for the best, you fill in structured fields — roles, task description, context, constraints, examples — and the app assembles them into a single prompt, then streams it through Claude for refinement.

The interesting part is the iteration loop. After the first generation, you can tweak any input and hit "Re-grill." The app sends your updated inputs alongside the previous output and suggestions, so the AI improves incrementally rather than starting from scratch. Every refinement is auto-saved to a local history with token counts, cost estimates, and timestamps, and you can diff any two versions side-by-side to see exactly what changed.

No accounts, no API keys to paste in — visitors just open the site and use it. Prompt drafts and history live in the browser (localStorage); the only thing that leaves it is the refinement request to the app's own API.

## Tech Stack

- **React 19** + **TypeScript** — strict mode, no `any` types
- **Zustand 5** — state management with 5 slices (sidebar, canvas, settings, UI, history), persisted to localStorage
- **Vercel serverless functions** — a thin streaming proxy to the Anthropic API, plus usage tracking and rate limiting
- **Anthropic SDK** — server-side streaming with real-time token counting and cost tracking
- **Upstash Redis** (optional) — persistent usage stats and reliable rate limits
- **Tailwind CSS 4** — custom warm theme (cream/red-orange/gold palette)
- **Vite 7** — dev server and production builds
- **diff** library — powers the line-level prompt diff viewer

## Architecture

Split-pane SPA. The left sidebar holds structured input fields; the right canvas displays the streamed output with an always-editable prompt and a collapsible suggestions panel.

```
Sidebar inputs → prompt-assembler.ts → POST /api/refine ──→ Anthropic API
                 (builds markdown       (validates, rate      (streams back)
                  user message)          limits, records            │
                                         usage)                     │
Canvas ← prompt-utils.ts ←── NDJSON stream ────────────────────────┘
(editable output   (splits prompt
 + suggestions)     from suggestions)
```

The Anthropic API key never reaches the browser — it lives in a server-side environment variable, and `api/refine.ts` proxies the streaming call. The meta-prompt is applied server-side too, so the endpoint can only produce prompt refinements, not arbitrary Claude completions.

State flows through a Zustand store with clear separation: sidebar and settings are persisted, canvas and UI state are ephemeral. The `useRefine` hook orchestrates the full cycle — input validation, prompt assembly, API streaming, response parsing, stats calculation, and history saving.

Demo mode simulates the full streaming experience with pre-crafted responses and variable-speed chunking, so the app works fully offline too.

### Abuse protection

Because the service fronts a paid API key, `/api/refine` enforces:

- **Per-IP limits** — 10 prompts/hour and 30/day by default
- **A global daily cap** — 300 prompts/day across all visitors by default
- **A model allowlist and input size cap** — requests outside the app's shape are rejected

Limits are configurable via environment variables, and users get a friendly toast (with time-to-reset) when they hit one. As a final backstop, set a monthly spend limit on the API key in the Anthropic console.

### Admin dashboard

`/admin` is a password-protected dashboard (lazy-loaded, separate chunk) showing total prompts, estimated cost, token counts, a 14-day daily breakdown, per-IP visitor activity, and a recent request log including rate-limit hits and errors.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Plain `npm run dev` serves the frontend only — toggle Demo Mode to try the flow without a backend, run `npx vercel dev` to serve the API functions locally, or point the dev server at a deployment:

```bash
PB_API_PROXY=https://promptburger.app npm run dev
```

## Deployment (Vercel)

1. Set environment variables (see `.env.example`):
   - `ANTHROPIC_API_KEY` — required; powers refinements for all visitors
   - `ADMIN_PASSWORD` — required for `/admin`
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — recommended; provision a free Upstash Redis database via the Vercel Marketplace. Without it, rate limits and stats fall back to in-memory (best-effort, reset on instance recycle) and the admin page flags it.
   - `RATE_LIMIT_PER_HOUR` / `RATE_LIMIT_PER_DAY` / `RATE_LIMIT_GLOBAL_PER_DAY` — optional overrides
2. Deploy. `vercel.json` configures SPA rewrites and a 60s function timeout for streaming.

## Status

Shipped and functional. Built as an independent product over a few focused sessions. The codebase is clean — strict TypeScript, no dead code, proper error handling, and accessibility attributes throughout.
