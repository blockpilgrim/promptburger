import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'
import { EXAMPLES_PLACEHOLDER } from '../../constants/placeholders'

export function ExamplesInput() {
  const examples = useAppStore((s) => s.examples)
  const setExamples = useAppStore((s) => s.setExamples)

  return (
    <Textarea
      label="Secret Sauce"
      placeholder={EXAMPLES_PLACEHOLDER}
      value={examples}
      onChange={(e) => setExamples(e.target.value)}
      rows={4}
    />
  )
}
