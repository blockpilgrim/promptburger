import { type ReactNode } from 'react'

interface CanvasProps {
  children: ReactNode
}

export function Canvas({ children }: CanvasProps) {
  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-surface-alt">
      {children}
    </main>
  )
}
