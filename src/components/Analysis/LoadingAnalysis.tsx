import { useEffect, useState } from 'react'
import { Spinner } from '../ui/Spinner'

const messages = [
  'Lendo seu currículo...',
  'Analisando requisitos da vaga...',
  'Calculando compatibilidade...',
  'Gerando recomendações...',
]

export function LoadingAnalysis() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timings = [1000, 2000, 3000]
    const timers = timings.map((delay, i) =>
      setTimeout(() => setMessageIndex(i + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <Spinner size={36} />
      <div className="text-center space-y-2">
        <p className="text-base font-medium text-text-primary transition-all duration-300">
          {messages[Math.min(messageIndex, messages.length - 1)]}
        </p>
        <p className="text-xs text-text-secondary">Isso pode levar alguns segundos...</p>
      </div>
      <div className="flex gap-1.5">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i <= messageIndex ? 'bg-accent' : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
