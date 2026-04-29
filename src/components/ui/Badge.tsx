import { type ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800 text-text-secondary',
  success: 'bg-green-900/40 text-success border border-green-800/40',
  warning: 'bg-amber-900/40 text-warning border border-amber-800/40',
  error: 'bg-red-900/40 text-error border border-red-800/40',
  accent: 'bg-indigo-900/40 text-accent border border-indigo-800/40',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
