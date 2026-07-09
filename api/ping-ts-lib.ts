import { jsonResponse } from './_lib/config'

export function GET(): Response {
  return jsonResponse({ ok: 'ts-lib-import' })
}
