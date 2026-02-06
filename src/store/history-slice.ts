import type { StateCreator } from 'zustand'
import type { AppStore, HistoryState, HistoryEntry, CumulativeStats } from '../types'

const MAX_HISTORY_ENTRIES = 50

export const createHistorySlice: StateCreator<AppStore, [], [], HistoryState> = (
  set,
  get,
) => ({
  history: [],
  isHistoryOpen: false,
  isCompareMode: false,
  selectedForCompare: [],

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
      selectedForCompare: state.selectedForCompare.filter((sid) => sid !== id),
    })),

  clearHistory: () => set({ history: [], selectedForCompare: [], isCompareMode: false }),

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

    // Restore stats if available
    state.setCurrentStats(entry.stats ?? null)

    // Close history modal
    set({ isHistoryOpen: false, isCompareMode: false, selectedForCompare: [] })
  },

  setHistoryOpen: (open) => {
    if (!open) {
      set({ isHistoryOpen: false, isCompareMode: false, selectedForCompare: [] })
    } else {
      set({ isHistoryOpen: true })
    }
  },

  getCumulativeStats: (): CumulativeStats => {
    const { history } = get()
    return history.reduce<CumulativeStats>(
      (acc, entry) => {
        if (!entry.stats) return acc
        return {
          totalInputTokens: acc.totalInputTokens + entry.stats.inputTokens,
          totalOutputTokens: acc.totalOutputTokens + entry.stats.outputTokens,
          totalCost: acc.totalCost + (entry.stats.cost ?? 0),
          totalDurationMs: acc.totalDurationMs + entry.stats.durationMs,
          count: acc.count + 1,
        }
      },
      { totalInputTokens: 0, totalOutputTokens: 0, totalCost: 0, totalDurationMs: 0, count: 0 },
    )
  },

  setCompareMode: (enabled) =>
    set({ isCompareMode: enabled, selectedForCompare: [] }),

  toggleCompareSelection: (id) =>
    set((state) => {
      const selected = state.selectedForCompare
      if (selected.includes(id)) {
        return { selectedForCompare: selected.filter((sid) => sid !== id) }
      }
      if (selected.length >= 2) return state
      return { selectedForCompare: [...selected, id] }
    }),
})
