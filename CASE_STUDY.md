# PromptBurger: Building a Meta-Prompting Tool to Reduce AI Miscommunication

## The Problem

AI-assisted development has a communication problem. Developers know what they want, but translating intent into prompts that AI interprets correctly is surprisingly difficult. Even experienced prompt engineers forget to include constraints, examples, or scope clarifications when they're deep in a coding session. The result: AI makes assumptions, heads in the wrong direction, and developers spend time correcting course or reverting commits.

I've read dozens of prompt engineering guides, including official handbooks from Anthropic and Google. I know the principles. Yet in practice, I'd repeatedly forget small things: adding constraints, providing examples, clarifying whether a change should be local or global. When you're focused on solving a problem, the meta-task of structuring your request for AI often gets shortcut.

The other recurring issue: AI models tend to start implementing immediately, even when the request is underspecified. I found myself constantly appending "feel free to ask me clarifying questions" to my prompts, trying to get AI to probe before executing. This became tedious. The interrogation step, where AI surfaces gaps and asks about ambiguity, shouldn't require remembering to ask for it.

## The Insight

PromptBurger started from a simple thesis: the clarification step should be built into the workflow, not bolted on as an afterthought. Instead of hoping I remember to ask AI to question my assumptions, I wanted a tool that would always do this. The goal was to produce better questions, not preliminary answers.

Most prompt tools focus on generating polished output. I wanted something different: a system that would take my rough input and hand back a structured prompt alongside a set of clarifying questions and suggestions. The questions matter as much as the prompt itself. They surface what I forgot to specify, what assumptions are implicit, and what scope decisions I haven't made explicit.

This creates a preliminary step before handing work to Claude Code. Fill in the structured inputs, let the tool generate a refined prompt, review the suggestions, iterate if needed, then copy the final prompt into the development environment. The friction of this extra step pays off in fewer wrong turns downstream.

## How It Works

### The Meta-Prompt

At the core of PromptBurger is a system prompt that teaches Claude how to write better prompts. This meta-prompt encodes 13 principles I distilled from research, experimentation, and my own prompt engineering practice:

1. **Specificity over vagueness**: concrete details, not abstract descriptions
2. **Structured formatting**: headers, bullet points, clear visual hierarchy
3. **Role framing**: establish expertise context upfront
4. **Constraints first**: non-negotiables appear early and prominently
5. **Outcome orientation**: describe what should exist, not how to build it
6. **Acceptance criteria**: define concrete done-states
7. **Explicit output format**: specify exactly what form the response should take
8. **Preserve user intent**: the user's original braindump is the source of truth
9. **Iterative awareness**: when previous generations exist, build on them intelligently
10. **Ruthless conciseness**: strip filler words and redundant context
11. **Domain-appropriate terminology**: match the precision level to the field
12. **No padding**: never add generic background sections to fill space
13. **No implementation plans**: refuse to prescribe technical steps in the prompt itself

The last principle required deliberate iteration. Early versions would generate prompts that front-loaded implementation suggestions, essentially answering the question before it was asked. I wanted the tool to produce better questions, letting the downstream AI have room to reason about implementation. The meta-prompt now explicitly blocks step-by-step breakdowns and "first do X, then Y" patterns.

### The Output Contract

Every response follows a strict format: the generated prompt appears above a `---` separator, and suggestions appear below. The frontend parses this structure to display them in separate UI regions. The prompt content goes in the main canvas, ready to copy. The suggestions appear in a collapsible "Chef's Notes" panel.

This separation solved a practical problem. Early versions embedded suggestions inline at the bottom of the generated prompt. This meant copying the prompt also copied the questions, which I'd then have to manually delete. Parsing the separator keeps the copy-ready prompt clean.

### Iterative Refinement

When you refine a prompt that already has content in the canvas, PromptBurger captures the previous generation and passes it as context. The meta-prompt instructs Claude to treat this as a refinement task: preserve what's still relevant, incorporate changes to the input fields, address suggestions the user may have answered, and generate new suggestions for remaining gaps.

This enables multi-round improvement. The suggestions panel might surface five questions. You address two of them by updating your inputs, then regenerate. The new suggestions will focus on the remaining gaps rather than repeating what you've already clarified.

### Architecture

The entire application runs client-side. There's no backend server, no data retention, no account system. Users bring their own Anthropic API key (stored in localStorage), and all communication with Claude happens directly from the browser using the Anthropic SDK's streaming interface.

This architecture was a deliberate tradeoff. Running client-side means the API key is exposed in the browser, which is less secure than a backend proxy. But it also means zero infrastructure to maintain, no cost to me for usage, instant setup for users, and complete privacy (prompts never touch a server I control). For a tool that handles potentially sensitive project context, that privacy property matters.

The state management uses Zustand with four slices: sidebar inputs, canvas content, settings, and UI state. Persistence is selective. User inputs and settings survive page reloads because that's the user's work. Canvas content and streaming state don't persist because they're ephemeral and can be regenerated.

## The Differentiator: Suggestions as a Prompt Linter

The Suggestions panel turned out to be the most valuable part of the tool, though I didn't fully appreciate this until using it in its current form. The panel functions like a linter at the bottom of an IDE: it catches problems before they cause failures downstream.

A typical set of suggestions might include:

- "Do you want to update the theme across the entire app, or are you just wanting to tweak these specific elements?"
- "Consider adding an example of the tone you're looking for"
- "The constraint about mobile responsiveness could be more specific about breakpoints"

