import { useAppStore } from '../../store'
import { cn } from '../../lib/cn'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { ApiKeyInput } from './ApiKeyInput'
import { ModelSelector } from './ModelSelector'
import { Play } from 'lucide-react'
import { getDemoScenario, resetDemoIndex } from '../../constants/demo-responses'

export function SettingsModal() {
  const isOpen = useAppStore((s) => s.isSettingsOpen)
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen)
  const isDemoMode = useAppStore((s) => s.isDemoMode)

  const handleDemoToggle = () => {
    const store = useAppStore.getState()
    if (!isDemoMode) {
      resetDemoIndex()
      const scenario = getDemoScenario()
      store.clearAll()
      store.setSelectedRoles(scenario.sidebar.roles)
      store.setContext(scenario.sidebar.context)
      store.setTaskBraindump(scenario.sidebar.task)
      store.setConstraints(scenario.sidebar.constraints)
      store.setExamples(scenario.sidebar.examples)
      store.setContent('')
      store.setSuggestions('')
      store.setDemoMode(true)
    } else {
      store.setDemoMode(false)
      store.clearAll()
      store.setContent('')
      store.setSuggestions('')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setSettingsOpen(false)}
      title="Kitchen Settings"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-alt px-4 py-3">
          <div className="flex items-center gap-3">
            <Play className="h-4 w-4 text-accent-foreground" />
            <div>
              <p className="text-sm font-medium text-text">Demo Mode</p>
              <p className="text-xs text-text-muted/70">
                Try the app with sample orders
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDemoMode}
            onClick={handleDemoToggle}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
              isDemoMode ? 'bg-accent' : 'bg-border',
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
                isDemoMode ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        <div className={cn(isDemoMode && 'opacity-50 pointer-events-none')}>
          <ApiKeyInput />
        </div>

        <ModelSelector />
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
          Done
        </Button>
      </div>
    </Modal>
  )
}
