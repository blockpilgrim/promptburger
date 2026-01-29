import { type ReactNode } from 'react'
import { Toolbar } from './Toolbar'

interface AppShellProps {
  onOpenSettings: () => void
  sidebar: ReactNode
  canvas: ReactNode
}

export function AppShell({ onOpenSettings, sidebar, canvas }: AppShellProps) {
  return (
    <div className="flex h-full flex-col">
      <Toolbar onOpenSettings={onOpenSettings} />
      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        {canvas}
      </div>
    </div>
  )
}
