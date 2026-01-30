import { X } from 'lucide-react'
import { useAppStore } from '../../store'
import { Textarea } from '../shared/Textarea'

interface SidebarBlockProps {
  id: string
  label: string
  content: string
}

export function SidebarBlock({ id, label, content }: SidebarBlockProps) {
  const updateBlock = useAppStore((s) => s.updateBlock)
  const removeBlock = useAppStore((s) => s.removeBlock)

  return (
    <div className="relative">
      <button
        onClick={() => removeBlock(id)}
        className="absolute right-0 top-0 rounded p-0.5 text-text-muted hover:text-danger transition-colors"
        aria-label={`Remove ${label} block`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <Textarea
        label={label}
        value={content}
        onChange={(e) => updateBlock(id, e.target.value)}
        rows={3}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  )
}
