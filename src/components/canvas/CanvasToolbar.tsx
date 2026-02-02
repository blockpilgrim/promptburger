import { ClipboardCopy, Flame, Trash2 } from 'lucide-react'
import { useAppStore } from '../../store'
import { useClipboard } from '../../hooks/useClipboard'
import { Button } from '../shared/Button'

interface CanvasToolbarProps {
  onReRefine: () => void
}

export function CanvasToolbar({ onReRefine }: CanvasToolbarProps) {
  const content = useAppStore((s) => s.content)
  const streamedContent = useAppStore((s) => s.streamedContent)
  const isEditable = useAppStore((s) => s.isEditable)
  const isRefining = useAppStore((s) => s.isRefining)
  const clearCanvas = useAppStore((s) => s.clearCanvas)
  const { copyToClipboard } = useClipboard()

  const hasContent = !!(content || streamedContent)

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {isRefining ? 'Grilling...' : 'Your Burger'}
      </span>

      <div className="flex items-center gap-1">
        {isEditable && !isRefining && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReRefine}
            leftIcon={<Flame className="h-3.5 w-3.5" />}
          >
            Re-grill
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(content)}
          disabled={!content || isRefining}
          leftIcon={<ClipboardCopy className="h-3.5 w-3.5" />}
        >
          Bag It
        </Button>

        {hasContent && !isRefining && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            className="text-text-muted hover:text-danger"
          >
            Clear Plate
          </Button>
        )}
      </div>
    </div>
  )
}
