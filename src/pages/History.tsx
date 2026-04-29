import { useState, useEffect } from 'react'
import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'
import { HistoryList } from '../components/History/HistoryList'
import { Modal } from '../components/ui/Modal'
import { StepResult } from '../components/Analysis/StepResult'
import { useAnalysis } from '../hooks/useAnalysis'
import { useToast } from '../components/ui/Toast'
import type { Analysis } from '../types'

export function History() {
  const { analyses, loading, fetchAnalyses, deleteAnalysis } = useAnalysis()
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  async function handleDelete(id: string) {
    try {
      await deleteAnalysis(id)
      showToast('Análise excluída.', 'success')
      if (selectedAnalysis?.id === id) setSelectedAnalysis(null)
    } catch {
      showToast('Erro ao excluir análise.', 'error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-text-primary">Histórico de análises</h1>
          <p className="text-sm text-text-secondary mt-1">
            Últimas {analyses.length > 0 ? analyses.length : 0} análises realizadas.
          </p>
        </div>

        <HistoryList
          analyses={analyses}
          loading={loading}
          onDelete={handleDelete}
          onView={setSelectedAnalysis}
        />
      </main>

      <Footer />

      <Modal
        open={selectedAnalysis !== null}
        onClose={() => setSelectedAnalysis(null)}
        title="Detalhes da análise"
      >
        {selectedAnalysis && (
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <StepResult
              analysis={selectedAnalysis}
              onNewAnalysis={() => setSelectedAnalysis(null)}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
