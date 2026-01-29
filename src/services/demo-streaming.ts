import { getDemoScenario } from '../constants/demo-responses'

export async function simulateDemoStreaming(
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: Error) => void,
): Promise<void> {
  try {
    const fullResponse = getDemoScenario().response
    const chunks = chunkifyResponse(fullResponse)

    let accumulated = ''

    for (const chunk of chunks) {
      await delay(getChunkDelay(chunk))
      accumulated += chunk
      onChunk(chunk)
    }

    onComplete(accumulated)
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)))
  }
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
