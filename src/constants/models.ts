export interface ModelOption {
  id: string
  label: string
  isDefault?: boolean
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5 (recommended)', isDefault: true },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (faster, cheaper)' },
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6 (most capable)' },
]

export const DEFAULT_MODEL = AVAILABLE_MODELS.find((m) => m.isDefault)!.id
