import type { AnalysisStep } from '../../types'

const stepLabels: Record<Exclude<AnalysisStep, 'loading'>, string> = {
  upload: 'Currículo',
  job: 'Vaga',
  result: 'Resultado',
}

const stepOrder: Exclude<AnalysisStep, 'loading'>[] = ['upload', 'job', 'result']

interface Props {
  step: AnalysisStep
}

export function AnalysisProgress({ step }: Props) {
  if (step === 'loading') return null

  const currentStepIndex = stepOrder.indexOf(step as Exclude<AnalysisStep, 'loading'>)

  return (
    <div className="flex items-center gap-3 mb-8">
      {stepOrder.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= currentStepIndex
                  ? 'bg-accent text-white'
                  : 'bg-zinc-800 text-text-secondary'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs font-medium ${
                i <= currentStepIndex ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              {stepLabels[s]}
            </span>
          </div>
          {i < stepOrder.length - 1 && (
            <div className={`h-px w-8 ${i < currentStepIndex ? 'bg-accent' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
