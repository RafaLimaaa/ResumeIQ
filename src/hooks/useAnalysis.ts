import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Analysis, AnalysisRequest, AnalysisRawResult } from '../types'

interface UseAnalysisReturn {
  analyses: Analysis[]
  loading: boolean
  error: string | null
  fetchAnalyses: () => Promise<void>
  runAnalysis: (request: AnalysisRequest) => Promise<Analysis | null>
  deleteAnalysis: (id: string) => Promise<void>
}

export function useAnalysis(): UseAnalysisReturn {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (fetchError) throw fetchError
      setAnalyses(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar análises')
    } finally {
      setLoading(false)
    }
  }, [])

  const runAnalysis = useCallback(async (request: AnalysisRequest): Promise<Analysis | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      // For authenticated users, explicitly pass the JWT so the Edge Function
      // can identify the user. For anonymous users, omit the header and let the
      // Supabase SDK handle auth internally — passing the raw sb_publishable_*
      // key manually as Bearer causes 401 because it is not a JWT.
      const invokeHeaders = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined

      const response = await supabase.functions.invoke<{
        analysis: Analysis
        result: AnalysisRawResult
      }>('analyze-resume', {
        body: request,
        ...(invokeHeaders && { headers: invokeHeaders }),
      })

      if (response.error) throw new Error(response.error.message)

      const savedAnalysis = response.data?.analysis ?? null
      if (savedAnalysis) {
        setAnalyses((prev) => [savedAnalysis, ...prev])
      }

      return savedAnalysis
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar análise')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAnalysis = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return { analyses, loading, error, fetchAnalyses, runAnalysis, deleteAnalysis }
}
