import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'
import { CONTEXT_PLACEHOLDER } from '../../constants/placeholders'

export function ContextInput() {
  const context = useAppStore((s) => s.context)
  const setContext = useAppStore((s) => s.setContext)

  return (
    <Textarea
      label="The Bun"
      placeholder={CONTEXT_PLACEHOLDER}
      value={context}
      onChange={(e) => setContext(e.target.value)}
      rows={4}
    />
  )
}
