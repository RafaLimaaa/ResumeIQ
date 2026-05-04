# ResumeIQ

Ferramenta que analisa a compatibilidade entre um currículo e uma vaga usando Google Gemini. Projeto finalizado e em produção.

**Demo:** https://resume-iq-beryl.vercel.app  
**Repositório:** https://github.com/RafaLimaaa/ResumeIQ

## O que faz

Você cola a descrição da vaga e faz upload do currículo em PDF. A aplicação extrai o texto, manda para o Gemini via Edge Function e retorna um score de compatibilidade com breakdown por dimensão (experiência, habilidades, educação, palavras-chave), pontos fortes, lacunas e sugestões.

Usuários sem login têm 3 análises gratuitas (controladas por localStorage). Com login via Google, as análises são ilimitadas e ficam salvas no histórico.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Supabase — Auth, PostgreSQL, Edge Functions
- Google OAuth via Supabase
- Google Gemini (chamado exclusivamente pela Edge Function)
- pdfjs-dist para extração de PDF no browser
- jsPDF + html2canvas para export

## Rodando localmente

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

A `GEMINI_API_KEY` fica nos secrets da Edge Function, nunca no frontend:

```bash
npx supabase secrets set GEMINI_API_KEY=sua_chave --project-ref <project-ref>
```

## Banco de dados e Edge Function

Aplique as migrations:

```bash
npx supabase db push
```

Deploy da Edge Function:

```bash
npx supabase functions deploy analyze-resume --no-verify-jwt --project-ref <project-ref>
```

O `--no-verify-jwt` é intencional — a função gerencia autenticação internamente, identificando o usuário quando há JWT e permitindo anônimos quando não há.
