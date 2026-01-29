import { useAppStore } from '../../store'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { ApiKeyInput } from './ApiKeyInput'
import { ModelSelector } from './ModelSelector'

export function SettingsModal() {
  const isOpen = useAppStore((s) => s.isSettingsOpen)
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setSettingsOpen(false)}
      title="Settings"
    >
      <div className="space-y-5">
        <ApiKeyInput />
        <ModelSelector />
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
          Done
        </Button>
      </div>
    </Modal>
  )
}
