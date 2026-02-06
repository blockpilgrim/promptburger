export const MODEL_PRICING: Record<string, { inputPerMillion: number; outputPerMillion: number }> = {
  'claude-sonnet-4-5-20250929': { inputPerMillion: 3, outputPerMillion: 15 },
  'claude-haiku-4-5-20250929': { inputPerMillion: 0.8, outputPerMillion: 4 },
  'claude-opus-4-5-20251101': { inputPerMillion: 15, outputPerMillion: 75 },
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number | undefined {
  const pricing = MODEL_PRICING[model]
  if (!pricing) return undefined
  return (
    (inputTokens / 1_000_000) * pricing.inputPerMillion +
    (outputTokens / 1_000_000) * pricing.outputPerMillion
  )
}
