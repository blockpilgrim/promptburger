import { cn } from '../../lib/cn'
import type { DiffLine } from '../../lib/diff-utils'

interface DiffViewerProps {
  lines: DiffLine[]
}

export function DiffViewer({ lines }: DiffViewerProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border font-mono text-sm">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'flex',
            line.type === 'add' && 'bg-success/10',
            line.type === 'remove' && 'bg-danger/10',
          )}
        >
          <div
            className={cn(
              'w-1 shrink-0',
              line.type === 'add' && 'bg-success',
              line.type === 'remove' && 'bg-danger',
            )}
          />
          <div className="flex w-20 shrink-0 items-center justify-center gap-2 border-r border-border px-2 text-xs text-text-muted">
            <span className="w-8 text-right">{line.oldLineNum ?? ''}</span>
            <span className="w-8 text-right">{line.newLineNum ?? ''}</span>
          </div>
          <div className="flex-1 whitespace-pre px-3 py-0.5 text-text">
            {line.type === 'add' && <span className="text-success">+ </span>}
            {line.type === 'remove' && <span className="text-danger">- </span>}
            {line.type === 'unchanged' && <span className="text-text-muted">  </span>}
            {line.content}
          </div>
        </div>
      ))}
    </div>
  )
}
