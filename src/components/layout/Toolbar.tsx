import { Settings, FolderOpen, LayoutTemplate, History } from 'lucide-react'
import { Button } from '../shared/Button'
import { useAppStore } from '../../store'

interface ToolbarProps {
  onOpenSettings: () => void
}

export function Toolbar({ onOpenSettings }: ToolbarProps) {
  const isDemoMode = useAppStore((s) => s.isDemoMode)

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold tracking-tight text-text">
          PromptComposer
        </span>
        {isDemoMode && (
          <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Demo
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled
          title="Project Profiles — coming soon"
          leftIcon={<FolderOpen className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">Profiles</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled
          title="Templates — coming soon"
          leftIcon={<LayoutTemplate className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">Templates</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled
          title="History — coming soon"
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
