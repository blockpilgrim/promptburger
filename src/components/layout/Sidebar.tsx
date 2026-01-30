import { type ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { useAppStore } from '../../store'
import { Button } from '../shared/Button'

interface SidebarProps {
  children: ReactNode
  footer?: ReactNode
}

export function Sidebar({ children, footer }: SidebarProps) {
  const clearAll = useAppStore((s) => s.clearAll)
  const clearCanvas = useAppStore((s) => s.clearCanvas)
  const hasContent = useAppStore(
    (s) => s.selectedRoles.length > 0 || s.context || s.taskBraindump || s.constraints || s.examples || s.blocks.length > 0,
  )

  const handleClearAll = () => {
    clearAll()
    clearCanvas()
  }

  return (
    <aside className="flex w-[33%] min-w-[300px] max-w-[420px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          Ingredients
        </span>
        {hasContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            leftIcon={<Trash2 className="h-3 w-3" />}
            className="text-text-muted hover:text-danger"
          >
            New Order
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-4">
        {children}
      </div>
      {footer && <div className="px-4 pb-4">{footer}</div>}
    </aside>
  )
}
