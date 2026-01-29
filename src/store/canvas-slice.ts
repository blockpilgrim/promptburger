import type { StateCreator } from 'zustand'
import type { AppStore, CanvasState } from '../types'

export const createCanvasSlice: StateCreator<AppStore, [], [], CanvasState> = (set) => ({
  content: '',
  suggestions: '',
  isEditable: false,
  isEditing: false,
  lastRefinedAt: null,

  setContent: (content) => set({ content }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsEditable: (editable) => set({ isEditable: editable }),
  setIsEditing: (editing) => set({ isEditing: editing }),

  clearCanvas: () =>
    set({
      content: '',
      suggestions: '',
      isEditable: false,
      isEditing: false,
      lastRefinedAt: null,
    }),
})
