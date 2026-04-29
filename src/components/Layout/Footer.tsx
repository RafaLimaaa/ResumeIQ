import { BrainCircuit } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">ResumeIQ</span>
        </div>
        <p className="text-xs text-text-secondary">
          {new Date().getFullYear()} ResumeIQ. Análise de currículo com inteligência artificial.
        </p>
      </div>
    </footer>
  )
}
