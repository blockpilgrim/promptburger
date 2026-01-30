# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

No test framework is configured.

## Architecture

**PromptBurger** is a single-page React app for crafting AI prompts. Users fill in structured inputs (roles, task, constraints, custom blocks), click "Refine with AI," and get a polished prompt streamed back from Claude via the Anthropic SDK.

### Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS 4 (custom warm theme defined in `src/index.css`), Zustand 5 for state management, Anthropic SDK (browser-side streaming).

### Layout

Split-pane UI: **Sidebar** (left, 33%) for inputs → **Canvas** (right, 67%) for output. No routing — single view with a settings modal.

### State Management

Zustand store in `src/store/` with four slices combined in `index.ts`:
- **sidebar** — roles, task braindump, constraints, custom blocks
- **canvas** — generated prompt content, suggestions, editing state
- **settings** — API key, selected model
- **ui** — streaming state, toast notifications

Selected fields persist to localStorage under key `promptburger-store`.

### Data Flow

1. `src/services/prompt-assembler.ts` — assembles sidebar inputs into a structured user message
2. `src/services/anthropic.ts` — streams the response from Claude using the meta-prompt as system message
3. `src/lib/prompt-utils.ts` — splits the response into prompt content (above `---`) and suggestions (below `---`)
4. `src/hooks/useRefine.ts` — orchestrates the full refine cycle (validate → assemble → stream → parse → update store)

### Key Constants

- `src/constants/meta-prompt.ts` — system prompt that instructs Claude to produce structured output (prompt + suggestions separated by `---`)
- `src/constants/roles.ts` — 30+ predefined roles in 7 groups, used with CreatableSelect
- `src/constants/models.ts` — available Claude models

### Shared UI Components

Located in `src/components/ui/`: Button (variants/sizes/loading), Modal, Toast, Textarea, Spinner, ErrorBoundary, MarkdownPreview.

### Global Keyboard Shortcuts

Defined in `App.tsx`:
- `Cmd/Ctrl + Enter` — Fire the Grill
- `Cmd/Ctrl + Shift + C` — Copy prompt to clipboard
