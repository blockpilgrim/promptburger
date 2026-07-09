import type { StateCreator } from 'zustand'
import type { AppStore, SettingsState } from '../types'

export const createSettingsSlice: StateCreator<AppStore, [], [], SettingsState> = (set) => ({
  isSettingsOpen: false,
  isDemoMode: false,

  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setDemoMode: (enabled) => set({ isDemoMode: enabled }),
})
