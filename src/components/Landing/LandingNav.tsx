import { BrainCircuit } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  isAuthenticated: boolean
  onCTA: () => void
  onSignIn: () => void
}

export function LandingNav({ isAuthenticated, onCTA, onSignIn }: Props) {
  return (
    <header className="border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <BrainCircuit size={20} className="text-accent shrink-0" />
          <span className="font-semibold text-sm tracking-tight">ResumeIQ</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <Button size="sm" onClick={onCTA}>
              <span className="whitespace-nowrap">Acessar dashboard</span>
            </Button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
              >
                Entrar
              </button>
              <Button size="sm" onClick={onCTA}>
                <span className="whitespace-nowrap">Começar grátis</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
