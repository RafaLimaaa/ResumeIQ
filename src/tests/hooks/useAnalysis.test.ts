import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalysis } from '../../hooks/useAnalysis'
import { supabase } from '../../lib/supabase'
import type { Analysis } from '../../types'

const mockAnalysis: Analysis = {
  id: 'test-id',
  user_id: 'user-id',
  job_title: 'Desenvolvedor Frontend',
  company_name: 'Acme',
  overall_score: 80,
  experience_score: 85,
  skills_score: 75,
  education_score: 90,
  keywords_score: 70,
  strengths: ['React', 'TypeScript'],
  gaps: ['GraphQL'],
  suggestions: ['Adicionar projetos pessoais'],
  raw_result: {
    overall_score: 80,
    experience_score: 85,
    skills_score: 75,
    education_score: 90,
    keywords_score: 70,
    strengths: ['React', 'TypeScript'],
    gaps: ['GraphQL'],
    suggestions: ['Adicionar projetos pessoais'],
    summary: 'Bom perfil.',
  },
  created_at: new Date().toISOString(),
}

describe('useAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchAnalyses populates analyses array', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [mockAnalysis], error: null }),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useAnalysis())
    await act(async () => result.current.fetchAnalyses())
    expect(result.current.analyses).toHaveLength(1)
    expect(result.current.analyses[0].id).toBe('test-id')
  })

  it('deleteAnalysis removes the analysis from state', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useAnalysis())

    // Seed state manually using fetchAnalyses mock
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [mockAnalysis], error: null }),
    } as unknown as ReturnType<typeof supabase.from>)

    await act(async () => result.current.fetchAnalyses())

    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    } as unknown as ReturnType<typeof supabase.from>)

    await act(async () => result.current.deleteAnalysis('test-id'))
    expect(result.current.analyses.find((a) => a.id === 'test-id')).toBeUndefined()
  })

  it('runAnalysis returns null and sets error on failure', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    })
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: { message: 'Erro de rede' } as Error,
    })

    const { result } = renderHook(() => useAnalysis())
    let analysis: Analysis | null = null
    await act(async () => {
      analysis = await result.current.runAnalysis({
        resumeText: 'texto',
        jobDescription: 'vaga',
        jobTitle: 'Dev',
      })
    })
    expect(analysis).toBeNull()
    expect(result.current.error).toBeTruthy()
  })
})
