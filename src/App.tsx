import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { Sidebar } from './components/layout/Sidebar'
import { Canvas } from './components/layout/Canvas'
import { RoleSelector } from './components/sidebar/RoleSelector'
import { TaskInput } from './components/sidebar/TaskInput'
import { ConstraintsInput } from './components/sidebar/ConstraintsInput'
import { AddBlockButton } from './components/sidebar/AddBlockButton'
import { RefineButton } from './components/sidebar/RefineButton'
import { SidebarBlock } from './components/sidebar/SidebarBlock'
import { CanvasToolbar } from './components/canvas/CanvasToolbar'
import { CanvasEditor } from './components/canvas/CanvasEditor'
import { CanvasEmptyState } from './components/canvas/CanvasEmptyState'
import { SuggestionsPanel } from './components/canvas/SuggestionsPanel'
import { SettingsModal } from './components/settings/SettingsModal'
import { Toast } from './components/shared/Toast'
import { useAppStore } from './store'
import { useRefine } from './hooks/useRefine'
import { useClipboard } from './hooks/useClipboard'

export default function App() {
  const toggleSettings = useAppStore((s) => s.toggleSettings)
  const blocks = useAppStore((s) => s.blocks)
  const content = useAppStore((s) => s.content)
  const streamedContent = useAppStore((s) => s.streamedContent)
  const suggestions = useAppStore((s) => s.suggestions)
  const isRefining = useAppStore((s) => s.isRefining)
  const toastMessage = useAppStore((s) => s.toastMessage)
  const toastType = useAppStore((s) => s.toastType)
  const clearToast = useAppStore((s) => s.clearToast)

  const hasContent = !!(content || streamedContent)

  const { refine } = useRefine()
  const { copyToClipboard } = useClipboard()

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      // Cmd/Ctrl + Enter → Refine
      if (mod && e.key === 'Enter') {
        e.preventDefault()
        refine()
      }

      // Cmd/Ctrl + Shift + C → Copy prompt
      if (mod && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        const state = useAppStore.getState()
        if (state.content) copyToClipboard(state.content)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [refine, copyToClipboard])

  return (
    <>
      <AppShell
        onOpenSettings={toggleSettings}
        sidebar={
          <Sidebar footer={<RefineButton onRefine={refine} />}>
            <RoleSelector />
            <TaskInput />
            <ConstraintsInput />
            {blocks.map((block) => (
              <SidebarBlock
                key={block.id}
                id={block.id}
                label={block.label}
                content={block.content}
              />
            ))}
            <AddBlockButton />
          </Sidebar>
        }
        canvas={
          <Canvas>
            <CanvasToolbar onReRefine={refine} />
            {hasContent ? (
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col p-6">
                  <CanvasEditor />
                </div>
                {suggestions && !isRefining && (
                  <SuggestionsPanel suggestions={suggestions} />
                )}
              </div>
            ) : (
              <CanvasEmptyState />
            )}
          </Canvas>
        }
      />
      <SettingsModal />
      <Toast message={toastMessage} type={toastType} onDismiss={clearToast} />
    </>
  )
}
