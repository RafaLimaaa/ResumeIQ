import { Upload, FileSearch, BarChart3 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: <Upload size={20} className="text-accent" />,
    title: 'Envie seu currículo',
    description: 'Faça upload do seu PDF. Extraímos o texto automaticamente, sem armazenar dados sensíveis.',
  },
  {
    step: '02',
    icon: <FileSearch size={20} className="text-accent" />,
    title: 'Cole a descrição da vaga',
    description: 'Copie a descrição diretamente do LinkedIn, Gupy ou qualquer plataforma de recrutamento.',
  },
  {
    step: '03',
    icon: <BarChart3 size={20} className="text-accent" />,
    title: 'Receba sua análise',
    description: 'Score de compatibilidade, pontos fortes, lacunas e sugestões específicas para melhorar.',
  },
]

export function LandingHowItWorks() {
  return (
    <section className="relative py-14">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-text-primary">Como funciona</h2>
          <p className="text-text-secondary mt-2 text-sm">Três etapas, menos de dois minutos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-surface/30 border border-border rounded-lg p-5 card-glow">
              <div className="text-3xl font-bold text-accent/40 font-mono leading-none w-10 shrink-0 pt-1">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-text-primary text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
