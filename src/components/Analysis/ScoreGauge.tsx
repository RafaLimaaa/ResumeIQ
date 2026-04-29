import { useEffect, useState } from 'react'

interface ScoreGaugeProps {
  score: number
  size?: number
}

function scoreColor(score: number): string {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excelente'
  if (score >= 65) return 'Bom'
  if (score >= 50) return 'Regular'
  return 'Baixo'
}

export function ScoreGauge({ score, size = 180 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const cx = size / 2
  const cy = size / 2
  const r = (size / 2) * 0.78
  // Semicircle: from 180° to 0° (left to right, bottom half excluded)
  const startAngle = 180
  const endAngle = 0
  const totalArc = 180 // degrees

  const pct = animatedScore / 100
  const arcAngle = pct * totalArc
  const currentAngle = startAngle - arcAngle

  function polarToXY(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    }
  }

  function describeArc(startDeg: number, endDeg: number, radius: number) {
    const s = polarToXY(startDeg, radius)
    const e = polarToXY(endDeg, radius)
    const largeArc = startDeg - endDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  const trackPath = describeArc(startAngle, endAngle, r)
  const scorePath = animatedScore > 0
    ? describeArc(startAngle, currentAngle, r)
    : ''
  const color = scoreColor(score)
  const strokeWidth = size * 0.065

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Score arc */}
        {scorePath && (
          <path
            d={scorePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
        {/* Score text */}
        <text
          x={cx}
          y={size * 0.52}
          textAnchor="middle"
          fontSize={size * 0.2}
          fontWeight="700"
          fill="#fafafa"
          fontFamily="Inter, sans-serif"
        >
          {animatedScore}
        </text>
        <text
          x={cx}
          y={size * 0.52 + size * 0.08}
          textAnchor="middle"
          fontSize={size * 0.075}
          fill="#a1a1aa"
          fontFamily="Inter, sans-serif"
        >
          de 100
        </text>
      </svg>
      <span
        className="text-sm font-semibold px-3 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}20` }}
      >
        {scoreLabel(score)}
      </span>
    </div>
  )
}
