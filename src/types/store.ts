import type { RoleOption } from './roles'

// --- Refinement Stats ---
export interface RefinementStats {
  inputTokens: number
  outputTokens: number
  durationMs: number
  model: string
  cost?: number
}

// --- History Entry ---
export interface HistoryEntry {
  id: string
  timestamp: number
  title: string
  sidebar: {
    selectedRoles: RoleOption[]
    context: string
    taskBraindump: string
    constraints: string
    examples: string
    blocks: SidebarBlock[]
  }
  canvas: {
    content: string
    suggestions: string
  }
  stats?: RefinementStats
  isIteration?: boolean
}

// --- History Slice ---
export interface CumulativeStats {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  totalDurationMs: number
  count: number
}

export interface HistoryState {
  history: HistoryEntry[]
  isHistoryOpen: boolean
  isCompareMode: boolean
  selectedForCompare: string[]

  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  removeHistoryEntry: (id: string) => void
  clearHistory: () => void
  loadHistoryEntry: (id: string) => void
  setHistoryOpen: (open: boolean) => void
  getCumulativeStats: () => CumulativeStats
  setCompareMode: (enabled: boolean) => void
  toggleCompareSelection: (id: string) => void
}

// --- Sidebar Block ---
export interface SidebarBlock {
  id: string
  type: string
  label: string
  content: string
  enabled: boolean
}

// --- Sidebar Slice ---
export interface SidebarState {
  selectedRoles: RoleOption[]
  context: string
  taskBraindump: string
  constraints: string
  examples: string
  blocks: SidebarBlock[]

  setSelectedRoles: (roles: RoleOption[]) => void
  setContext: (text: string) => void
  setTaskBraindump: (text: string) => void
  setConstraints: (text: string) => void
  setExamples: (text: string) => void
  addBlock: (block: SidebarBlock) => void
  updateBlock: (id: string, content: string) => void
  removeBlock: (id: string) => void
  clearAll: () => void
}

// --- Canvas Slice ---
export interface CanvasState {
  content: string
  suggestions: string
  isEditable: boolean
  isEditing: boolean
  lastRefinedAt: number | null
  currentStats: RefinementStats | null

  setContent: (content: string) => void
  setSuggestions: (suggestions: string) => void
  setIsEditable: (editable: boolean) => void
  setIsEditing: (editing: boolean) => void
  setCurrentStats: (stats: RefinementStats | null) => void
  clearCanvas: () => void
}

// --- Settings Slice ---
export interface SettingsState {
  apiKey: string
  selectedModel: string
  isSettingsOpen: boolean
  isDemoMode: boolean

  setApiKey: (key: string) => void
  setSelectedModel: (model: string) => void
  toggleSettings: () => void
  setSettingsOpen: (open: boolean) => void
  setDemoMode: (enabled: boolean) => void
}

// --- UI Slice ---
export interface UIState {
  isRefining: boolean
  streamedContent: string
  toastMessage: string | null
  toastType: 'success' | 'error' | null

  setIsRefining: (refining: boolean) => void
  setStreamedContent: (content: string) => void
  appendStreamedContent: (chunk: string) => void
  showToast: (message: string, type: 'success' | 'error') => void
  clearToast: () => void
}

// --- Combined ---
export type AppStore = SidebarState & CanvasState & SettingsState & UIState & HistoryState
