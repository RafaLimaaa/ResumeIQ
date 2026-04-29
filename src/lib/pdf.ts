import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Analysis } from '../types'

export async function exportAnalysisPDF(
  analysis: Analysis,
  elementId: string
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: '#09090b',
    scale: 2,
    useCORS: true,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // Header
  pdf.setFillColor(9, 9, 11)
  pdf.rect(0, 0, pageWidth, 20, 'F')
  pdf.setTextColor(99, 102, 241)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ResumeIQ', 10, 13)
  pdf.setTextColor(161, 161, 170)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(
    `Análise gerada em ${new Date(analysis.created_at).toLocaleDateString('pt-BR')}`,
    pageWidth - 10,
    13,
    { align: 'right' }
  )

  // Content
  let yPosition = 25
  if (imgHeight <= pageHeight - 30) {
    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight)
  } else {
    // Split across pages
    let remainingHeight = imgHeight
    let sourceY = 0
    const availableHeight = pageHeight - 30

    while (remainingHeight > 0) {
      const sliceHeight = Math.min(remainingHeight, availableHeight)
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = (sliceHeight * canvas.width) / imgWidth

      const ctx = sliceCanvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          (sliceHeight * canvas.width) / imgWidth,
          0,
          0,
          sliceCanvas.width,
          sliceCanvas.height
        )
      }

      pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 10, yPosition, imgWidth, sliceHeight)
      remainingHeight -= sliceHeight
      sourceY += (sliceHeight * canvas.width) / imgWidth

      if (remainingHeight > 0) {
        pdf.addPage()
        yPosition = 10
      }
    }
  }

  // Footer
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFillColor(9, 9, 11)
    pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F')
    pdf.setTextColor(161, 161, 170)
    pdf.setFontSize(8)
    pdf.text('Gerado por ResumeIQ', pageWidth / 2, pageHeight - 3, { align: 'center' })
  }

  const filename = `resumeiq-${analysis.job_title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`
  pdf.save(filename)
}
