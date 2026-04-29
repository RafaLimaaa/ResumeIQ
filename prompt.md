# ResumeIQ — Analisador Inteligente de Currículo por Vaga

## Contexto do projeto
ResumeIQ é uma aplicação web SaaS que utiliza IA (Google Gemini) para analisar 
a compatibilidade entre um currículo e uma descrição de vaga. O projeto é voltado 
para portfólio profissional com padrões de código e design de produto real.

Antes de escrever qualquer código:
1. Leia este prompt inteiro
2. Crie o CLAUDE.md
3. Crie a estrutura de pastas e tipos TypeScript
4. Implemente os schemas do Supabase
5. Só então inicie os componentes

---

## Stack obrigatória
- React 18+ com Vite
- TypeScript (strict mode, zero "any")
- Tailwind CSS
- Supabase (Auth + Storage + PostgreSQL + Edge Functions)
- Google OAuth via Supabase Auth
- Google Gemini API (chamada exclusivamente via Supabase Edge Function)
- React Router v6 (rotas)
- React Hook Form + Zod (formulários e validação)
- Lucide React (ícones — zero emojis em qualquer parte da UI)
- pdfjs-dist (extração de texto de PDF no frontend)
- jsPDF + html2canvas (export PDF)
- Vitest + React Testing Library (testes)

---

## Infraestrutura já configurada (não recriar)
- Projeto Supabase criado: rgnubvxweirzkmswalos
- Google OAuth habilitado no Supabase com Client ID e Client Secret configurados
- Chave do Gemini disponível como variável de ambiente: GEMINI_API_KEY
- Variáveis de ambiente do projeto (.env):
  VITE_SUPABASE_URL=https://rgnubvxweirzkmswalos.supabase.co
  VITE_SUPABASE_ANON_KEY=[anon key do projeto]
  (Nunca expor secret key no frontend)

---

## Banco de dados — schemas Supabase (criar via migration)

### Tabela: profiles
- id: uuid (FK → auth.users.id)
- email: text
- full_name: text
- avatar_url: text
- free_analyses_used: integer (default 0)
- created_at: timestamptz

### Tabela: analyses
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK → profiles.id, nullable — null para análises de usuários não autenticados)
- job_title: text
- company_name: text (opcional)
- overall_score: integer (0-100)
- experience_score: integer (0-100)
- skills_score: integer (0-100)
- education_score: integer (0-100)
- keywords_score: integer (0-100)
- strengths: text[] 
- gaps: text[]
- suggestions: text[]
- raw_result: jsonb
- created_at: timestamptz

### Tabela: resume_files
- id: uuid (PK)
- user_id: uuid (FK → profiles.id)
- storage_path: text
- original_name: text
- created_at: timestamptz

### RLS Policies (obrigatório em todas as tabelas)
Cada usuário acessa apenas seus próprios registros.
Implementar políticas explícitas de SELECT, INSERT, UPDATE, DELETE.
Nunca desabilitar RLS.

---

## Supabase Edge Function: analyze-resume

### Localização: supabase/functions/analyze-resume/index.ts

### Responsabilidades:
1. Receber: texto extraído do currículo + descrição da vaga + user_id (opcional)
2. Verificar autenticação via JWT do Supabase (se presente)
3. Verificar limite de análises gratuitas:
   - Usuário não autenticado pode realizar até 3 análises gratuitas.
   - A partir da 4ª tentativa sem login, retornar erro indicando necessidade de autenticação.
   - O controle do contador no frontend é feito via localStorage (chave: "resumeiq_free_count").
   - Usuário autenticado: análises ilimitadas.
4. Montar prompt estruturado para o Gemini
5. Chamar Gemini API (gemini-1.5-flash — gratuito e rápido)
6. Parsear resposta JSON do Gemini
7. Salvar resultado na tabela analyses (user_id pode ser null para anônimos)
8. Retornar resultado estruturado para o frontend

### Prompt para o Gemini (usar exatamente este formato):
Você é um especialista em recrutamento e análise de currículos.
Analise a compatibilidade entre o currículo e a vaga abaixo.
CURRÍCULO:
{resumeText}
DESCRIÇÃO DA VAGA:
{jobDescription}
Retorne APENAS um objeto JSON válido, sem markdown, sem explicações,
com exatamente esta estrutura:
{
"overall_score": number (0-100),
"experience_score": number (0-100),
"skills_score": number (0-100),
"education_score": number (0-100),
"keywords_score": number (0-100),
"strengths": string[] (máx 5 itens, frases curtas e concretas),
"gaps": string[] (máx 5 itens, frases curtas e concretas),
"suggestions": string[] (máx 5 sugestões acionáveis e específicas),
"summary": string (2-3 frases resumindo a compatibilidade geral)
}

