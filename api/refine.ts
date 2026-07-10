import Anthropic from '@anthropic-ai/sdk'
import { META_PROMPT } from '../src/constants/meta-prompt.js'
import { AVAILABLE_MODELS } from '../src/constants/models.js'
import { calculateCost } from '../src/constants/pricing.js'
import type { RefineRequestBody, RefineStreamEvent } from '../src/types/api.js'
import { getConfig, jsonResponse } from './_lib/config.js'
import { getClientIp } from './_lib/ip.js'
import { checkRateLimit } from './_lib/rate-limit.js'
import { recordUsage } from './_lib/usage.js'

export const maxDuration = 60

const MAX_USER_MESSAGE_CHARS = 60_000
const ALLOWED_MODELS = new Set(AVAILABLE_MODELS.map((m) => m.id))

function encodeEvent(event: RefineStreamEvent): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(event) + '\n')
}

export async function POST(request: Request): Promise<Response> {
  const config = getConfig()
  if (!config.anthropicApiKey) {
    return jsonResponse(
      { error: 'not_configured', message: 'The kitchen is closed — the service is not configured yet.' },
      503,
    )
  }

  const ip = getClientIp(request)

  let body: RefineRequestBody
  try {
    const raw = await request.text()
    if (raw.length > MAX_USER_MESSAGE_CHARS + 1000) {
      return jsonResponse({ error: 'too_large', message: 'Your inputs are too long. Trim them down and try again.' }, 413)
    }
    body = JSON.parse(raw) as RefineRequestBody
  } catch {
    return jsonResponse({ error: 'bad_request', message: 'Invalid request body.' }, 400)
  }

  const { model, userMessage } = body
  if (typeof model !== 'string' || !ALLOWED_MODELS.has(model)) {
    return jsonResponse({ error: 'bad_model', message: 'Unknown model requested.' }, 400)
  }
  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    return jsonResponse({ error: 'bad_request', message: 'Missing prompt inputs.' }, 400)
  }

  const now = new Date()
  const limit = await checkRateLimit(ip, now).catch((error) => {
    // If the limiter itself fails, don't block real users.
    console.error('Rate limit check failed:', error)
    return { allowed: true as const }
  })

  if (!limit.allowed) {
    await recordUsage({ ts: now.getTime(), ip, model, status: 'rate_limited', message: limit.scope })
    return jsonResponse(
      { error: 'rate_limited', message: limit.message, retryAfterSeconds: limit.retryAfterSeconds },
      429,
      limit.retryAfterSeconds ? { 'Retry-After': String(limit.retryAfterSeconds) } : {},
    )
  }

  const client = new Anthropic({ apiKey: config.anthropicApiKey })
  const startTime = Date.now()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model,
          max_tokens: 4096,
          system: META_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        })

        // Adaptive thinking streams blocks with empty text, so without this
        // signal the client sees nothing until the first visible token.
        let thinkingSignalled = false
        messageStream.on('streamEvent', (event) => {
          if (
            !thinkingSignalled &&
            event.type === 'content_block_start' &&
            (event.content_block.type === 'thinking' ||
              event.content_block.type === 'redacted_thinking')
          ) {
            thinkingSignalled = true
            controller.enqueue(encodeEvent({ type: 'status', phase: 'thinking' }))
          }
        })

        messageStream.on('text', (text) => {
          controller.enqueue(encodeEvent({ type: 'text', text }))
        })

        const finalMessage = await messageStream.finalMessage()
        const durationMs = Date.now() - startTime
        const stats = {
          inputTokens: finalMessage.usage.input_tokens,
          outputTokens: finalMessage.usage.output_tokens,
          durationMs,
          model,
        }

        await recordUsage({
          ts: startTime,
          ip,
          model,
          status: 'ok',
          inputTokens: stats.inputTokens,
          outputTokens: stats.outputTokens,
          durationMs,
          cost: calculateCost(model, stats.inputTokens, stats.outputTokens),
        })

        controller.enqueue(encodeEvent({ type: 'done', stats }))
      } catch (error) {
        console.error('Refinement stream failed:', error)
        const message =
          error instanceof Anthropic.AuthenticationError
            ? 'The kitchen has a configuration problem. Please try again later.'
            : error instanceof Anthropic.RateLimitError
              ? 'Claude is busy right now. Wait a moment and try again.'
              : error instanceof Anthropic.APIConnectionError
                ? 'Could not reach Claude. Try again in a moment.'
                : 'Something went wrong while grilling. Please try again.'

        await recordUsage({
          ts: startTime,
          ip,
          model,
          status: 'error',
          durationMs: Date.now() - startTime,
          message: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
        })

        controller.enqueue(encodeEvent({ type: 'error', message }))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
