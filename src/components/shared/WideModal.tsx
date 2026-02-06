import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface WideModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: string
}

export function WideModal({ isOpen, onClose, title, children, maxWidth = 'max-w-4xl' }: WideModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className={cn(
          'flex w-full flex-col rounded-xl border border-border bg-surface shadow-2xl',
          'max-h-[90vh]',
          'animate-in fade-in zoom-in-95 duration-200',
          maxWidth,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-raised hover:text-text transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
