import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'
import { CONSTRAINTS_PLACEHOLDER } from '../../constants/placeholders'

export function ConstraintsInput() {
  const constraints = useAppStore((s) => s.constraints)
  const setConstraints = useAppStore((s) => s.setConstraints)

  return (
    <Textarea
      label="Special Instructions"
      placeholder={CONSTRAINTS_PLACEHOLDER}
      value={constraints}
      onChange={(e) => setConstraints(e.target.value)}
      rows={4}
    />
  )
}
