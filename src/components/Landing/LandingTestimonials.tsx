const testimonials = [
  {
    name: 'Ana Costa',
    role: 'Desenvolvedora Backend',
    text: 'Consegui identificar exatamente o que faltava no meu currículo para vagas sênior. Resultado: 3 entrevistas em uma semana.',
  },
  {
    name: 'Rafael Mendes',
    role: 'Product Manager',
    text: 'A análise de palavras-chave foi cirúrgica. Adaptei meu currículo e passei em todas as triagens de ATS.',
  },
  {
    name: 'Juliana Ferreira',
    role: 'UX Designer',
    text: 'Ferramenta direta, sem enrolação. As sugestões são acionáveis, não genéricas. Recomendo para qualquer profissional.',
  },
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function LandingTestimonials() {
  return (
    <section className="relative py-14">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-text-primary">O que dizem os usuários</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-surface border border-border rounded-lg p-5 space-y-4 card-glow">
              <p className="text-sm text-text-secondary leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-secondary">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