These aren't generic tips. They're generated in response to your specific inputs, identifying the gaps and ambiguities in what you've written.

The interaction model reinforces iteration. Each suggestion has an "Add to Field" action that lets you transfer it directly into one of the input fields (context, task, constraints, or examples). Click the button, select the target field, and the suggestion appends to that field. Then regenerate. This creates a feedback loop where suggestions become inputs, which produce better prompts, which surface more nuanced suggestions.

The linter analogy holds: just as a code linter catches issues before runtime, the Suggestions panel catches prompt issues before they cause AI to make wrong assumptions. The cost of catching these problems early (a few seconds reviewing suggestions) is dramatically lower than the cost of catching them late (reverting commits, explaining corrections, re-prompting).

## Evidence: The iOS App Redesign

A concrete example from recent use:

I was working on an iOS app and told Claude Code that the Home view looked uninspired. I provided some direction: use a dark background, glass UI elements, smaller fonts. Claude implemented the changes, but only on that specific view. The other views retained the original generic aesthetics. I had assumed that updating the design language would carry over globally, expecting we had proper theming with shared variables. That assumption was implicit in my prompt but never stated.

I reverted to the previous commit and took the same prompt to PromptBurger. The tool generated a more structured version, but the real value came from the Suggestions panel. It asked directly: "Do you want to update the theme across the entire app, or are you just wanting to tweak these specific elements?"

That question surfaced exactly what I had failed to specify. I updated my inputs to clarify the global scope, regenerated, and took the refined prompt back to Claude Code. The second attempt worked as I'd originally envisioned.

This pattern repeats. The suggestions catch scope ambiguities, missing constraints, implicit assumptions about context. Addressing them before execution means fewer wrong directions and less time spent on corrections.

## Meta-Validation: Building the Tool With the Tool

Partway through development, PromptBurger became stable enough to use on itself. When I needed to implement the Suggestions panel UX, my initial prompt to Claude Code led to several wrong directions. The interaction model wasn't clear in my head, and my prompt reflected that ambiguity.

I took the same request to PromptBurger. The suggestions helped me clarify what I actually wanted: a collapsible panel, individual actions on each suggestion, the ability to transfer suggestions to specific input fields. Working through those questions before implementation produced a clearer prompt, and the resulting implementation matched my intent on the first pass.

Using the tool to improve the tool serves as a form of validation. If PromptBurger produces better prompts for building PromptBurger, the core thesis holds.

## Technical Decisions and Tradeoffs

**Client-side only**: No backend means no infrastructure costs, no data retention concerns, and instant setup. The tradeoff is that the API key lives in the browser's localStorage, which is less secure than a server-side proxy. For a tool where users bring their own keys and prompts may contain sensitive project context, the privacy benefit outweighed the security concern.

**Selective persistence**: Zustand's persist middleware lets you choose what survives page reloads. I persist user inputs and settings (the user's work) but not canvas content or UI state (ephemeral, regenerable). This keeps the store clean while preserving what matters.

**The burger metaphor**: The culinary theme runs throughout the interface. "The Bun" for context, "The Patty" for the core task, "Special Instructions" for constraints, "Chef's Notes" for suggestions, "Fire the Grill" to generate. This is information architecture disguised as theming. The metaphor communicates structure: context is the foundation that holds everything together, the task is the substance at the center, everything else adds flavor or sets boundaries. Users intuit the hierarchy without reading documentation.

**Demo mode with simulated streaming**: For users evaluating the tool without an API key, demo mode cycles through three realistic scenarios (copywriting, executive communication, workshop facilitation). The streaming is simulated with variable chunk sizes and realistic delays, mimicking the actual experience. After each generation, the scenario advances automatically. This teaches by example without requiring setup.

**Streaming over batch**: Real-time streaming provides immediate feedback and makes the generation feel responsive. The Anthropic SDK's browser-side streaming works well, and the accumulated content is captured for error recovery. If streaming fails mid-generation, whatever content arrived is preserved rather than lost.

## Reflection

PromptBurger reinforced something I'd been sensing about AI-native workflows: the prompt is becoming the primary artifact. Traditional development has blueprints, specs, and documentation that precede implementation. In AI-assisted development, the prompt serves that function. A well-crafted prompt is a spec that an AI can execute. A vague prompt produces vague results.

This suggests that tooling for prompt composition deserves the same attention we give to IDEs for code composition. Syntax highlighting, linting, autocompletion, and formatting tools all exist because writing code benefits from structural support. Writing prompts benefits from the same.

The Suggestions panel embodies this idea. It provides the equivalent of a linter's squiggly underlines, surfacing issues before they propagate. The structured input fields provide the equivalent of a form that ensures required fields aren't forgotten. The iterative refinement loop provides the equivalent of a feedback cycle that converges toward clarity.

The tool ships with a BYOK model and runs entirely client-side. Once I connect it to its domain, anyone can use it without creating an account or incurring costs on my end. Whether it finds an audience beyond my own workflow remains to be seen, but the core thesis has proven out in my own usage: building the interrogation step into the workflow produces better prompts, and better prompts produce better results.

---

**Stack**: React 19, TypeScript, Zustand 5, Tailwind CSS 4, Anthropic SDK (browser-side streaming), Vite 7

**Role**: Solo developer, all code AI-assisted

**Timeline**: Initial build to current state in approximately one week
