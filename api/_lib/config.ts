function intEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function getConfig() {
  return {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
    adminPassword: process.env.ADMIN_PASSWORD ?? '',
    redisUrl: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? '',
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? '',
    perIpHourly: intEnv('RATE_LIMIT_PER_HOUR', 10),
    perIpDaily: intEnv('RATE_LIMIT_PER_DAY', 30),
    globalDaily: intEnv('RATE_LIMIT_GLOBAL_PER_DAY', 300),
  }
}

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}
