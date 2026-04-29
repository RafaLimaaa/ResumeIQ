# ResumeIQ — Guia do Projeto

## Descrição
ResumeIQ é uma aplicação web SaaS que analisa a compatibilidade entre um currículo e uma descrição de vaga usando Google Gemini. Voltado para portfólio profissional com padrões de código e design de produto real.

## Stack
- React 18 + Vite + TypeScript (strict, zero `any`)
- Tailwind CSS (paleta escura definida em tailwind.config.js)
- Supabase (Auth, Storage, PostgreSQL, Edge Functions)
- Google OAuth via Supabase Auth
- Google Gemini API (somente via Edge Function — nunca no frontend)
- React Router v6
- React Hook Form + Zod
- Lucide React (ícones)
- pdfjs-dist (extração de PDF)
- jsPDF + html2canvas (export PDF)
- Vitest + React Testing Library

## Comandos de desenvolvimento
```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção (tsc + vite build)
npm run test             # Testes em modo watch
npm run test:run         # Testes em modo CI (uma execução)
npm run supabase:start   # Inicia Supabase local
npm run supabase:db:push # Aplica migrations ao banco remoto
npm run supabase:functions:serve  # Serve Edge Functions localmente
```

## Supabase
- Projeto ID: rgnubvxweirzkmswalos
- URL: https://rgnubvxweirzkmswalos.supabase.co
- Google OAuth já configurado

## Fluxo de dados
```
Frontend → Supabase Edge Function (analyze-resume) → Gemini API
                    ↓
          Salva em tabela analyses
                    ↓
          Retorna resultado para o frontend
```

## Controle de análises gratuitas
- Usuários anônimos: até 3 análises gratuitas controladas por `localStorage` (chave: `resumeiq_free_count`)
- Na 4ª tentativa sem login: exibir modal de login obrigatório
- Usuários autenticados: análises ilimitadas
- Contador de usos autenticados fica em `profiles.free_analyses_used`

## Regras de segurança (obrigatórias)
- Nunca chamar a Gemini API diretamente do frontend
- Nunca expor a `service_role key` no frontend (apenas `VITE_SUPABASE_ANON_KEY` é pública)
- Sempre manter RLS habilitado em todas as tabelas
- Políticas RLS explícitas para SELECT, INSERT, UPDATE, DELETE em cada tabela

## Padrões de código
- Componentes: functional components + hooks, max 150 linhas por arquivo
- Nomenclatura: PascalCase para componentes, camelCase para funções/variáveis/hooks
- Exports: named exports (evitar default export em componentes)
- Sem `any` em TypeScript — usar tipos explícitos ou generics
- Sem emojis em nenhum lugar da UI — apenas ícones Lucide React
- Hooks customizados em `src/hooks/`, prefixo `use`
- Tipos centralizados em `src/types/index.ts`
- Comentários: apenas quando o "porquê" não é óbvio

## Estrutura de pastas
```
src/
├── types/index.ts
├── lib/supabase.ts, pdf.ts
├── hooks/useAuth.ts, useAnalysis.ts, useAnalysisLimit.ts, useResumeUpload.ts
├── context/AuthContext.tsx
├── pages/Landing.tsx, App.tsx, History.tsx
├── components/
│   ├── ui/          (Button, Card, Badge, Progress, Modal, Toast, Spinner)
│   ├── Layout/      (Header, Footer, ProtectedRoute)
│   ├── Analysis/    (StepUpload, StepJobDescription, StepResult, ScoreCard, ScoreGauge, LoadingAnalysis, ExportButton)
│   └── History/     (HistoryList, HistoryItem)
└── tests/
supabase/
├── migrations/
└── functions/analyze-resume/index.ts
```

## O que NUNCA fazer
- Chamar Gemini diretamente do frontend
- Usar `any` em TypeScript
- Desabilitar RLS
- Usar emojis na UI
- Criar componentes com mais de 150 linhas
- Usar `VITE_SUPABASE_ANON_KEY` como secret (é pública por design)
- Usar ilustrações SVG decorativas genéricas
- Usar fontes decorativas (apenas Inter)
