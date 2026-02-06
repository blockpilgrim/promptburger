import { Activity, DollarSign, Zap } from 'lucide-react'
import type { RefinementStats } from '../../types'
import { formatTokens, formatCost, formatDuration } from '../../lib/format-utils'

interface StatsBarProps {
  stats: RefinementStats
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-surface-alt px-6 py-1.5 text-xs text-text-muted">
      <span className="flex items-center gap-1" title="Input / Output tokens">
        <Activity className="h-3 w-3" />
        {formatTokens(stats.inputTokens)} in / {formatTokens(stats.outputTokens)} out
      </span>
      {stats.cost != null && (
        <span className="flex items-center gap-1" title="Estimated cost">
          <DollarSign className="h-3 w-3" />
          {formatCost(stats.cost)}
        </span>
      )}
      <span className="flex items-center gap-1" title="Duration">
        <Zap className="h-3 w-3" />
        {formatDuration(stats.durationMs)}
      </span>
    </div>
  )
}
