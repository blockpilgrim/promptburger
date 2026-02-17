# PromptBurger

A structured prompt editor that turns rough ideas into polished, copy-ready prompts for Claude Code — with iterative AI refinement, version history, and diff tracking.

## What It Does

PromptBurger is a local-first tool for composing high-quality prompts. Instead of writing prompts as raw text and hoping for the best, you fill in structured fields — roles, task description, context, constraints, examples — and the app assembles them into a single prompt, then streams it through Claude for refinement.

The interesting part is the iteration loop. After the first generation, you can tweak any input and hit "Re-grill." The app sends your updated inputs alongside the previous output and suggestions, so the AI improves incrementally rather than starting from scratch. Every refinement is auto-saved to a local history with token counts, cost estimates, and timestamps, and you can diff any two versions side-by-side to see exactly what changed.

Everything runs client-side. No backend, no accounts, no data leaves your browser except the API call to Anthropic. Built as a companion tool for Claude Code terminal workflows — the generated prompts are optimized to be pasted directly into Claude Code, which already has codebase context.

## Tech Stack

- **React 19** + **TypeScript** — strict mode, no `any` types
- **Zustand 5** — state management with 5 slices (sidebar, canvas, settings, UI, history), persisted to localStorage
- **Anthropic SDK** — browser-side streaming via `dangerouslyAllowBrowser`, with real-time token counting and cost tracking
- **Tailwind CSS 4** — custom warm theme (cream/red-orange/gold palette)
- **Vite 7** — dev server and production builds
- **diff** library — powers the line-level prompt diff viewer

## Architecture

Split-pane SPA with no routing. The left sidebar holds structured input fields; the right canvas displays the streamed output with an always-editable prompt and a collapsible suggestions panel.

```
Sidebar inputs → prompt-assembler.ts → Anthropic streaming → prompt-utils.ts → Canvas
                 (builds markdown         (Claude API)        (splits prompt     (editable output
                  user message)                                 from suggestions)  + suggestions)
```

State flows through a Zustand store with clear separation: sidebar and settings are persisted, canvas and UI state are ephemeral. The `useRefine` hook orchestrates the full cycle — input validation, prompt assembly, API streaming, response parsing, stats calculation, and history saving.

The iterative refinement pipeline appends the previous generation to each new request, letting the model compare what changed in the inputs and improve accordingly. A meta-prompt (67 lines) enforces output structure and quality constraints.

Demo mode simulates the full streaming experience with pre-crafted responses and variable-speed chunking, so the app is usable without an API key.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Either enter an Anthropic API key in Settings or toggle Demo Mode to try it without one.

## Status

Shipped and functional. Built as an independent product over a few focused sessions. The codebase is clean — strict TypeScript, no dead code, proper error handling, and accessibility attributes throughout.
