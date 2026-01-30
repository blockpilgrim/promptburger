import type { StateCreator } from 'zustand'
import type { AppStore, SidebarState } from '../types'

export const createSidebarSlice: StateCreator<AppStore, [], [], SidebarState> = (set) => ({
  selectedRoles: [],
  context: '',
  taskBraindump: '',
  constraints: '',
  examples: '',
  blocks: [],

  setSelectedRoles: (roles) => set({ selectedRoles: roles }),
  setContext: (text) => set({ context: text }),
  setTaskBraindump: (text) => set({ taskBraindump: text }),
  setConstraints: (text) => set({ constraints: text }),
  setExamples: (text) => set({ examples: text }),

  addBlock: (block) =>
    set((s) => ({ blocks: [...s.blocks, block] })),

  updateBlock: (id, content) =>
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    })),

  removeBlock: (id) =>
    set((s) => ({
      blocks: s.blocks.filter((b) => b.id !== id),
    })),

  clearAll: () =>
    set({
      selectedRoles: [],
      context: '',
      taskBraindump: '',
      constraints: '',
      examples: '',
      blocks: [],
    }),
})
