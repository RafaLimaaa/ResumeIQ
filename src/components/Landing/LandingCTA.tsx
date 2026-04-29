import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  onCTA: () => void
}

export function LandingCTA({ onCTA }: Props) {
  return (
    <section className="relative py-14">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Pronto para descobrir seu score?
        </h2>
        <p className="text-text-secondary mb-8 text-sm">
          Sem cadastro obrigatório. Três análises gratuitas. Resultado em segundos.
        </p>
        <Button size="lg" onClick={onCTA}>
          Analisar meu currículo agora
          <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  )
}
