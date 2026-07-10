import type { RoleOption } from "../types";

export interface DemoScenario {
  sidebar: {
    roles: RoleOption[];
    context: string;
    task: string;
    constraints: string;
    examples: string;
  };
  response: string;
  iteration: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    sidebar: {
      roles: [{ value: "copywriter", label: "Copywriter", group: "Content" }],
      context:
        "relaunching our product next month. current landing page is super corporate and doesn't convert. we make a project mgmt tool for small creative teams — freelancers, designers, small agencies. nothing enterprise, more lightweight and opinionated",
      task: "rewrite the hero section and the 3 value prop blocks. needs to feel relatable and punchy, not like every other saas page. someone should want to try it within 10 seconds of landing on the page",
      constraints:
        '- under 150 words total across hero + 3 value props\n- no buzzwords (synergy, leverage, streamline, etc)\n- copy needs to stand alone without images\n- CTA button says "Start free" not "Sign up"',
      examples:
        'tone we like — basecamp ("the all-in-one toolkit for working remotely"), linear ("built for the way modern software teams work")\n\ntone we do NOT like — "unlock the power of seamless collaboration with our industry-leading platform"',
    },
    response: `Act as an expert copywriter specializing in conversion-focused SaaS landing pages.

## Objective

Rewrite the hero section and three value proposition blocks for a lightweight project management tool aimed at small creative teams — freelancers, designers, and small agencies.

## Requirements

- Hero copy must communicate what the tool does and who it's for within the first line
- Each value prop block leads with a benefit, not a feature
- Total word count across hero + 3 value prop blocks: under 150 words
- CTA text is "Start free" (not "Sign up" or "Get started")
- Copy must work on its own without supporting images or illustrations

## Tone

- Human, direct, punchy — reads like a person talking, not a brand committee
- No corporate buzzwords: "synergy," "leverage," "streamline," "seamless," "empower," "unlock" are all off limits
- Aspirational but grounded — closer to Basecamp and Linear than enterprise SaaS

## Reference Points

**Match this feel:**
- "The all-in-one toolkit for working remotely" (Basecamp)
- "Built for the way modern software teams work" (Linear)

**Avoid this feel:**
- "Unlock the power of seamless collaboration with our industry-leading platform"

---

## Suggestions for Improvement

- **Differentiator**: What makes this tool different from Basecamp, Asana, or Notion? A single sharp differentiator in the hero will do more than three generic value props.
- **Audience specificity**: "Small creative teams" covers a range. A solo freelancer and a 10-person agency have different pain points — which one is the primary target?
- **Social proof**: Consider whether the hero section should include a trust signal (user count, notable client, star rating). These significantly impact conversion even when copy is strong.
- **Below-the-fold context**: What comes after the value props? Knowing the full page structure helps ensure the hero doesn't try to do too much.
- **Mobile reading**: At 150 words across 4 blocks, each block is ~35 words. That's tight — make sure the constraint allows enough room to say something meaningful in each block.`,
    iteration: `Act as an expert copywriter specializing in conversion-focused SaaS landing pages.

## Objective

Rewrite the hero section and three value proposition blocks for a lightweight, opinionated project management tool built specifically for small creative teams — committed to the single primary audience identified for this relaunch rather than speaking to the whole freelancer-to-agency range at once.

## Positioning

- Lead with one sharp differentiator: this tool is deliberately lightweight and opinionated — the antidote to bloated all-in-one suites like Notion and Asana
- The hero must make that primary audience feel "this was built for us" within the first line
- Reserve room for a single trust signal in the hero (user count or a recognizable client) — the copy should hold up with or without it

## Requirements

- Hero copy communicates what the tool does and who it's for in the opening line
- Each value prop block leads with a benefit and names the specific pain it removes for that audience
- Total word count across hero + 3 value prop blocks: under 150 words
- CTA text is "Start free" (not "Sign up" or "Get started")
- Copy must stand on its own without supporting images or illustrations

## Page Structure

- Hero: headline, subhead, CTA, optional trust signal
- Three value prop blocks, strongest benefit first
- Copy should set up — not duplicate — the feature detail that follows below the fold

## Tone

- Human, direct, punchy — a person talking, not a brand committee
- No corporate buzzwords: "synergy," "leverage," "streamline," "seamless," "empower," "unlock" are all off limits
- Aspirational but grounded — closer to Basecamp and Linear than enterprise SaaS

## Reference Points

**Match this feel:**
- "The all-in-one toolkit for working remotely" (Basecamp)
- "Built for the way modern software teams work" (Linear)

**Avoid this feel:**
- "Unlock the power of seamless collaboration with our industry-leading platform"

---

## Suggestions for Improvement

- **Headline variants**: Want two or three hero headline options to A/B test, or a single committed line? Testing a "built for your kind of team" angle against a "less tool, more work" angle usually surfaces a clear winner.
- **Objection handling**: The biggest hesitation for a team already on another tool is migration effort. A short reassurance — "bring your projects over in an afternoon" — can lift conversion more than another benefit.
- **CTA subtext**: A line under "Start free" — "No credit card, no sales call" — removes the last bit of friction. Worth including?
- **Voice consistency**: Decide between "you" (speaking to the team) and "we" (the product's point of view), then hold it across all four blocks — mixing the two is the most common thing that makes punchy copy feel off.
- **Proof specificity**: If a trust signal is used, a concrete number ("trusted by 4,000 studios") outperforms a vague claim ("loved by teams everywhere"). Which real proof point is available?`,
  },
  {
    sidebar: {
      roles: [{ value: "editor", label: "Editor", group: "Content" }],
      context:
        "writing my quarterly update for leadership. my team is growth engineering, 6 people. mixed quarter — shipped some big wins but missed our main activation target. leadership reads like 20 of these so it has to be really skimmable",
      task: "draft the update. should be honest about what didn't work without sounding like we're making excuses. highlight the wins but don't sugarcoat the miss",
      constraints:
        "- one page max, bullets over paragraphs\n- use [placeholder] for numbers i'll fill in\n- no fluffy intro, start with the headline metric\n- end with \"what we're changing\" section, 3 bullets max",
      examples:
        'opening from last quarter that landed well:\n"Activation hit 38% (target: 35%). Three experiments drove the lift — onboarding checklist (+4pp), simplified pricing page (+2pp), email sequence rewrite (+1.5pp)."',
    },
    response: `Act as an expert editor specializing in concise executive communication.

## Objective

Draft a one-page quarterly update for a 6-person growth engineering team. The quarter included significant wins but missed the primary activation target. The update will be read by senior leadership alongside approximately 20 other team updates.

## Requirements

- Open with the headline metric and result vs. target — no preamble or context-setting paragraph
- Present both wins and the activation miss with equal directness
- Use [placeholder] brackets for specific numbers to be filled in later
- Close with a "What we're changing" section containing exactly 3 bullets

## Tone

- Honest and confident — own the miss without being defensive or making excuses
- Factual over narrative — let the numbers carry the weight
- Skimmable in under 60 seconds

## Format

- Bullet-heavy, one page maximum
- Structure:
  - **Headline number** — activation result vs. target, one line
  - **What shipped** — deliverables with measured impact
  - **What missed and why** — the gap and contributing factors
  - **What we're changing** — 3 specific actions for next quarter

## Reference

Previous quarter's opening that resonated with leadership:
"Activation hit 38% (target: 35%). Three experiments drove the lift — onboarding checklist (+4pp), simplified pricing page (+2pp), email sequence rewrite (+1.5pp)."

---

## Suggestions for Improvement

- **Trend vs. target**: Did activation improve from Q2 to Q3 but miss an aggressive Q4 target? That's a different narrative than a decline. Clarify the trajectory.
- **Attribution**: Can you isolate which shipped projects impacted activation specifically? This helps explain whether the miss was an execution problem or a target-setting problem.
- **Peer context**: If activation dipped across multiple teams or the whole platform, mentioning that reframes the miss without sounding like an excuse.
- **Impact sizing**: For the "what we're changing" section, include expected impact estimates so leadership can judge whether the plan is sized to close the gap.
- **Audience priorities**: Does this leadership group care more about the absolute number or the rate of improvement? That changes which data to lead with.`,
    iteration: `Act as an expert editor specializing in concise executive communication.

## Objective

Draft a one-page quarterly update for a 6-person growth engineering team. Activation finished below target this quarter, so the update should lead with the real trajectory, own the gap, and show a sized plan to close it. It will be read by senior leadership alongside roughly 20 other updates.

## Requirements

- Open with the headline metric as a trajectory — current result, prior-quarter baseline, and target on one line — so the trajectory reads before the miss
- Attribute the shipped wins and the activation gap to specific projects, separating an execution problem from an over-ambitious target
- Use [placeholder] brackets for specific numbers to be filled in later
- Close with a "What we're changing" section of exactly 3 bullets, each carrying an expected-impact estimate sized against the remaining gap

## Tone

- Honest and confident — own the miss without defensiveness or excuses
- Factual over narrative — let the numbers carry the weight
- Skimmable in under 60 seconds

## Format

- Bullet-heavy, one page maximum
- Structure:
  - **Headline trend** — activation now vs. last quarter vs. target, one line
  - **What shipped** — deliverables with measured impact
  - **What missed and why** — the gap, its likely cause, and what it isn't
  - **What we're changing** — 3 actions, each sized with an expected impact

## Reference

Previous quarter's opening that resonated with leadership:
"Activation hit 38% (target: 35%). Three experiments drove the lift — onboarding checklist (+4pp), simplified pricing page (+2pp), email sequence rewrite (+1.5pp)."

---

## Suggestions for Improvement

- **Named owners**: Should each "what we're changing" bullet carry a DRI? Leadership tends to trust a plan more when accountability is visible.
- **Risks and dependencies**: Is there a blocker — a platform dependency, a hiring gap, an upstream team — that could derail the plan? Naming it now reads as candor, not excuse-making.
- **The ask**: Does this update need a decision or resource request from leadership, or is it purely informational? If there's an ask, it deserves its own line rather than being buried in the plan.
- **Confidence tags**: Consider tagging each impact estimate with a confidence level (high/medium/low) so leadership can weigh the plan realistically instead of reading every number as a promise.
- **Visual anchor**: A single inline trend indicator for activation across the last three or four quarters can land the trajectory faster than a sentence. Is a small visual welcome here, or is the format strictly text?`,
  },
  {
    sidebar: {
      roles: [
        {
          value: "facilitator",
          label: "Workshop Facilitator",
          group: "Specialized",
        },
      ],
      context:
        "running a brainstorm with our product team next week. 12 people — mix of designers, engineers, PMs. trying to figure out what to build next quarter. team morale is kinda low bc leadership killed last quarter's big project",
      task: "need an agenda and activities for a 90 min workshop. should get people energized and thinking creatively, not just the loudest voices talking. want to end with a prioritized list of ideas we can actually act on",
      constraints:
        "- 90 min hard cap\n- regular conference room, whiteboard + sticky notes, nothing fancy\n- has to work for introverts too\n- include time for each section\n- no cheesy icebreakers please",
      examples:
        "format that worked for us last time:\n- 5 min context setting (just the problem, no solutions)\n- 10 min silent brainstorm on stickies\n- small group clusters then whole group share\n- dot voting to rank ideas",
    },
    response: `Act as an expert workshop facilitator with experience running product ideation sessions for cross-functional teams.

## Objective

Design a 90-minute brainstorming workshop for a 12-person product team (designers, engineers, PMs) to generate and prioritize ideas for the next quarter's roadmap. The team's morale is low after last quarter's project was cancelled, so the session needs to re-energize while producing actionable output.

## Requirements

- Total duration: exactly 90 minutes, with time allocation for each section
- Must produce a ranked list of ideas the team can act on immediately after the session
- Activities must give equal voice to introverts and extroverts — no open-floor-only formats
- Standard conference room setup only: whiteboard, sticky notes, markers. No special tools or software
- No forced icebreakers or activities unrelated to the work

## Facilitation Approach

- Open with honest context-setting that acknowledges the previous quarter without dwelling on it
- Use silent individual work before any group discussion
- Small groups (3-4 people) before whole-group sharing to reduce social pressure
- End with a concrete prioritization exercise that produces a clear ranked output

## Desired Output

A written agenda including:
- Section name, purpose, and duration for each block
- Facilitator instructions for each activity
- Transition cues between sections

## Reference Format

A structure that previously worked well with this team:
- 5 min context setting (problem only, no solutions)
- 10 min silent brainstorm on sticky notes
- Small group clustering, then whole group share
- Dot voting to rank

---

## Suggestions for Improvement

- **Scope constraint**: Should ideas be limited to a specific theme, customer problem, or product area? Fully open brainstorms tend to produce scattered results that are hard to compare during voting.
- **Decision criteria**: What lens should the team use when dot-voting? "Impact vs. effort" is common, but given the cancelled project, "feasible within one quarter" or "tied to a known user problem" might be more useful criteria.
- **Energy read**: Consider opening with a quick one-word check-in (not an icebreaker — just a read on the room). Lets you calibrate pacing and tone in real time.
- **Follow-up ownership**: 90 minutes likely won't fully spec the top ideas. Build in a 5-minute close where you assign owners to flesh out the top 3 by a specific date.
- **Psychological safety**: Teams recovering from a killed project often self-censor toward safe ideas. The facilitator should explicitly name that bold ideas are welcome — otherwise the output will skew conservative.`,
    iteration: `Act as an expert workshop facilitator with experience running product ideation sessions for cross-functional teams.

## Objective

Design a 90-minute brainstorming workshop for a 12-person product team (designers, engineers, PMs) to generate and prioritize ideas for the next quarter's roadmap. Scope ideas to a single framing question so the output is comparable and actionable, and re-energize a team whose last project was cancelled — without dwelling on it.

## Requirements

- Total duration: exactly 90 minutes, with time allocated to each section and a small buffer for overruns
- Anchor the session to one framing question or problem area so ideas can be compared head-to-head during prioritization
- Produce a ranked shortlist the team can act on immediately, with an owner assigned to flesh out each of the top three
- Give equal voice to introverts and extroverts — silent individual work before any open discussion
- Standard conference room only: whiteboard, sticky notes, markers. No special tools or software

## Facilitation Approach

- Open with a quick one-word check-in to read the room, then honest context-setting that acknowledges the cancelled project in a sentence and moves on
- Explicitly invite bold ideas early, so a team in recovery mode doesn't self-censor toward safe ones
- Small groups of 3-4 cluster and build before whole-group sharing
- Prioritize with an impact-vs-effort pass, filtered to what's realistically feasible within one quarter

## Desired Output

A written agenda including:
- Section name, purpose, and duration for each block
- Facilitator instructions and transition cues for each activity
- A closing block that assigns owners and a follow-up date for the top three ideas

## Reference Format

A structure that previously worked well with this team:
- 5 min context setting (problem only, no solutions)
- 10 min silent brainstorm on sticky notes
- Small group clustering, then whole group share
- Dot voting to rank

---

## Suggestions for Improvement

- **Hybrid contingency**: If anyone might join remotely, the sticky-note activities need a digital equivalent. Is this strictly in-person, or should the agenda carry a hybrid fallback?
- **Capture and handoff**: How will the physical output get digitized and shared afterward? Deciding the capture method up front keeps ideas from evaporating once the room clears.
- **Pre-work**: Sending the framing question a day early lets people arrive with seed ideas — helpful for the introverts, and it protects the tight timebox. Worth a short pre-read?
- **Facilitator role**: Should the facilitator stay strictly neutral, or also contribute ideas? With a domain-heavy product team, a purely neutral facilitator sometimes leaves real expertise on the table.
- **Decision rights**: Once the top three are ranked, who actually greenlights them — this group, or leadership afterward? Naming that at the close keeps the energy from fizzling into "nice ideas, no action."`,
  },
];

let demoIndex = 0;

export function getDemoScenario(): DemoScenario {
  return DEMO_SCENARIOS[demoIndex % DEMO_SCENARIOS.length];
}

export function advanceDemoScenario(): DemoScenario {
  demoIndex++;
  return DEMO_SCENARIOS[demoIndex % DEMO_SCENARIOS.length];
}

export function resetDemoIndex(): void {
  demoIndex = 0;
}
