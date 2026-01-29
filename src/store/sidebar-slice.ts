import type { StateCreator } from 'zustand'
import type { AppStore, SidebarState } from '../types'

export const createSidebarSlice: StateCreator<AppStore, [], [], SidebarState> = (set) => ({
  selectedRoles: [],
  taskBraindump: '',
  constraints: '',
  blocks: [],

  setSelectedRoles: (roles) => set({ selectedRoles: roles }),
  setTaskBraindump: (text) => set({ taskBraindump: text }),
  setConstraints: (text) => set({ constraints: text }),

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
      taskBraindump: '',
      constraints: '',
      blocks: [],
    }),
})
