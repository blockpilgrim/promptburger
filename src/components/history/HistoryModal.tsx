import { useAppStore } from '../../store'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { Trash2, Clock, ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/cn'

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen).trim() + '...'
}

export function HistoryModal() {
  const isOpen = useAppStore((s) => s.isHistoryOpen)
  const setHistoryOpen = useAppStore((s) => s.setHistoryOpen)
  const history = useAppStore((s) => s.history)
  const loadHistoryEntry = useAppStore((s) => s.loadHistoryEntry)
  const removeHistoryEntry = useAppStore((s) => s.removeHistoryEntry)
  const clearHistory = useAppStore((s) => s.clearHistory)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setHistoryOpen(false)}
      title="Prompt History"
    >
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-text-muted/50" />
            <p className="mt-2 text-sm text-text-muted">
              No prompts yet. Fire the grill to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    'group flex items-start gap-3 rounded-lg border border-border bg-surface-alt p-3',
                    'hover:border-primary/50 transition-colors',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text">
                      {truncate(entry.title, 60)}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => loadHistoryEntry(entry.id)}
                      className="rounded p-1.5 text-text-muted hover:bg-surface-raised hover:text-primary transition-colors"
                      title="Load this prompt"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeHistoryEntry(entry.id)}
                      className="rounded p-1.5 text-text-muted hover:bg-surface-raised hover:text-red-500 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {history.length > 0 && (
              <div className="border-t border-border pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  Clear All History
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={() => setHistoryOpen(false)}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
