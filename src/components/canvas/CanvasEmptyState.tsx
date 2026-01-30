import { UtensilsCrossed } from 'lucide-react'

export function CanvasEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-muted">
      <UtensilsCrossed className="h-12 w-12 opacity-30" />
      <div className="text-center">
        <p className="text-sm font-medium">The plate is empty</p>
        <p className="mt-1 text-xs">
          Stack your ingredients and hit <span className="font-medium text-primary">Fire the Grill</span> to cook up your prompt.
        </p>
      </div>
    </div>
  )
}
