import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg card-glow ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
