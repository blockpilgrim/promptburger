# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

No test framework is configured.

## Architecture

**PromptBurger** is a single-page React app for crafting AI prompts. Users fill in structured inputs (roles, task, context, constraints, examples, custom blocks), click "Fire the Grill," and get a polished prompt streamed back from Claude via the Anthropic SDK (browser-side, no backend).

### Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS 4 (custom warm theme in `src/index.css`), Zustand 5 for state, Anthropic SDK (browser-side streaming with `dangerouslyAllowBrowser: true`).

### Layout

Split-pane UI: **Sidebar** (left, 33%) for inputs → **Canvas** (right, 67%) for output. No routing — single view with a settings modal.

### Component Structure

- `src/components/layout/` — AppShell, Sidebar, Canvas, Toolbar
- `src/components/sidebar/` — Input fields (RoleSelector, TaskInput, ContextInput, ConstraintsInput, ExamplesInput, SidebarBlock, AddBlockButton, RefineButton)
- `src/components/canvas/` — CanvasEditor, CanvasToolbar, SuggestionsPanel, AddToFieldMenu, CanvasEmptyState
- `src/components/settings/` — SettingsModal, ApiKeyInput, ModelSelector
- `src/components/shared/` — Button, Modal, Toast, Textarea, Spinner, ErrorBoundary, BurgerIcon

### State Management

Zustand store in `src/store/` with four slices combined in `index.ts`:
- **sidebar** — roles, context, task braindump, constraints, examples, custom blocks
- **canvas** — generated prompt content, suggestions, editing state
- **settings** — API key, selected model, demo mode toggle
- **ui** — streaming state, toast notifications (not persisted)

Persisted to localStorage under key `promptburger-store`: sidebar fields, API key, model, demo mode. Canvas and UI state are ephemeral.

### Data Flow

1. `src/services/prompt-assembler.ts` — assembles sidebar inputs into a structured markdown user message (including previous generation for iteration)
2. `src/services/anthropic.ts` — streams the response from Claude using the meta-prompt as system message
3. `src/lib/prompt-utils.ts` — splits the response at `---` into prompt content (above) and suggestions (below)
4. `src/hooks/useRefine.ts` — orchestrates the full refine cycle (validate → assemble → stream → parse → update store)

### Iterative Refinement (Re-grill)

When the user clicks "Re-grill" after an initial generation, `prompt-assembler.ts` appends the previous prompt and suggestions to the user message under a `Previous Generation` section. The meta-prompt instructs Claude to compare current inputs against previous output and improve rather than regenerate from scratch.

### Demo Mode

Demo mode (`src/services/demo-streaming.ts`, `src/constants/demo-responses.ts`) lets users try the app without an API key. It simulates streaming with variable-speed chunking across 3 pre-baked scenarios that cycle on each refinement. Toggled via settings modal; shows amber "DEMO" badge in toolbar.

### Key Constants

- `src/constants/meta-prompt.ts` — system prompt requiring output split into prompt (above `---`) and suggestions (below `---`)
- `src/constants/roles.ts` — 30+ predefined roles in 7 groups, used with react-select CreatableSelect
- `src/constants/models.ts` — available Claude models (Sonnet 4.5 default, Haiku 4.5, Opus 4.5)
- `src/constants/placeholders.ts` — input field placeholder text
- `src/constants/demo-responses.ts` — 3 demo scenarios with sidebar inputs + full responses

### Suggestion Buttons

Each suggestion bullet in the SuggestionsPanel has an "Add to Field" (`+`) button that opens a dropdown menu mapping to sidebar fields. Selecting a field appends that suggestion text to the corresponding sidebar input.

### Theming

Custom warm color palette defined as CSS custom properties in `src/index.css` — primary (red-orange `#C4432A`), accent (gold `#DBA134`), surface (cream `#FAF5EE`), text (dark brown `#2A2118`). Fonts: Inter (sans), JetBrains Mono (mono).

### Global Keyboard Shortcuts

Defined in `App.tsx`:
- `Cmd/Ctrl + Enter` — Fire the Grill
- `Cmd/Ctrl + Shift + C` — Copy prompt to clipboard
