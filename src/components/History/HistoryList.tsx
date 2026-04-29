import type { Analysis } from '../../types'
import { HistoryItem } from './HistoryItem'
import { Spinner } from '../ui/Spinner'
import { ClipboardList } from 'lucide-react'

interface HistoryListProps {
  analyses: Analysis[]
  loading: boolean
  onDelete: (id: string) => void
  onView: (analysis: Analysis) => void
}

export function HistoryList({ analyses, loading, onDelete, onView }: HistoryListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size={24} />
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ClipboardList size={32} className="text-text-secondary" />
        <p className="text-sm text-text-secondary">Nenhuma análise realizada ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {analyses.map((a) => (
        <HistoryItem key={a.id} analysis={a} onDelete={onDelete} onView={onView} />
      ))}
    </div>
  )
}
