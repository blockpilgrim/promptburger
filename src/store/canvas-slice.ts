import type { StateCreator } from 'zustand'
import type { AppStore, CanvasState } from '../types'

export const createCanvasSlice: StateCreator<AppStore, [], [], CanvasState> = (set) => ({
  content: '',
  suggestions: '',
  isEditable: false,
  isEditing: false,
  lastRefinedAt: null,
  currentStats: null,
  noteResponses: {},
  dismissedNotes: [],

  setContent: (content) => set({ content }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsEditable: (editable) => set({ isEditable: editable }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setCurrentStats: (stats) => set({ currentStats: stats }),

  setNoteResponse: (note, response) =>
    set((state) => {
      const next = { ...state.noteResponses }
      if (response) {
        next[note] = response
      } else {
        delete next[note]
      }
      return { noteResponses: next }
    }),

  dismissNote: (note) =>
    set((state) => {
      // Dismissing supersedes any answer already typed for the note.
      const next = { ...state.noteResponses }
      delete next[note]
      return {
        noteResponses: next,
        dismissedNotes: state.dismissedNotes.includes(note)
          ? state.dismissedNotes
          : [...state.dismissedNotes, note],
      }
    }),

  undismissNote: (note) =>
    set((state) => ({
      dismissedNotes: state.dismissedNotes.filter((n) => n !== note),
    })),

  clearNoteResponses: () => set({ noteResponses: {}, dismissedNotes: [] }),

  clearCanvas: () =>
    set({
      content: '',
      suggestions: '',
      isEditable: false,
      isEditing: false,
      lastRefinedAt: null,
      currentStats: null,
      noteResponses: {},
      dismissedNotes: [],
    }),
})
