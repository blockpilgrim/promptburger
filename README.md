# PromptBurger

A local prompt composition tool for Claude Code users. Structured sidebar inputs (roles, task, constraints) feed an AI refinement pipeline that produces clean, copy-ready prompts optimized for Claude Code workflows.

## Why This Exists

When using Claude Code in Terminal, prompt quality is inconsistent because:
- Repetitive boilerplate (roles, constraints, formatting) must be manually typed each time
- Important context gets forgotten across prompts, even within the same project
- Raw thoughts need manual restructuring into effective prompts

PromptBurger solves this with a GUI that sits alongside your terminal. Fill in structured fields, click refine, copy the result into Claude Code.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start composing. You can either enter your own Anthropic API key in Settings, or enable Demo Mode to try the app with simulated AI responses (no API key needed).

## Features

- **Role Selector** -- Multi-select dropdown with 30+ roles across 7 categories (Design, Frontend, Backend, Mobile, Infrastructure, Architecture, Specialized). Supports custom entries. Outputs `Act as an expert [roles].` at the top of the prompt.
- **Task Input** -- Large textarea for braindumps. Write rough thoughts; the AI structures them.
- **Context Input** -- Textarea for task-specific context.
- **Constraints Input** -- Guided textarea for rules, limitations, or preferences.
- **Examples Input** -- Textarea for showing the AI what good output looks like.
- **Custom Blocks** -- Add arbitrary free-text blocks via "+ Add Block" for anything that doesn't fit the standard fields.
- **AI Refinement** -- Streams a structured prompt from Claude (Sonnet 4.5 by default). The meta-prompt enforces outcome-oriented writing, no implementation plans, and no project context (Claude Code already has codebase access).
- **Iterative Refinement (Re-grill)** -- After an initial generation, click "Re-grill" to iterate. The previous prompt and suggestions are sent alongside the current inputs so the AI improves rather than regenerates from scratch.
- **Suggestions Panel** -- After refinement, a collapsible panel below the prompt shows clarifying questions, ideas, and edge cases. Each suggestion has an "Add to Field" button to append it to any sidebar input. Suggestions are never copied -- only the prompt goes to your clipboard.
- **Editable Canvas** -- The generated prompt is always editable. Modify it directly before copying.
- **Copy Prompt** -- Copies the prompt (excluding suggestions) to clipboard. Also available via `Cmd+Shift+C`.
- **Token & Cost Stats** -- After each refinement, a stats bar shows input/output token counts, estimated cost, and response duration. Stats are also displayed per entry in Prompt History.
- **Prompt History** -- Every refinement is auto-saved with full sidebar state, canvas output, and usage stats. Entries are visually grouped: original prompts and their re-grill iterations appear together with version labels (v1, v2, v3). A cumulative usage summary shows total tracked tokens, cost, and duration across all history entries.
- **Prompt Diff Viewer** -- Compare any two history entries side-by-side with a GitHub-style line-level diff. Enter compare mode in the History modal, select two entries, and view added/removed lines with colored gutters and line numbers.
- **Demo Mode** -- Toggle in Settings to try the app without an API key. Streams pre-crafted responses with realistic chunked timing. Cycles through 3 example scenarios. An amber "DEMO" badge appears in the toolbar when active.
- **Settings** -- API key (stored in localStorage, never sent anywhere except Anthropic API), model selection (Sonnet 4.5, Haiku 4.5, Opus 4.5), and demo mode toggle.
- **Persistence** -- Sidebar inputs, settings, and prompt history survive page refresh. Canvas content is ephemeral.
- **Keyboard Shortcuts** -- `Cmd/Ctrl+Enter` to refine, `Cmd/Ctrl+Shift+C` to copy prompt.

## Design Decisions

**Generated prompts assume Claude Code context.** The output is designed to be pasted into Claude Code, which already has access to the project codebase and CLAUDE.md. The meta-prompt explicitly prohibits adding project context, codebase descriptions, or implementation step-by-step plans -- Claude Code handles those on its own.

**No backend.** Everything runs client-side. The Anthropic SDK is used directly in the browser (`dangerouslyAllowBrowser: true`). Acceptable for a personal-use local tool.

**Canvas is always in edit mode.** There is no rendered Markdown preview. Prompt markdown is simple enough (headers, bullets) that raw editing is more practical than toggling between views.

**Suggestions are structurally separated.** The AI response is split into two parts: the prompt (stored in `content`) and suggestions (stored in `suggestions`). The split happens at the `---` / `## Suggestions for Improvement` boundary. This is not just a visual distinction -- the store holds them as separate fields, and the copy function only touches `content`.

## Known Issues

- The production build emits a chunk size warning (~545KB) due to the Anthropic SDK. Not a concern for a local dev tool, but could be addressed with `manualChunks` in the Vite config if desired.
