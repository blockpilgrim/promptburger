import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Spinner } from './Spinner'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary',
  secondary:
    'bg-surface-raised text-text border border-border hover:bg-surface-alt focus-visible:ring-border',
  ghost:
    'text-text-muted hover:text-text hover:bg-surface-raised focus-visible:ring-border',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
} as const

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
  leftIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
    </button>
  )
}
