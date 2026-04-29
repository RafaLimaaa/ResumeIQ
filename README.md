# ResumeIQ

Análise de compatibilidade entre currículo e vaga de emprego com Google Gemini. Ferramenta SaaS construída para portfólio profissional.

## Stack

- **Frontend**: React 18, Vite, TypeScript (strict), Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **IA**: Google Gemini 1.5 Flash via Edge Function
- **Auth**: Google OAuth via Supabase
- **Formulários**: React Hook Form + Zod
- **PDF**: pdfjs-dist (extração) + jsPDF + html2canvas (export)
- **Testes**: Vitest + React Testing Library

## Funcionalidades

- Análise de compatibilidade currículo × vaga em segundos
- Score geral com gauge SVG animado
- 4 dimensões: experiência, habilidades, educação, palavras-chave
- Pontos fortes, lacunas e sugestões acionáveis
- 3 análises gratuitas sem login (localStorage)
- Login com Google para análises ilimitadas
- Histórico das últimas 10 análises (usuários autenticados)
- Export da análise em PDF

## Configuração

### 1. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 2. Banco de dados

```bash
supabase db push
```

Ou aplique manualmente o arquivo `supabase/migrations/20240101000000_initial_schema.sql` no SQL Editor do Supabase.

### 3. Edge Function

Configure os secrets no painel Supabase ou via CLI:

```bash
supabase secrets set GEMINI_API_KEY=sua_chave_gemini
```

Deploy da função:

```bash
supabase functions deploy analyze-resume
```

### 4. Google OAuth

No painel Supabase → Authentication → Providers → Google:
- Habilite o provider
- Configure Client ID e Client Secret do Google Cloud Console
- Adicione `https://<project-ref>.supabase.co/auth/v1/callback` como Authorized redirect URI

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm run test:run    # Uma execução
npm run test        # Modo watch
```

## Build

```bash
npm run build
```

## Arquitetura

```
Frontend (React + Vite)
    │
    ├── Extração PDF no browser (pdfjs-dist)
    ├── Controle de limite anônimo (localStorage)
    └── Chamada à Edge Function
            │
            └── Supabase Edge Function (analyze-resume)
                    ├── Verificação JWT (autenticação opcional)
                    ├── Chamada à Gemini API
                    ├── Parse e validação do JSON
                    └── Persistência em PostgreSQL (RLS)
```

## Segurança

- Gemini API chamada exclusivamente pela Edge Function (nunca exposta no frontend)
- RLS habilitado em todas as tabelas
- `VITE_SUPABASE_ANON_KEY` é pública por design — nunca misturar com `service_role key`
- Dados de currículo não são armazenados — apenas o resultado da análise
