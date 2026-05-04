# ResumeIQ

Analisa a compatibilidade entre um currículo e uma vaga de emprego usando Google Gemini.

**[resume-iq-beryl.vercel.app](https://resume-iq-beryl.vercel.app)**

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Supabase (Auth + PostgreSQL + Edge Functions), Google Gemini, Google OAuth

## Como rodar localmente

```bash
git clone https://github.com/RafaLimaaa/ResumeIQ.git
cd ResumeIQ
npm install
```

Crie o arquivo `.env.local` na raiz:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

```bash
npm run dev
```

## Autor

Desenvolvido por [Rafael Lima](https://github.com/RafaLimaaa)
