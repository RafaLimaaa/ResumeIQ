import { Trash2, Building2, Calendar } from 'lucide-react'
import type { Analysis } from '../../types'

interface HistoryItemProps {
  analysis: Analysis
  onDelete: (id: string) => void
  onView: (analysis: Analysis) => void
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-error'
}

export function HistoryItem({ analysis, onDelete, onView }: HistoryItemProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4 hover:border-zinc-600 transition-colors">
      <button
        className="flex-1 flex items-center gap-4 text-left min-w-0"
        onClick={() => onView(analysis)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{analysis.job_title}</p>
          {analysis.company_name && (
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 size={11} className="text-text-secondary shrink-0" />
              <p className="text-xs text-text-secondary truncate">{analysis.company_name}</p>
            </div>
          )}
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar size={11} className="text-text-secondary shrink-0" />
            <p className="text-xs text-text-secondary">
              {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="text-center shrink-0">
          <p className={`text-2xl font-bold ${scoreColor(analysis.overall_score)}`}>
            {analysis.overall_score}
          </p>
          <p className="text-xs text-text-secondary">/ 100</p>
        </div>
      </button>

      <button
        onClick={() => onDelete(analysis.id)}
        className="text-text-secondary hover:text-error transition-colors shrink-0 p-1"
        title="Excluir análise"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
