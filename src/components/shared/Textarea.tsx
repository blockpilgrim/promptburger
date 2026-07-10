import { type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  labelClassName?: string
  labelAccessory?: ReactNode
}

export function Textarea({
  label,
  labelClassName,
  labelAccessory,
  id,
  className,
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className={cn('block text-sm font-medium text-text-muted', labelClassName)}
        >
          {label}
        </label>
        {labelAccessory}
      </div>
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
