import { useState } from 'react'
import { useAppStore } from '../../store'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { DiffModal } from '../diff/DiffModal'
import { Trash2, Clock, ArrowUpRight, GitCompareArrows, Activity, DollarSign, Zap } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatDate, formatTokens, formatCost, formatDuration } from '../../lib/format-utils'

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
  const isCompareMode = useAppStore((s) => s.isCompareMode)
  const selectedForCompare = useAppStore((s) => s.selectedForCompare)
  const setCompareMode = useAppStore((s) => s.setCompareMode)
  const toggleCompareSelection = useAppStore((s) => s.toggleCompareSelection)
  const getCumulativeStats = useAppStore((s) => s.getCumulativeStats)

  const [isDiffOpen, setIsDiffOpen] = useState(false)

  const cumulative = getCumulativeStats()
  const hasCumulativeStats = cumulative.count > 0

  const selectedEntries = selectedForCompare
    .map((id) => history.find((e) => e.id === id))
    .filter(Boolean)

  return (
    <>
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
              {history.length >= 2 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={isCompareMode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCompareMode(!isCompareMode)}
                    leftIcon={<GitCompareArrows className="h-4 w-4" />}
                  >
                    {isCompareMode ? 'Exit Compare' : 'Compare Prompts'}
                  </Button>
                  {isCompareMode && selectedForCompare.length === 2 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsDiffOpen(true)}
                    >
                      View Diff
                    </Button>
                  )}
                  {isCompareMode && (
                    <span className="text-xs text-text-muted">
                      {selectedForCompare.length}/2 selected
                    </span>
                  )}
                </div>
              )}
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {history.map((entry) => {
                  const isSelected = selectedForCompare.includes(entry.id)
                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        'group flex items-start gap-3 rounded-lg border p-3 transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-surface-alt hover:border-primary/50',
                      )}
                      onClick={isCompareMode ? () => toggleCompareSelection(entry.id) : undefined}
                      role={isCompareMode ? 'checkbox' : undefined}
                      aria-checked={isCompareMode ? isSelected : undefined}
                      style={isCompareMode ? { cursor: 'pointer' } : undefined}
                    >
                      {isCompareMode && (
                        <div className={cn(
                          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                          isSelected ? 'border-primary bg-primary text-white' : 'border-border',
                        )}>
                          {isSelected && (
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          )}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text">
                          {truncate(entry.title, 60)}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {formatDate(entry.timestamp)}
                        </p>
                        {entry.stats && (
                          <div className="mt-1 flex items-center gap-3 text-[10px] text-text-muted">
                            <span className="flex items-center gap-0.5">
                              <Activity className="h-2.5 w-2.5" />
                              {formatTokens(entry.stats.inputTokens + entry.stats.outputTokens)}
                            </span>
                            {entry.stats.cost != null && (
                              <span className="flex items-center gap-0.5">
                                <DollarSign className="h-2.5 w-2.5" />
                                {formatCost(entry.stats.cost)}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Zap className="h-2.5 w-2.5" />
                              {formatDuration(entry.stats.durationMs)}
                            </span>
                          </div>
                        )}
                      </div>
                      {!isCompareMode && (
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
                      )}
                    </div>
                  )
                })}
              </div>

              {hasCumulativeStats && (
                <div className="rounded-lg border border-border bg-surface-alt px-3 py-2 text-xs text-text-muted">
                  <span className="font-medium text-text">Total Usage</span>
                  <span className="ml-1">({cumulative.count} prompts):</span>
                  <span className="ml-2">{formatTokens(cumulative.totalInputTokens + cumulative.totalOutputTokens)} tokens</span>
                  {cumulative.totalCost > 0 && (
                    <span className="ml-2">{formatCost(cumulative.totalCost)}</span>
                  )}
                  <span className="ml-2">{formatDuration(cumulative.totalDurationMs)}</span>
                </div>
              )}

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

      {selectedEntries.length === 2 && (
        <DiffModal
          isOpen={isDiffOpen}
          onClose={() => setIsDiffOpen(false)}
          entryA={selectedEntries[0]!}
          entryB={selectedEntries[1]!}
        />
      )}
    </>
  )
}
