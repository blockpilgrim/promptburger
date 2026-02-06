import { getDemoScenario } from '../constants/demo-responses'
import type { RefinementStats } from '../types'

const DEMO_MODEL = 'claude-sonnet-4-5-20250929'

export async function simulateDemoStreaming(
  onChunk: (text: string) => void,
  onComplete: (fullText: string, stats: RefinementStats) => void,
  onError: (error: Error) => void,
): Promise<void> {
  try {
    const startTime = Date.now()
    const scenario = getDemoScenario()
    const fullResponse = scenario.response
    const chunks = chunkifyResponse(fullResponse)

    let accumulated = ''

    for (const chunk of chunks) {
      await delay(getChunkDelay(chunk))
      accumulated += chunk
      onChunk(chunk)
    }

    const durationMs = Date.now() - startTime
    const outputTokens = estimateTokens(fullResponse)
    const sidebarText = [
      scenario.sidebar.context,
      scenario.sidebar.task,
      scenario.sidebar.constraints,
      scenario.sidebar.examples,
    ].join(' ')
    const inputTokens = estimateTokens(sidebarText) + 500 // ~500 for system prompt overhead

    const stats: RefinementStats = {
      inputTokens,
      outputTokens,
      durationMs,
      model: DEMO_MODEL,
    }
    onComplete(accumulated, stats)
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)))
  }
}

function estimateTokens(text: string): number {
  const words = text.split(/\s+/).length
  return Math.round(words * 1.3 + Math.random() * 20)
}

function chunkifyResponse(text: string): string[] {
  const words = text.split(/( +)/)
  const chunks: string[] = []
  let current = ''
  let wordCount = 0
  let target = randomChunkSize()

  for (const segment of words) {
    current += segment
    if (segment.trim()) wordCount++

    if (wordCount >= target) {
      chunks.push(current)
      current = ''
      wordCount = 0
      target = randomChunkSize()
    }
  }

  if (current) chunks.push(current)
  return chunks
}

function randomChunkSize(): number {
  return 3 + Math.floor(Math.random() * 6) // 3-8 words
}

function getChunkDelay(chunk: string): number {
  if (chunk.includes('\n\n') || chunk.includes('\n#')) {
    return 80 + Math.random() * 40 // 80-120ms at paragraph/heading boundaries
  }
  if (/[.!?]\s*$/.test(chunk)) {
    return 40 + Math.random() * 30 // 40-70ms at sentence ends
  }
  return 20 + Math.random() * 40 // 20-60ms default
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
