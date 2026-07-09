export interface ModelOption {
  id: string
  label: string
  isDefault?: boolean
}

// Single-model app: everyone gets the latest Claude Sonnet. This list doubles
// as the server-side allowlist in api/refine.ts.
export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', isDefault: true },
]

export const DEFAULT_MODEL = AVAILABLE_MODELS.find((m) => m.isDefault)!.id
