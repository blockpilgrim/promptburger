import type { StateCreator } from 'zustand'
import type { AppStore, HistoryState, HistoryEntry } from '../types'

const MAX_HISTORY_ENTRIES = 50

export const createHistorySlice: StateCreator<AppStore, [], [], HistoryState> = (
  set,
  get,
) => ({
  history: [],
  isHistoryOpen: false,

  addHistoryEntry: (entry) =>
    set((state) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      }
      const updated = [newEntry, ...state.history].slice(0, MAX_HISTORY_ENTRIES)
      return { history: updated }
    }),

  removeHistoryEntry: (id) =>
    set((state) => ({
      history: state.history.filter((e) => e.id !== id),
    })),

  clearHistory: () => set({ history: [] }),

  loadHistoryEntry: (id) => {
    const state = get()
    const entry = state.history.find((e) => e.id === id)
    if (!entry) return

    // Restore sidebar state
    state.setSelectedRoles(entry.sidebar.selectedRoles)
    state.setContext(entry.sidebar.context)
    state.setTaskBraindump(entry.sidebar.taskBraindump)
    state.setConstraints(entry.sidebar.constraints)
    state.setExamples(entry.sidebar.examples)
    // Clear existing blocks and add history blocks
    state.blocks.forEach((b) => state.removeBlock(b.id))
    entry.sidebar.blocks.forEach((b) => state.addBlock(b))

    // Restore canvas state
    state.setContent(entry.canvas.content)
    state.setSuggestions(entry.canvas.suggestions)
    state.setIsEditable(true)

    // Close history modal
    set({ isHistoryOpen: false })
  },

  setHistoryOpen: (open) => set({ isHistoryOpen: open }),
})
