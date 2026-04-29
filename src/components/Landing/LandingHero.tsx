import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  isAuthenticated: boolean
  onCTA: () => void
  onSignIn: () => void
}

const previewBars = [
  { label: 'Experiência', value: 85 },
  { label: 'Habilidades', value: 78 },
  { label: 'Educação', value: 90 },
  { label: 'Palavras-chave', value: 75 },
]

export function LandingHero({ isAuthenticated, onCTA, onSignIn }: Props) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
      <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-xs text-accent font-medium mb-8">
        <CheckCircle size={12} />
        Análise com Google Gemini — 3 análises gratuitas
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
        Descubra se seu currículo
        <br />
        <span className="text-accent">está pronto para a vaga</span>
      </h1>

      <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
        Análise de compatibilidade em segundos. IA especializada em recrutamento compara seu
        currículo com qualquer vaga e aponta exatamente o que melhorar.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="lg" onClick={onCTA}>
          Analisar meu currículo agora
          <ArrowRight size={16} />
        </Button>
        {!isAuthenticated && (
          <button
            onClick={onSignIn}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            Entrar com Google
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="mt-14 max-w-2xl mx-auto bg-surface border border-border rounded-lg p-6 text-left card-glow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-secondary">Compatibilidade</p>
            <p className="text-sm font-medium text-text-primary">Desenvolvedor Full Stack — Acme Corp</p>
          </div>
          <div className="text-3xl font-bold text-success">82</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {previewBars.map((item, i) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{item.label}</span>
                <span className="text-text-primary font-medium">{item.value}</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-accent rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: animated ? `${item.value}%` : '0%',
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
