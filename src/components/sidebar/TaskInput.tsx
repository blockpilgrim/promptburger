import { Flame } from 'lucide-react'
import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'
import { TASK_PLACEHOLDER } from '../../constants/placeholders'

export function TaskInput() {
  const taskBraindump = useAppStore((s) => s.taskBraindump)
  const setTaskBraindump = useAppStore((s) => s.setTaskBraindump)

  return (
    <Textarea
      label="The Patty"
      labelClassName="font-semibold text-text"
      labelAccessory={
        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          <Flame className="h-2.5 w-2.5" aria-hidden="true" />
          Required
        </span>
      }
      placeholder={TASK_PLACEHOLDER}
      value={taskBraindump}
      onChange={(e) => setTaskBraindump(e.target.value)}
      rows={8}
      required
    />
  )
}
