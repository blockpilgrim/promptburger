import { FileText } from 'lucide-react'

export function CanvasEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-muted">
      <FileText className="h-12 w-12 opacity-30" />
      <div className="text-center">
        <p className="text-sm font-medium">No prompt yet</p>
        <p className="mt-1 text-xs">
          Fill in the sidebar and click <span className="font-medium text-primary">Refine with AI</span> to generate your prompt.
        </p>
      </div>
    </div>
  )
}