---

## Estrutura de pastas
src/
├── types/
│   └── index.ts              # Todos os tipos e interfaces
├── lib/
│   ├── supabase.ts           # Client Supabase tipado
│   └── pdf.ts                # Utilitário de export PDF
├── hooks/
│   ├── useAuth.ts            # Estado de autenticação
│   ├── useAnalysis.ts        # CRUD de análises
│   ├── useAnalysisLimit.ts   # Controle de limite gratuito (localStorage + Supabase)
│   └── useResumeUpload.ts    # Upload e extração de texto do PDF com pdfjs-dist
├── context/
│   └── AuthContext.tsx       # Provider de autenticação
├── pages/
│   ├── Landing.tsx           # Página inicial pública
│   ├── App.tsx               # Dashboard principal (autenticado)
│   └── History.tsx           # Histórico de análises
├── components/
│   ├── ui/                   # Button, Card, Badge, Progress, Modal, Toast, Spinner
│   ├── Layout/               # Header, Footer, ProtectedRoute
│   ├── Analysis/
│   │   ├── StepUpload.tsx    # Etapa 1: upload do currículo
│   │   ├── StepJobDescription.tsx  # Etapa 2: descrição da vaga
│   │   ├── StepResult.tsx    # Etapa 3: resultado completo
│   │   ├── ScoreCard.tsx     # Card de score por categoria
│   │   ├── ScoreGauge.tsx    # Score geral visual (gauge/arco)
│   │   ├── LoadingAnalysis.tsx # Loading animado com mensagens progressivas
│   │   └── ExportButton.tsx  # Botão de export PDF
│   └── History/
│       ├── HistoryList.tsx
│       └── HistoryItem.tsx
├── tests/
│   ├── hooks/
│   ├── utils/
│   └── integration/
supabase/
├── migrations/               # SQL das tabelas e políticas RLS
└── functions/
    └── analyze-resume/
        └── index.ts

---

## Fluxo completo da aplicação

### Usuário não autenticado:
1. Vê landing page profissional
2. Clica em "Analisar currículo"
3. Passa pelas 3 etapas (upload → vaga → resultado)
4. Contador de análises gratuitas armazenado em localStorage (chave: "resumeiq_free_count")
5. Usuário não autenticado pode realizar até 3 análises gratuitas.
   Na 4ª tentativa, exibir modal de login obrigatório com Google antes de prosseguir.
6. Contador de análises restantes visível na UI (ex: "2 análises gratuitas restantes")

### Usuário autenticado:
1. Acessa dashboard diretamente
2. Análises ilimitadas
3. Histórico das últimas 10 análises
4. Pode deletar análises do histórico
5. Pode exportar qualquer resultado em PDF

---

## Fluxo em 3 etapas (componente principal)

### Etapa 1 — Upload do currículo
- Drag and drop ou click to upload
- Aceita apenas PDF
- Tamanho máximo: 5MB
- Feedback visual do arquivo carregado (nome + tamanho)
- Extração de texto do PDF no frontend com pdfjs-dist
- Botão "Próximo" habilitado apenas quando PDF válido carregado

### Etapa 2 — Descrição da vaga
- Textarea para colar a descrição
- Campo opcional: título da vaga e empresa
- Contador de caracteres (mínimo 100 para habilitar análise)
- Botão "Voltar" e "Analisar"

### Etapa 3 — Resultado
- Loading animado com mensagens progressivas:
  "Lendo seu currículo..." (1s)
  "Analisando requisitos da vaga..." (2s)
  "Calculando compatibilidade..." (3s)
  "Gerando recomendações..." (até resposta chegar)
- Score geral em destaque (gauge visual grande)
- 4 cards de score por categoria
- Seção "Pontos fortes" (verde)
- Seção "Lacunas identificadas" (âmbar)
- Seção "Sugestões de melhoria" (azul)
- Resumo textual da análise
- Botão "Exportar PDF"
- Botão "Nova análise"

---

## Design — diretrizes obrigatórias

