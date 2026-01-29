import type { RoleOption } from '../types'

export interface DemoScenario {
  sidebar: {
    roles: RoleOption[]
    task: string
    constraints: string
  }
  response: string
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    sidebar: {
      roles: [
        { value: 'backend-developer', label: 'Backend Developer', group: 'Backend' },
        { value: 'api-designer', label: 'API Designer', group: 'Backend' },
      ],
      task: 'Build a paginated REST API endpoint for user activity logs. Need filtering by date range and activity type, cursor-based pagination, and sorting. Should handle large datasets efficiently.',
      constraints: 'Must complete within 500ms for up to 1M rows. No OFFSET pagination. Validate and sanitize all query parameters. Follow existing error handling patterns.',
    },
    response: `Act as an expert software engineer specializing in backend API development and database optimization.

## Objective

Implement a paginated REST API endpoint for retrieving user activity logs with filtering, sorting, and cursor-based pagination.

## Requirements

- Support filtering by date range, activity type, and user ID
- Implement cursor-based pagination with configurable page size (default: 50, max: 200)
- Return results sorted by timestamp descending by default, with an optional sort parameter
- Include total count in response metadata
- Return 400 for invalid filter combinations with descriptive error messages

## Response Format

Return JSON with this structure:
- \`data\`: Array of activity log objects
- \`pagination\`: Object with \`cursor\`, \`hasMore\`, \`totalCount\`
- \`meta\`: Object with \`requestId\`, \`processingTimeMs\`

## Constraints

- Query must complete within 500ms for datasets up to 1M rows
- Do not use OFFSET-based pagination
- All query parameters must be validated and sanitized before use
- Follow existing error handling patterns in the codebase

---

## Suggestions for Improvement

- **Caching strategy**: Consider whether results should be cached, and if so, what invalidation strategy to use. Frequently-accessed date ranges could benefit from a short TTL cache.
- **Rate limiting**: Should this endpoint have specific rate limits, especially for large page sizes?
- **Field selection**: Consider allowing clients to specify which fields to return to reduce payload size.
- **Export use case**: If this data will be exported in bulk, a separate streaming endpoint may be more appropriate than pagination.
- **Audit sensitivity**: Activity logs may contain sensitive data. Clarify whether any fields need to be redacted based on the requesting user's permissions.`,
  },
  {
    sidebar: {
      roles: [
        { value: 'technical-writer', label: 'Technical Writer', group: 'Specialized' },
      ],
      task: 'Write a blog post explaining why and when to migrate from REST to GraphQL. Target audience is mid-level developers who know REST but haven\'t used GraphQL.',
      constraints: '8-10 minute read (~2500 words). Use TypeScript code examples. Conversational but precise tone. Define jargon on first use.',
    },
    response: `Act as an expert technical writer and developer advocate with deep experience in API architecture.

## Objective

Write a technical blog post explaining the migration from REST to GraphQL, targeting mid-level developers who have REST experience but limited GraphQL exposure.

## Content Requirements

- Open with a concrete pain point that REST introduces at scale (over-fetching, multiple round trips)
- Explain GraphQL's core concepts using a real-world analogy, not textbook definitions
- Include a side-by-side comparison of the same data-fetching scenario in REST vs GraphQL
- Address the top 3 misconceptions about GraphQL (it replaces REST entirely, it is only for React, it solves all API problems)
- Close with a practical decision framework: when to choose GraphQL vs REST vs both

## Style and Tone

- Conversational but technically precise
- Use code examples in TypeScript
- Target reading time: 8-10 minutes (approximately 2000-2500 words)
- Avoid jargon without explanation; define terms on first use

## Structure

- Use descriptive H2 headings (not generic ones like "Introduction")
- Include at least 2 code blocks comparing approaches
- End each major section with a one-sentence takeaway

---

## Suggestions for Improvement

- **Target audience specificity**: Are readers full-stack developers, frontend-focused, or backend-focused? This affects which pain points to emphasize.
- **Real vs hypothetical examples**: Should the code examples use a specific domain (e.g., e-commerce, social media) for consistency throughout the post?
- **Performance data**: Including benchmark numbers (e.g., "reduced payload size by 40%") would strengthen the argument. Do you have real metrics to reference?
- **Call to action**: Should the post link to a follow-up tutorial, a starter repo, or documentation?
- **Versioning consideration**: GraphQL tooling evolves quickly. Specify whether examples should use Apollo, urql, or framework-agnostic fetch.`,
  },
  {
    sidebar: {
      roles: [
        { value: 'data-engineer', label: 'Data Engineer', group: 'Specialized' },
      ],
      task: 'Analyze why user engagement dropped in Q4 compared to Q3. Need to identify root causes and recommend fixes. Look at retention, feature adoption, session frequency.',
      constraints: 'Use existing analytics data only. Include confidence intervals. Recommendations must be actionable within a 2-week sprint. Clearly distinguish correlation from causation.',
    },
    response: `Act as an expert data analyst and product strategist with experience in cohort analysis and retention modeling.

## Objective

Analyze the user engagement drop observed in the Q4 cohort and produce an actionable report identifying root causes and recommending interventions.

## Analysis Scope

- Compare Q4 cohort (Oct-Dec sign-ups) against Q3 cohort on: Day 1/7/30 retention, feature adoption rates, session frequency, and time-to-first-value
- Segment by acquisition channel, plan tier, and company size
- Identify the specific step in the onboarding funnel where Q4 diverges from Q3
- Correlate engagement drop with any product changes shipped in October-December

## Output Format

Structure the report as:
- **Executive Summary**: 3-4 sentences with the key finding and top recommendation
- **Key Metrics Dashboard**: A comparison table of Q3 vs Q4 cohort KPIs
- **Funnel Analysis**: Step-by-step breakdown showing where drop-off occurs
- **Segment Deep Dive**: Which segments are most and least affected
- **Root Cause Hypotheses**: Ranked by likelihood with supporting evidence
- **Recommendations**: Specific, prioritized actions with expected impact

## Constraints

- Use only data from the existing analytics warehouse; do not require new instrumentation
- All percentage changes must include confidence intervals
- Recommendations must be actionable within a 2-week sprint cycle
- Distinguish between correlation and causation explicitly

---

## Suggestions for Improvement

- **Baseline definition**: How is "engagement" currently defined? DAU/MAU ratio, specific feature usage, or session-based? The metric definition will significantly affect findings.
- **Statistical significance**: What sample sizes are available per segment? Small cohorts in some channels may make segment-level conclusions unreliable.
- **External factors**: Were there seasonal effects (holidays), pricing changes, or competitor launches during Q4 that should be controlled for?
- **Qualitative data**: Are there user surveys, support tickets, or NPS responses from Q4 that could complement the quantitative analysis?
- **Success metric for interventions**: How will you measure whether recommended changes actually improve engagement? Define the target metric and threshold before implementing.`,
  },
]

let demoIndex = 0

export function getDemoScenario(): DemoScenario {
  return DEMO_SCENARIOS[demoIndex % DEMO_SCENARIOS.length]
}

export function advanceDemoScenario(): DemoScenario {
  demoIndex++
  return DEMO_SCENARIOS[demoIndex % DEMO_SCENARIOS.length]
}

export function resetDemoIndex(): void {
  demoIndex = 0
}
