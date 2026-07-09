import type { AdminStats, DailyUsage, IpUsage, UsageEvent } from '../../src/types/api'
import { getConfig } from './config'
import { hasRedis, parseHash, redisPipeline, type RedisCommand } from './redis'
import { dayBucket, recentDayBuckets } from './time'

const EVENTS_KEY = 'pb:usage:events'
const TOTALS_KEY = 'pb:usage:totals'
const IP_REQUESTS_KEY = 'pb:usage:ip:requests'
const IP_LASTSEEN_KEY = 'pb:usage:ip:lastseen'
const MAX_EVENTS = 300
const DAILY_TTL_SECONDS = 60 * 86400
const DAILY_WINDOW_DAYS = 14

// Fallback store when Redis is unconfigured — survives only as long as the
// warm serverless instance does. The admin page flags this mode.
const memoryStore = {
  events: [] as UsageEvent[],
  totals: { requests: 0, inputTokens: 0, outputTokens: 0, cost: 0, rateLimited: 0, errors: 0 },
  daily: new Map<string, DailyUsage>(),
  ipRequests: new Map<string, number>(),
  ipLastSeen: new Map<string, number>(),
}

function dailyKey(date: string): string {
  return `pb:usage:daily:${date}`
}

/** Record one request outcome. Never throws — monitoring must not break refinement. */
export async function recordUsage(event: UsageEvent): Promise<void> {
  try {
    if (hasRedis()) {
      await redisPipeline(buildRecordCommands(event))
    } else {
      recordInMemory(event)
    }
  } catch (error) {
    console.error('Failed to record usage:', error)
  }
}

function buildRecordCommands(event: UsageEvent): RedisCommand[] {
  const date = dayBucket(new Date(event.ts))
  const day = dailyKey(date)
  const commands: RedisCommand[] = [
    ['LPUSH', EVENTS_KEY, JSON.stringify(event)],
    ['LTRIM', EVENTS_KEY, 0, MAX_EVENTS - 1],
    ['HINCRBY', TOTALS_KEY, 'requests', 1],
    ['HINCRBY', day, 'requests', 1],
    ['EXPIRE', day, DAILY_TTL_SECONDS],
    ['ZINCRBY', IP_REQUESTS_KEY, 1, event.ip],
    ['HSET', IP_LASTSEEN_KEY, event.ip, event.ts],
  ]
  if (event.inputTokens) {
    commands.push(['HINCRBY', TOTALS_KEY, 'inputTokens', event.inputTokens])
    commands.push(['HINCRBY', day, 'inputTokens', event.inputTokens])
  }
  if (event.outputTokens) {
    commands.push(['HINCRBY', TOTALS_KEY, 'outputTokens', event.outputTokens])
    commands.push(['HINCRBY', day, 'outputTokens', event.outputTokens])
  }
  if (event.cost) {
    commands.push(['HINCRBYFLOAT', TOTALS_KEY, 'cost', event.cost])
    commands.push(['HINCRBYFLOAT', day, 'cost', event.cost])
  }
  if (event.status === 'rate_limited') {
    commands.push(['HINCRBY', TOTALS_KEY, 'rateLimited', 1])
    commands.push(['HINCRBY', day, 'rateLimited', 1])
  }
  if (event.status === 'error') {
    commands.push(['HINCRBY', TOTALS_KEY, 'errors', 1])
    commands.push(['HINCRBY', day, 'errors', 1])
  }
  return commands
}

function recordInMemory(event: UsageEvent): void {
  memoryStore.events.unshift(event)
  if (memoryStore.events.length > MAX_EVENTS) memoryStore.events.length = MAX_EVENTS

  const date = dayBucket(new Date(event.ts))
  let day = memoryStore.daily.get(date)
  if (!day) {
    day = { date, requests: 0, inputTokens: 0, outputTokens: 0, cost: 0, rateLimited: 0, errors: 0 }
    memoryStore.daily.set(date, day)
  }

  for (const bucket of [memoryStore.totals, day]) {
    bucket.requests += 1
    bucket.inputTokens += event.inputTokens ?? 0
    bucket.outputTokens += event.outputTokens ?? 0
    bucket.cost += event.cost ?? 0
    if (event.status === 'rate_limited') bucket.rateLimited += 1
    if (event.status === 'error') bucket.errors += 1
  }

  memoryStore.ipRequests.set(event.ip, (memoryStore.ipRequests.get(event.ip) ?? 0) + 1)
  memoryStore.ipLastSeen.set(event.ip, event.ts)
}

export async function readStats(now: Date): Promise<AdminStats> {
  const config = getConfig()
  const limits = {
    perIpHourly: config.perIpHourly,
    perIpDaily: config.perIpDaily,
    globalDaily: config.globalDaily,
  }

  if (!hasRedis()) {
    return {
      storage: 'memory',
      generatedAt: now.getTime(),
      totals: { ...memoryStore.totals },
      daily: [...memoryStore.daily.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, DAILY_WINDOW_DAYS),
      ips: [...memoryStore.ipRequests.entries()]
        .map(([ip, requests]) => ({ ip, requests, lastSeenAt: memoryStore.ipLastSeen.get(ip) ?? null }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 50),
      events: memoryStore.events.slice(0, 100),
      limits,
    }
  }

  const days = recentDayBuckets(now, DAILY_WINDOW_DAYS)
  const results = await redisPipeline([
    ['HGETALL', TOTALS_KEY],
    ['ZRANGE', IP_REQUESTS_KEY, 0, 49, 'REV', 'WITHSCORES'],
    ['HGETALL', IP_LASTSEEN_KEY],
    ['LRANGE', EVENTS_KEY, 0, 99],
    ...days.map((date): RedisCommand => ['HGETALL', dailyKey(date)]),
  ])

  const totalsHash = parseHash(results[0])
  const totals = {
    requests: Number(totalsHash.requests) || 0,
    inputTokens: Number(totalsHash.inputTokens) || 0,
    outputTokens: Number(totalsHash.outputTokens) || 0,
    cost: Number(totalsHash.cost) || 0,
    rateLimited: Number(totalsHash.rateLimited) || 0,
    errors: Number(totalsHash.errors) || 0,
  }

  const ipScores = Array.isArray(results[1]) ? results[1] : []
  const lastSeen = parseHash(results[2])
  const ips: IpUsage[] = []
  for (let i = 0; i + 1 < ipScores.length; i += 2) {
    const ip = String(ipScores[i])
    ips.push({
      ip,
      requests: Number(ipScores[i + 1]) || 0,
      lastSeenAt: lastSeen[ip] ? Number(lastSeen[ip]) : null,
    })
  }

  const rawEvents = Array.isArray(results[3]) ? results[3] : []
  const events: UsageEvent[] = []
  for (const raw of rawEvents) {
    try {
      events.push(JSON.parse(String(raw)) as UsageEvent)
    } catch {
      // skip malformed entries
    }
  }

  const daily: DailyUsage[] = days.map((date, i) => {
    const hash = parseHash(results[4 + i])
    return {
      date,
      requests: Number(hash.requests) || 0,
      inputTokens: Number(hash.inputTokens) || 0,
      outputTokens: Number(hash.outputTokens) || 0,
      cost: Number(hash.cost) || 0,
      rateLimited: Number(hash.rateLimited) || 0,
      errors: Number(hash.errors) || 0,
    }
  })

  return {
    storage: 'redis',
    generatedAt: now.getTime(),
    totals,
    daily,
    ips,
    events,
    limits,
  }
}
