import { useMemo } from 'react'
import { WideModal } from '../shared/WideModal'
import { DiffViewer } from './DiffViewer'
import { computeLineDiff } from '../../lib/diff-utils'
import { formatDate } from '../../lib/format-utils'
import type { HistoryEntry } from '../../types'

interface DiffModalProps {
  isOpen: boolean
  onClose: () => void
  entryA: HistoryEntry
  entryB: HistoryEntry
}

export function DiffModal({ isOpen, onClose, entryA, entryB }: DiffModalProps) {
  // Sort chronologically: older = original
  const [older, newer] = entryA.timestamp <= entryB.timestamp
    ? [entryA, entryB]
    : [entryB, entryA]

  const lines = useMemo(
    () => computeLineDiff(older.canvas.content, newer.canvas.content),
    [older.canvas.content, newer.canvas.content],
  )

  const addedCount = lines.filter((l) => l.type === 'add').length
  const removedCount = lines.filter((l) => l.type === 'remove').length

  return (
    <WideModal isOpen={isOpen} onClose={onClose} title="Prompt Diff">
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border border-border bg-surface-alt p-3">
          <p className="font-medium text-text">Original</p>
          <p className="text-xs text-text-muted">{older.title}</p>
          <p className="text-xs text-text-muted">{formatDate(older.timestamp)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-alt p-3">
          <p className="font-medium text-text">Updated</p>
          <p className="text-xs text-text-muted">{newer.title}</p>
          <p className="text-xs text-text-muted">{formatDate(newer.timestamp)}</p>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
        <span className="text-success">+{addedCount} added</span>
        <span className="text-danger">-{removedCount} removed</span>
      </div>
      <DiffViewer lines={lines} />
    </WideModal>
  )
}
