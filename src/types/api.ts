import type { RefinementStats } from './store'

// --- /api/refine ---

export interface RefineRequestBody {
  model: string
  userMessage: string
}

/** NDJSON events streamed back from /api/refine, one JSON object per line. */
export type RefineStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'done'; stats: RefinementStats }
  | { type: 'error'; message: string }

/** JSON body returned for non-200 responses from /api/refine. */
export interface RefineErrorBody {
  error: string
  message: string
  retryAfterSeconds?: number
}

// --- /api/admin/stats ---

export type UsageStatus = 'ok' | 'rate_limited' | 'error'

export interface UsageEvent {
  ts: number
  ip: string
  model: string
  status: UsageStatus
  inputTokens?: number
  outputTokens?: number
  durationMs?: number
  cost?: number
  message?: string
}

export interface DailyUsage {
  date: string
  requests: number
  inputTokens: number
  outputTokens: number
  cost: number
  rateLimited: number
  errors: number
}

export interface IpUsage {
  ip: string
  requests: number
  lastSeenAt: number | null
}

export interface AdminStats {
  /** 'memory' means Redis is not configured — counters reset whenever the serverless instance recycles. */
  storage: 'redis' | 'memory'
  generatedAt: number
  totals: {
    requests: number
    inputTokens: number
    outputTokens: number
    cost: number
    rateLimited: number
    errors: number
  }
  daily: DailyUsage[]
  ips: IpUsage[]
  events: UsageEvent[]
  limits: {
    perIpHourly: number
    perIpDaily: number
    globalDaily: number
  }
}
