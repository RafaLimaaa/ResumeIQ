interface Props {
  remaining: number
  onSignIn: () => void
}

export function FreeAnalysesBanner({ remaining, onSignIn }: Props) {
  return (
    <div className="mb-6 p-3 bg-surface border border-border rounded-lg flex items-center justify-between">
      <p className="text-xs text-text-secondary">
        {remaining > 0
          ? `${remaining} análise${remaining !== 1 ? 's' : ''} gratuita${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}`
          : 'Limite de análises gratuitas atingido'}
      </p>
      <button
        onClick={onSignIn}
        className="text-xs text-accent hover:text-indigo-400 transition-colors font-medium"
      >
        Entrar para análises ilimitadas
      </button>
    </div>
  )
}
