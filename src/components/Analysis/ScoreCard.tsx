import { Progress } from '../ui/Progress'

interface ScoreCardProps {
  label: string
  score: number
  icon: React.ReactNode
}

function colorForScore(score: number): 'success' | 'warning' | 'error' {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

export function ScoreCard({ label, score, icon }: ScoreCardProps) {
  const color = colorForScore(score)
  const textColor = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  }[color]

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3 card-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={`text-base font-bold ${textColor}`}>{score}</span>
      </div>
      <Progress value={score} color={color} />
    </div>
  )
}
