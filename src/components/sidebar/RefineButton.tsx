import { Flame } from 'lucide-react'
import { useAppStore } from '../../store'
import { Button } from '../shared/Button'

interface RefineButtonProps {
  onRefine: () => void
}

export function RefineButton({ onRefine }: RefineButtonProps) {
  const taskBraindump = useAppStore((s) => s.taskBraindump)
  const isRefining = useAppStore((s) => s.isRefining)

  return (
    <div className="sticky bottom-0 border-t border-border bg-surface pt-4">
      <Button
        variant="primary"
        size="lg"
        onClick={onRefine}
        isLoading={isRefining}
        disabled={!taskBraindump.trim()}
        leftIcon={!isRefining ? <Flame className="h-4 w-4" /> : undefined}
        className="w-full"
      >
        {isRefining ? 'Grilling...' : 'Fire the Grill'}
      </Button>
    </div>
  )
}
