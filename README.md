# ResumeIQ

Aplicação web que analisa a compatibilidade entre um currículo e uma descrição de vaga usando Google Gemini. Você faz upload do PDF, cola a vaga e recebe um score detalhado com pontos fortes, lacunas e sugestões.

🔗 [resume-iq-beryl.vercel.app](https://resume-iq-beryl.vercel.app)

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase — Auth, PostgreSQL, Edge Functions
- Google OAuth
- Google Gemini 2.5 Flash Lite
- pdfjs-dist

## Rodando localmente

```bash
git clone https://github.com/RafaLimaaa/ResumeIQ.git
cd ResumeIQ
npm install
```

Crie `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

```bash
npm run dev
```

## Autor

Feito por [Rafael Lima](https://github.com/RafaLimaaa)
