import { useAppStore } from '../../store'
import { AVAILABLE_MODELS } from '../../constants/models'

export function ModelSelector() {
  const selectedModel = useAppStore((s) => s.selectedModel)
  const setSelectedModel = useAppStore((s) => s.setSelectedModel)

  return (
    <div>
      <label
        htmlFor="model-select"
        className="mb-1.5 block text-sm font-medium text-text-muted"
      >
        Model
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  )
}
