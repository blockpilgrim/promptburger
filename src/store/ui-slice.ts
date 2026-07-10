import type { StateCreator } from 'zustand'
import type { AppStore, UIState } from '../types'

export const createUISlice: StateCreator<AppStore, [], [], UIState> = (set) => ({
  isRefining: false,
  isThinking: false,
  streamedContent: '',
  toastMessage: null,
  toastType: null,
  toastAction: null,

  setIsRefining: (refining) => set({ isRefining: refining }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setStreamedContent: (content) => set({ streamedContent: content }),
  appendStreamedContent: (chunk) =>
    set((s) => ({ streamedContent: s.streamedContent + chunk })),

  showToast: (message, type, options) => {
    set({ toastMessage: message, toastType: type, toastAction: options?.action ?? null })
  },

  clearToast: () => set({ toastMessage: null, toastType: null, toastAction: null }),
})
