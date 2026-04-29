interface ProgressProps {
  value: number
  max?: number
  className?: string
  color?: 'accent' | 'success' | 'warning' | 'error'
}

const colorClasses = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

export function Progress({ value, max = 100, className = '', color = 'accent' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`w-full bg-zinc-800 rounded-full h-1.5 ${className}`}>
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${colorClasses[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
