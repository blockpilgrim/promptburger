import { createHash, timingSafeEqual } from 'node:crypto'
import { getConfig, jsonResponse } from '../_lib/config.js'
import { readStats } from '../_lib/usage.js'

function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export async function GET(request: Request): Promise<Response> {
  const { adminPassword } = getConfig()
  if (!adminPassword) {
    return jsonResponse({ error: 'not_configured', message: 'Set the ADMIN_PASSWORD environment variable to enable the admin dashboard.' }, 503)
  }

  const auth = request.headers.get('authorization') ?? ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!provided || !safeEqual(provided, adminPassword)) {
    return jsonResponse({ error: 'unauthorized', message: 'Wrong password.' }, 401)
  }

  try {
    const stats = await readStats(new Date())
    return jsonResponse(stats)
  } catch (error) {
    console.error('Failed to read stats:', error)
    return jsonResponse({ error: 'stats_failed', message: 'Could not load usage stats.' }, 500)
  }
}
