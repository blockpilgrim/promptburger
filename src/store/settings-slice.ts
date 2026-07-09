import type { StateCreator } from 'zustand'
import type { AppStore, SettingsState } from '../types'

export const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'

export const createSettingsSlice: StateCreator<AppStore, [], [], SettingsState> = (set) => ({
  selectedModel: DEFAULT_MODEL,
  isSettingsOpen: false,
  isDemoMode: false,

  setSelectedModel: (model) => set({ selectedModel: model }),
  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setDemoMode: (enabled) => set({ isDemoMode: enabled }),
})
