import { Briefcase, Zap, GraduationCap, Key } from 'lucide-react'

const features = [
  {
    icon: <Briefcase size={18} className="text-accent" />,
    title: 'Análise de experiência',
    description: 'Compara sua trajetória profissional com os requisitos da vaga.',
  },
  {
    icon: <Zap size={18} className="text-accent" />,
    title: 'Mapeamento de habilidades',
    description: 'Identifica quais competências você tem e quais ainda precisam ser desenvolvidas.',
  },
  {
    icon: <GraduationCap size={18} className="text-accent" />,
    title: 'Avaliação educacional',
    description: 'Verifica se sua formação atende ao perfil esperado pela empresa.',
  },
  {
    icon: <Key size={18} className="text-accent" />,
    title: 'Score de palavras-chave',
    description: 'Garante que seu currículo passe pelos filtros automáticos de recrutamento.',
  },
]

export function LandingFeatures() {
  return (
    <section className="relative py-14 bg-surface/30">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-text-primary">O que você recebe</h2>
          <p className="text-text-secondary mt-2 text-sm">Análise multidimensional em uma única consulta.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-lg p-5 flex items-start gap-4 card-glow">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-1">{f.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
