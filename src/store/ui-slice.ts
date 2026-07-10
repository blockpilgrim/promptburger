import type { StateCreator } from 'zustand'
import type { AppStore, UIState } from '../types'

export const createUISlice: StateCreator<AppStore, [], [], UIState> = (set) => ({
  isRefining: false,
  streamedContent: '',
  toastMessage: null,
  toastType: null,
  toastAction: null,

  setIsRefining: (refining) => set({ isRefining: refining }),
  setStreamedContent: (content) => set({ streamedContent: content }),
  appendStreamedContent: (chunk) =>
    set((s) => ({ streamedContent: s.streamedContent + chunk })),

  showToast: (message, type, options) => {
    set({ toastMessage: message, toastType: type, toastAction: options?.action ?? null })
  },

  clearToast: () => set({ toastMessage: null, toastType: null, toastAction: null }),
})
