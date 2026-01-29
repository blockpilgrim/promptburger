import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { AppStore } from '../types'
import { createSidebarSlice } from './sidebar-slice'
import { createCanvasSlice } from './canvas-slice'
import { createSettingsSlice } from './settings-slice'
import { createUISlice } from './ui-slice'

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createSidebarSlice(...a),
        ...createCanvasSlice(...a),
        ...createSettingsSlice(...a),
        ...createUISlice(...a),
      }),
      {
        name: 'promptcomposer-store',
        partialize: (state) => ({
          selectedRoles: state.selectedRoles,
          taskBraindump: state.taskBraindump,
          constraints: state.constraints,
          blocks: state.blocks,
          apiKey: state.apiKey,
          selectedModel: state.selectedModel,
          isDemoMode: state.isDemoMode,
        }),
      },
    ),
  ),
)
