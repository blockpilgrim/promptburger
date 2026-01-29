import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'
import { TASK_PLACEHOLDER } from '../../constants/placeholders'

export function TaskInput() {
  const taskBraindump = useAppStore((s) => s.taskBraindump)
  const setTaskBraindump = useAppStore((s) => s.setTaskBraindump)

  return (
    <Textarea
      label="Task"
      placeholder={TASK_PLACEHOLDER}
      value={taskBraindump}
      onChange={(e) => setTaskBraindump(e.target.value)}
      rows={8}
    />
  )
}
