# PromptComposer

A local prompt composition tool for Claude Code users. Structured sidebar inputs (roles, task, constraints) feed an AI refinement pipeline that produces clean, copy-ready prompts optimized for Claude Code workflows.

## Why This Exists

When using Claude Code in Terminal, prompt quality is inconsistent because:
- Repetitive boilerplate (roles, constraints, formatting) must be manually typed each time
- Important context gets forgotten across prompts, even within the same project
- Raw thoughts need manual restructuring into effective prompts

PromptComposer solves this with a GUI that sits alongside your terminal. Fill in structured fields, click refine, copy the result into Claude Code.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start composing. You can either enter your own Anthropic API key in Settings, or enable Demo Mode to try the app with simulated AI responses (no API key needed).

## Current Features (v1)

- **Role Selector** -- Multi-select dropdown with 30+ roles across 7 categories (Design, Frontend, Backend, Mobile, Infrastructure, Architecture, Specialized). Supports custom entries. Outputs `Act as an expert [roles].` at the top of the prompt.
- **Task Input** -- Large textarea for braindumps. Write rough thoughts; the AI structures them.
- **Constraints Input** -- Guided textarea for rules, limitations, or preferences.
- **Custom Blocks** -- Add arbitrary free-text blocks via "+ Add Block" for anything that doesn't fit the standard fields.
- **AI Refinement** -- Streams a structured prompt from Claude (Sonnet 4.5 by default). The meta-prompt enforces outcome-oriented writing, no implementation plans, and no project context (Claude Code already has codebase access).
- **Suggestions Panel** -- After refinement, a collapsible panel below the prompt shows clarifying questions, ideas, and edge cases. These are never copied -- only the prompt goes to your clipboard.
- **Editable Canvas** -- The generated prompt is always editable. Modify it directly before copying.
- **Copy Prompt** -- Copies the prompt (excluding suggestions) to clipboard. Also available via `Cmd+Shift+C`.
- **Demo Mode** -- Toggle in Settings to try the app without an API key. Streams pre-crafted responses with realistic chunked timing, exercising the full UI (streaming animation, canvas editor, suggestions panel). Cycles through 3 example responses across different domains (software engineering, technical writing, data analysis). An amber "DEMO" badge appears in the toolbar when active. The API key input is greyed out while demo mode is on; toggling it off restores BYOK functionality with any previously saved key.
- **Settings** -- API key (stored in localStorage, never sent anywhere except Anthropic API), model selection (Sonnet, Haiku, Opus), and demo mode toggle.
- **Persistence** -- Sidebar inputs and settings (including demo mode preference) survive page refresh. Canvas content is ephemeral.

## Design Decisions

**Generated prompts assume Claude Code context.** The output is designed to be pasted into Claude Code, which already has access to the project codebase and CLAUDE.md. The meta-prompt explicitly prohibits adding project context, codebase descriptions, or implementation step-by-step plans -- Claude Code handles those on its own.

**No backend.** Everything runs client-side. The Anthropic SDK is used directly in the browser (`dangerouslyAllowBrowser: true`). Acceptable for a personal-use local tool.

**Canvas is always in edit mode.** There is no rendered Markdown preview. Prompt markdown is simple enough (headers, bullets) that raw editing is more practical than toggling between views.

**Suggestions are structurally separated.** The AI response is split into two parts: the prompt (stored in `content`) and suggestions (stored in `suggestions`). The split happens at the `---` / `## Suggestions for Improvement` boundary. This is not just a visual distinction -- the store holds them as separate fields, and the copy function only touches `content`.

## Planned Features (v2)

The toolbar has disabled placeholder buttons for these. The store and component architecture are designed to accommodate them without major refactoring.

### Project Profiles (high priority)
Save named sidebar configurations (roles, default constraints, tech stack) per project. Switch profiles via a toolbar dropdown. Directly solves the "I forget to set context" problem -- load your iOS profile and the right roles/constraints are pre-filled.

Implementation notes: Profiles would be `Partial<SidebarState>` objects saved to localStorage. Loading a profile hydrates the sidebar via `setState()`. The `partialize` function in the store already handles selective persistence.

### Template Library (high priority)
Pre-built prompt skeletons for common task types: Bug Fix, New Feature, Refactor, Code Review, Explain Code, Write Tests. Selecting a template pre-configures which sidebar blocks are visible and may pre-fill content.

Implementation notes: Templates are objects matching `Partial<SidebarState>` + metadata (name, description, icon). Could also include template-specific meta-prompts for different refinement strategies.

### Prompt History (high priority)
Auto-save every copied prompt with timestamp and (optionally) project profile tag. Searchable list accessible from the toolbar. Useful for revisiting past prompts and re-using patterns.

Implementation notes: The canvas slice already has `lastRefinedAt`. History entries would be saved to localStorage on copy. The `SidebarBlock` component pattern can be reused for history item display.

### Snippet Library (medium priority)
Reusable text fragments for frequently used instructions. Saved with a name, inserted into any text field via a popover. Examples: "Do not modify existing tests", "Follow existing patterns in the codebase", "Keep the implementation minimal."

### Additional Sidebar Blocks (medium priority)
New structured block types beyond the current free-text custom blocks:
- **Output Format** -- dropdown: "Code only", "Explain then implement", "Plan first"
- **Tech Stack / Scope** -- tag input: "React", "TypeScript", "SwiftUI"
- **Tone** -- dropdown: "Concise", "Detailed", "Teach me as you go"
- **Examples** -- textarea: "Here's what good output looks like..."
- **Context** -- textarea: task-specific context not in the project
- **Step-by-step reasoning toggle** -- adds reasoning cues
- **Self-review toggle** -- adds "Review your output against the requirements"

Implementation notes: The `SidebarBlock` component and block registry pattern are already in place. Each new block type would register a component renderer and a serialization format.

### CLAUDE.md Awareness (medium priority)
Point the app at a project directory. It reads `.claude/CLAUDE.md` and displays it in a collapsible panel, so you can see what's already configured and avoid duplicating instructions in your prompt.

### Iterative Refinement (lower priority)
Highlight a section of the canvas, right-click or use a button to trigger AI editing of just that section. Useful for tweaking specific parts of a long prompt without regenerating the whole thing.

### Desktop Wrapper (lower priority)
Wrap the app in Tauri for a dedicated desktop window instead of a browser tab. The entire React codebase carries over unchanged.

## Known Issues

- The production build emits a chunk size warning (~550KB) due to the Anthropic SDK. Not a concern for a local dev tool, but could be addressed with `manualChunks` in the Vite config if desired.
- `MarkdownPreview.tsx` is no longer used in the main canvas (canvas is always in edit mode) but is still used by `SuggestionsPanel.tsx` via direct `ReactMarkdown` import. The file can be removed if no future feature needs it.
- The `isEditing` field in the canvas store slice is vestigial from when the canvas had an Edit/Preview toggle. It can be removed in a cleanup pass.