### Referências visuais
Linear.app, Vercel Dashboard, Raycast — minimalismo técnico, 
tipografia afiada, espaço negativo generoso.

### Paleta
- Background: #09090b (quase preto, não preto puro)
- Surface: #18181b (cards e painéis)
- Border: #27272a (bordas sutis)
- Text primary: #fafafa
- Text secondary: #a1a1aa
- Accent: #6366f1 (indigo — usar com moderação)
- Success: #22c55e
- Warning: #f59e0b
- Error: #ef4444

### Tipografia
- Fonte: Inter (Google Fonts)
- Hierarquia clara: tamanhos definidos, peso variando entre 400/500/600/700
- Zero fontes decorativas

### Regras de design (não negociáveis)
- Zero emojis em qualquer lugar da interface
- Ícones: exclusivamente Lucide React
- Gradientes: permitidos com moderação (máximo 1 por seção, sutil)
- Sombras: sutis, nunca dramáticas
- Border radius: consistente (8px padrão, 12px para cards grandes)
- Animações: apenas onde agregam contexto (loading, transição de etapas)
- Sem ilustrações SVG genéricas decorativas
- Mobile-first, com foco principal em desktop

### Score gauge
O score geral deve ser exibido como um arco/semicírculo animado,
não como uma barra de progresso simples. Implementar com SVG puro.

---

## Landing page — seções obrigatórias

1. **Hero** — Headline direto, subheadline explicando o produto, 
   CTA "Analisar meu currículo agora", preview visual da ferramenta
2. **Como funciona** — 3 etapas visuais (upload → vaga → resultado)
3. **O que você recebe** — 4 cards com os tipos de análise
4. **Prova social** — Depoimentos fictícios mas críveis (sem exagero)
5. **CTA final** — Repetir chamada para ação
6. **Footer** — Simples, sem poluição

A landing page deve parecer de uma startup real.
Sem screenshots genéricos, sem emojis, sem bullet points com ícones coloridos.

---

## Export PDF

O PDF exportado deve conter:
- Header com logo ResumeIQ e data da análise
- Nome do cargo e empresa analisados
- Score geral
- Tabela de scores por categoria
- Seções de pontos fortes, lacunas e sugestões
- Footer com "Gerado por ResumeIQ"

Implementar com jsPDF + html2canvas capturando o componente de resultado.

---

## Testes obrigatórios (Vitest)

- useAnalysisLimit: limite gratuito via localStorage, incremento, reset após login
- useAnalysis: salvar, buscar, deletar análises
- Edge Function: mock da resposta do Gemini, validação do JSON
- Integração: fluxo completo das 3 etapas com mock da Edge Function
- Componente StepResult: renderização correta dos scores

---

## CLAUDE.md — criar antes de qualquer código

O arquivo CLAUDE.md deve conter:
- Descrição do projeto e stack
- Comandos de desenvolvimento (dev, build, test, supabase)
- Regras de segurança (nunca expor secret key, sempre usar RLS)
- Padrões de código (nomenclatura, estrutura de componentes)
- Fluxo de dados: frontend → Edge Function → Gemini → banco
- Controle de análises gratuitas: localStorage para anônimos, profiles para autenticados
- O que nunca fazer:
  - Chamar Gemini diretamente do frontend
  - Usar "any" em TypeScript
  - Desabilitar RLS
  - Usar emojis na UI
  - Criar componentes com mais de 150 linhas
  - Usar VITE_SUPABASE_ANON_KEY como secret (é pública, mas nunca misturar com a service_role key)

---

## Ordem de implementação obrigatória

1. CLAUDE.md
2. Estrutura de pastas
3. Tipos TypeScript (types/index.ts)
4. Migrations SQL (tabelas + RLS)
5. Supabase Edge Function (analyze-resume)
6. lib/supabase.ts e lib/pdf.ts
7. Hooks (useAuth, useAnalysis, useAnalysisLimit, useResumeUpload)
8. AuthContext
9. Componentes UI base (Button, Card, Badge, Progress, Modal, Toast, Spinner)
10. Layout (Header, Footer, ProtectedRoute)
11. Fluxo de análise (StepUpload, StepJobDescription, LoadingAnalysis, StepResult)
12. Páginas (Landing, App, History)
13. Roteamento (React Router)
14. Testes
15. README profissional

Não pule etapas. Não inicie componentes sem os tipos e hooks prontos.
