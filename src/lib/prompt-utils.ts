const SUGGESTIONS_SEPARATOR = /\n---\s*\n+## Suggestions for Improvement/i

/**
 * Extracts only the prompt portion of the generated output,
 * stripping the "Suggestions for Improvement" section.
 */
export function extractPromptOnly(fullContent: string): string {
  const match = fullContent.match(SUGGESTIONS_SEPARATOR)
  if (!match || match.index === undefined) {
    return fullContent.trim()
  }
  return fullContent.slice(0, match.index).trim()
}

/**
 * Extracts only the suggestions section (including the heading).
 * Returns empty string if no suggestions are present.
 */
export function extractSuggestions(fullContent: string): string {
  const match = fullContent.match(SUGGESTIONS_SEPARATOR)
  if (!match || match.index === undefined) {
    return ''
  }
  // Return everything after the ---, starting from the ## heading
  const afterSeparator = fullContent.slice(match.index)
  // Strip the leading \n---\n and return from the ## heading onward
  const headingMatch = afterSeparator.match(/## Suggestions for Improvement/i)
  if (!headingMatch || headingMatch.index === undefined) {
    return ''
  }
  return afterSeparator.slice(headingMatch.index).trim()
}

/**
 * Checks whether the content has a suggestions section.
 */
export function hasSuggestions(fullContent: string): boolean {
  return SUGGESTIONS_SEPARATOR.test(fullContent)
}
