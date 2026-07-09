import { getConfig } from './config'

export type RedisCommand = (string | number)[]

export function hasRedis(): boolean {
  const { redisUrl, redisToken } = getConfig()
  return !!(redisUrl && redisToken)
}

/**
 * Run a batch of commands against the Upstash Redis REST API in one round trip.
 * Returns one result per command; a command that errored yields null.
 * Throws if Redis is unconfigured or the HTTP call itself fails.
 */
export async function redisPipeline(commands: RedisCommand[]): Promise<unknown[]> {
  const { redisUrl, redisToken } = getConfig()
  if (!redisUrl || !redisToken) {
    throw new Error('Redis is not configured')
  }

  const res = await fetch(`${redisUrl.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  })

  if (!res.ok) {
    throw new Error(`Redis pipeline failed with status ${res.status}`)
  }

  const results = (await res.json()) as Array<{ result?: unknown; error?: string }>
  return results.map((entry) => {
    if (entry.error) {
      console.error('Redis command error:', entry.error)
      return null
    }
    return entry.result ?? null
  })
}

/** Parse an HGETALL flat-array reply ([field, value, field, value, ...]) into an object. */
export function parseHash(reply: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!Array.isArray(reply)) return out
  for (let i = 0; i + 1 < reply.length; i += 2) {
    out[String(reply[i])] = String(reply[i + 1])
  }
  return out
}
