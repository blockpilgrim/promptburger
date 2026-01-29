import { Plus } from 'lucide-react'
import { useAppStore } from '../../store'
import { Button } from '../shared/Button'

export function AddBlockButton() {
  const addBlock = useAppStore((s) => s.addBlock)

  const handleAdd = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: 'custom',
      label: 'Custom Block',
      content: '',
      enabled: true,
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAdd}
      leftIcon={<Plus className="h-4 w-4" />}
      className="w-full justify-center border border-dashed border-border"
    >
      Add Block
    </Button>
  )
}
