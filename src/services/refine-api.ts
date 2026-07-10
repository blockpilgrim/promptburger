import type { RefinementStats } from '../types'
import type { RefineErrorBody, RefineRequestBody, RefineStreamEvent } from '../types/api'

/**
 * Stream a refinement from the /api/refine serverless proxy.
 * The Anthropic API key lives server-side; the response arrives as NDJSON events.
 */
export async function streamRefinement(
  model: string,
  userMessage: string,
  onChunk: (text: string) => void,
  onComplete: (fullText: string, stats: RefinementStats) => void,
  onError: (error: Error) => void,
  onThinking?: () => void,
): Promise<void> {
  try {
    const body: RefineRequestBody = { model, userMessage }
    const res = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      let message = `Request failed (${res.status}). Please try again.`
      try {
        const errorBody = (await res.json()) as RefineErrorBody
        if (errorBody.message) message = errorBody.message
      } catch {
        // keep the generic message
      }
      onError(new Error(message))
      return
    }

    if (!res.body) {
      onError(new Error('Streaming is not supported in this browser.'))
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let accumulated = ''
    let finished = false

    const handleLine = (line: string) => {
      if (!line.trim()) return
      let event: RefineStreamEvent
      try {
        event = JSON.parse(line) as RefineStreamEvent
      } catch {
        return
      }
      if (event.type === 'status') {
        if (event.phase === 'thinking') onThinking?.()
      } else if (event.type === 'text') {
        accumulated += event.text
        onChunk(event.text)
      } else if (event.type === 'done') {
        finished = true
        onComplete(accumulated, event.stats)
      } else if (event.type === 'error') {
        finished = true
        onError(new Error(event.message))
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) handleLine(line)
    }
    buffer += decoder.decode()
    if (buffer) handleLine(buffer)

    if (!finished) {
      onError(new Error('The connection dropped mid-stream. Please try again.'))
    }
  } catch (error) {
    if (error instanceof TypeError) {
      onError(new Error('Network error. Check your internet connection.'))
    } else if (error instanceof Error) {
      onError(error)
    } else {
      onError(new Error(String(error)))
    }
  }
}
