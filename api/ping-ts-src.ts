import { AVAILABLE_MODELS } from '../src/constants/models.js'

export function GET(): Response {
  return new Response('ok-ts-src-import: ' + AVAILABLE_MODELS.length)
}
