import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ToastProps {
  message: string | null
  type: 'success' | 'error' | null
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message || !type) return null

  return (
    <div
      role="alert"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
        'animate-in slide-in-from-bottom-4 fade-in duration-200',
        type === 'success' && 'bg-emerald-600 text-white',
        type === 'error' && 'bg-red-600 text-white',
      )}
    >
      {type === 'success' ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
      {message}
    </div>
  )
}
