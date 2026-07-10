import { useEffect, useState } from 'react'
import { Check, Coffee, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BUY_ME_A_COFFEE_URL } from '../../constants/links'
import type { ToastAction } from '../../types'

interface ToastProps {
  message: string | null
  type: 'success' | 'error' | null
  action?: ToastAction | null
  onDismiss: () => void
}

const TOAST_DURATION = 3000

export function Toast({ message, type, action, onDismiss }: ToastProps) {
  // Pause the auto-dismiss while the pointer or keyboard focus is on the toast,
  // so a rider link (Buy me a coffee) can't slide away mid-reach.
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!message || isPaused) return
    const timer = setTimeout(onDismiss, TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [message, isPaused, onDismiss])

  if (!message || !type) return null

  const showCoffee = action === 'coffee'

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        'fixed bottom-4 right-4 z-50 flex gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
        'animate-in slide-in-from-bottom-4 fade-in duration-200',
        showCoffee ? 'items-start' : 'items-center',
        type === 'success' && 'bg-success text-white',
        type === 'error' && 'bg-danger text-white',
      )}
    >
      {type === 'success' ? (
        <Check className={cn('h-4 w-4 shrink-0', showCoffee && 'mt-0.5')} />
      ) : (
        <X className="h-4 w-4 shrink-0" />
      )}
      <div className="flex flex-col gap-1">
        {/* Keep the copy confirmation on a single line. */}
        <span className={cn(type === 'success' && 'whitespace-nowrap')}>
          {message}
        </span>
        {showCoffee && (
          <a
            href={BUY_ME_A_COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-sm text-xs font-normal text-white/80 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Coffee className="h-3.5 w-3.5 shrink-0" />
            <span>
              Enjoying this?{' '}
              <span className="underline underline-offset-2">Buy me a coffee</span>
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
