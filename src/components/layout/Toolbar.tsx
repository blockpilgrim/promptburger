import { Settings, History } from 'lucide-react'
import { Button } from '../shared/Button'
import { BurgerIcon } from '../shared/BurgerIcon'
import { useAppStore } from '../../store'

interface ToolbarProps {
  onOpenSettings: () => void
  onOpenHistory: () => void
}

export function Toolbar({ onOpenSettings, onOpenHistory }: ToolbarProps) {
  const isDemoMode = useAppStore((s) => s.isDemoMode)

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2">
        <BurgerIcon className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-semibold tracking-tight text-text">
          PromptBurger
        </span>
        {isDemoMode && (
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            Demo
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenHistory}
          title="View prompt history"
          leftIcon={<History className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">History</span>
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
