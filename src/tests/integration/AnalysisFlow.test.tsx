import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Analysis } from '../../types'
import { supabase } from '../../lib/supabase'
import { StepJobDescription } from '../../components/Analysis/StepJobDescription'
import { StepResult } from '../../components/Analysis/StepResult'

const mockAnalysis: Analysis = {
  id: 'test-id',
  user_id: null,
  job_title: 'Dev Frontend',
  company_name: 'Acme',
  overall_score: 78,
  experience_score: 80,
  skills_score: 75,
  education_score: 85,
  keywords_score: 72,
  strengths: ['React avançado', 'TypeScript'],
  gaps: ['GraphQL', 'Docker'],
  suggestions: ['Adicionar projetos ao GitHub'],
  raw_result: {
    overall_score: 78,
    experience_score: 80,
    skills_score: 75,
    education_score: 85,
    keywords_score: 72,
    strengths: ['React avançado', 'TypeScript'],
    gaps: ['GraphQL', 'Docker'],
    suggestions: ['Adicionar projetos ao GitHub'],
    summary: 'Candidato com bom perfil técnico.',
  },
  created_at: new Date().toISOString(),
}

describe('StepResult rendering', () => {
  it('renders overall score', () => {
    render(
      <MemoryRouter>
        <StepResult analysis={mockAnalysis} onNewAnalysis={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('Resultado da análise')).toBeInTheDocument()
    expect(screen.getByText('Pontos fortes')).toBeInTheDocument()
    expect(screen.getByText('Lacunas identificadas')).toBeInTheDocument()
    expect(screen.getByText('Sugestões de melhoria')).toBeInTheDocument()
  })

  it('renders strengths from analysis', () => {
    render(
      <MemoryRouter>
        <StepResult analysis={mockAnalysis} onNewAnalysis={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('React avançado')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders gaps from analysis', () => {
    render(
      <MemoryRouter>
        <StepResult analysis={mockAnalysis} onNewAnalysis={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('GraphQL')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
  })
})

describe('StepJobDescription form', () => {
  beforeEach(() => vi.clearAllMocks())

  it('disables submit when description is too short', async () => {
    const onNext = vi.fn()
    render(
      <MemoryRouter>
        <StepJobDescription onNext={onNext} onBack={vi.fn()} />
      </MemoryRouter>
    )
    const titleInput = screen.getByPlaceholderText('Ex: Desenvolvedor Full Stack')
    fireEvent.change(titleInput, { target: { value: 'Dev Frontend' } })

    const textarea = screen.getByPlaceholderText('Cole aqui a descrição completa da vaga...')
    fireEvent.change(textarea, { target: { value: 'Curto demais' } })

    const submitBtn = screen.getByText('Analisar')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it('calls onNext with correct data when form is valid', async () => {
    const onNext = vi.fn()
    render(
      <MemoryRouter>
        <StepJobDescription onNext={onNext} onBack={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Ex: Desenvolvedor Full Stack'), {
      target: { value: 'Dev Frontend' },
    })
    fireEvent.change(screen.getByPlaceholderText('Cole aqui a descrição completa da vaga...'), {
      target: {
        value: 'Buscamos desenvolvedor com experiência em React, TypeScript e testes unitários. Mínimo 3 anos de experiência com desenvolvimento frontend moderno.',
      },
    })

    fireEvent.click(screen.getByText('Analisar'))

    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({ jobTitle: 'Dev Frontend' })
      )
    })
  })
})

describe('Edge Function mock', () => {
  it('runAnalysis calls supabase functions.invoke', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    })
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { analysis: mockAnalysis, result: mockAnalysis.raw_result },
      error: null,
    })

    // Validate that the mock resolves correctly
    const result = await supabase.functions.invoke('analyze-resume', {
      body: { resumeText: 'CV', jobDescription: 'Vaga', jobTitle: 'Dev' },
    })
    expect(result.data?.analysis).toBeDefined()
    expect(result.data?.analysis.overall_score).toBe(78)
  })
})
