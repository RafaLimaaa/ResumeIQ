import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { exportAnalysisPDF } from '../../lib/pdf'
import type { Analysis } from '../../types'

interface ExportButtonProps {
  analysis: Analysis
  targetId: string
}

export function ExportButton({ analysis, targetId }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await exportAnalysisPDF(analysis, targetId)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} loading={exporting}>
      <Download size={15} />
      Exportar PDF
    </Button>
  )
}
