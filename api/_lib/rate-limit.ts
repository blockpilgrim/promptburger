import { getConfig } from './config.js'
import { hasRedis, redisPipeline } from './redis.js'
import { dayBucket, hourBucket, secondsUntilNextHour, secondsUntilNextUtcDay } from './time.js'

export interface RateLimitResult {
  allowed: boolean
  scope?: 'hour' | 'day' | 'global'
  retryAfterSeconds?: number
  message?: string
}

// Fallback counters when Redis is unconfigured. Serverless instances recycle,
// so these are best-effort only — provision Redis for reliable limits.
const memoryCounters = new Map<string, { count: number; expiresAt: number }>()

function memoryIncrement(key: string, ttlSeconds: number, now: number): number {
  if (memoryCounters.size > 5000) {
    for (const [k, v] of memoryCounters) {
      if (v.expiresAt <= now) memoryCounters.delete(k)
    }
  }
  const existing = memoryCounters.get(key)
  if (existing && existing.expiresAt > now) {
    existing.count += 1
    return existing.count
  }
  memoryCounters.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 })
  return 1
}

/**
 * Increment and check all three limits (per-IP hourly, per-IP daily, global daily).
 * Counts every attempt, including ones that end up rejected.
 */
export async function checkRateLimit(ip: string, now: Date): Promise<RateLimitResult> {
  const config = getConfig()
  const hourKey = `pb:rl:h:${ip}:${hourBucket(now)}`
  const dayKey = `pb:rl:d:${ip}:${dayBucket(now)}`
  const globalKey = `pb:rl:g:${dayBucket(now)}`

  let hourCount: number
  let dayCount: number
  let globalCount: number

  if (hasRedis()) {
    const results = await redisPipeline([
      ['INCR', hourKey],
      ['EXPIRE', hourKey, 3900],
      ['INCR', dayKey],
      ['EXPIRE', dayKey, 90000],
      ['INCR', globalKey],
      ['EXPIRE', globalKey, 90000],
    ])
    hourCount = Number(results[0]) || 0
    dayCount = Number(results[2]) || 0
    globalCount = Number(results[4]) || 0
  } else {
    const nowMs = now.getTime()
    hourCount = memoryIncrement(hourKey, 3900, nowMs)
    dayCount = memoryIncrement(dayKey, 90000, nowMs)
    globalCount = memoryIncrement(globalKey, 90000, nowMs)
  }

  if (hourCount > config.perIpHourly) {
    const retryAfterSeconds = secondsUntilNextHour(now)
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60))
    return {
      allowed: false,
      scope: 'hour',
      retryAfterSeconds,
      message: `The grill needs to cool down — you've used all ${config.perIpHourly} prompts for this hour. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    }
  }

  if (dayCount > config.perIpDaily) {
    return {
      allowed: false,
      scope: 'day',
      retryAfterSeconds: secondsUntilNextUtcDay(now),
      message: `You've reached the daily limit of ${config.perIpDaily} prompts. The grill reopens tomorrow!`,
    }
  }

  if (globalCount > config.globalDaily) {
    return {
      allowed: false,
      scope: 'global',
      retryAfterSeconds: secondsUntilNextUtcDay(now),
      message: 'PromptBurger has served its maximum number of prompts for today. Please come back tomorrow!',
    }
  }

  return { allowed: true }
}
