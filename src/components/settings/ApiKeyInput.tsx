import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../../store'

export function ApiKeyInput() {
  const apiKey = useAppStore((s) => s.apiKey)
  const setApiKey = useAppStore((s) => s.setApiKey)
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label
        htmlFor="api-key"
        className="mb-1.5 block text-sm font-medium text-text-muted"
      >
        Anthropic API Key
      </label>
      <div className="relative">
        <input
          id="api-key"
          type={visible ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 pr-10 text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text transition-colors"
          aria-label={visible ? 'Hide API key' : 'Show API key'}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="mt-1.5 text-xs text-text-muted/70">
        Stored locally in your browser. Never sent anywhere except the Anthropic API.
      </p>
    </div>
  )
}
