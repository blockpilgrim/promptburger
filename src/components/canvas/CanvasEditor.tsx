import { useAppStore } from '../../store'

export function CanvasEditor() {
  const content = useAppStore((s) => s.content)
  const streamedContent = useAppStore((s) => s.streamedContent)
  const isRefining = useAppStore((s) => s.isRefining)
  const setContent = useAppStore((s) => s.setContent)

  const displayValue = isRefining ? streamedContent : content

  return (
    <textarea
      value={displayValue}
      onChange={(e) => {
        if (!isRefining) setContent(e.target.value)
      }}
      readOnly={isRefining}
      className="h-full min-h-0 w-full resize-none bg-transparent font-mono text-sm text-text focus:outline-none"
      placeholder="Your refined prompt will appear here..."
      spellCheck={false}
    />
  )
}
