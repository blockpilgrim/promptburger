import { jsonResponse } from './_lib/config.js'

export function GET(): Response {
  return jsonResponse({ ok: 'ts-lib-import' })
}
