import { type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({
  label,
  id,
  className,
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-text-muted"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text',
          'placeholder:text-text-muted/60',
          'focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none',
          'resize-y',
          className,
        )}
        {...props}
      />
    </div>
  )
}
