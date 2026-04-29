import { useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFPageProxy } from 'pdfjs-dist'

// Worker served as a static asset from public/ — avoids all Vite module
// resolution issues with pdfjs-dist v4 (no exports field, ESM-only).
// The file is kept in sync by the copyPdfjsWorker Vite plugin in vite.config.ts.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// Pass 1: standard extraction — no options, identical to the originally working call.
async function pass1Standard(page: PDFPageProxy): Promise<string> {
  try {
    const content = await page.getTextContent()
    let result = ''
    for (const item of content.items) {
      if (!('str' in item)) continue
      result += item.str
      result += item.hasEOL ? '\n' : ' '
    }
    const text = result.trim()
    console.log(`[pdfjs] pass1: ${text.length} chars`)
    return text
  } catch (err) {
    console.warn('[pdfjs] pass1 error:', err)
    return ''
  }
}

// Pass 2: includeMarkedContent=true — surfaces text in tagged PDF sections
// common in Canva exports and Word PDFs with custom themes.
async function pass2MarkedContent(page: PDFPageProxy): Promise<string> {
  try {
    const content = await page.getTextContent({ includeMarkedContent: true })
    let result = ''
    for (const item of content.items) {
      if (!('str' in item)) continue
      result += item.str
      result += item.hasEOL ? '\n' : ' '
    }
    const text = result.trim()
    console.log(`[pdfjs] pass2: ${text.length} chars`)
    return text
  } catch (err) {
    console.warn('[pdfjs] pass2 error:', err)
    return ''
  }
}

// Pass 3: operator list — collects unicode values from glyph objects that
// pdfjs resolved internally but getTextContent failed to surface.
async function pass3OperatorList(page: PDFPageProxy): Promise<string> {
  try {
    const ops = await page.getOperatorList()
    const parts: string[] = []
    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i]
      if (fn !== pdfjsLib.OPS.showText && fn !== pdfjsLib.OPS.showSpacedText) continue
      const glyphs = (ops.argsArray[i] as unknown[])[0]
      if (!Array.isArray(glyphs)) continue
      for (const g of glyphs) {
        if (typeof g === 'string') {
          parts.push(g)
        } else if (g !== null && typeof g === 'object' && 'unicode' in g) {
          parts.push((g as { unicode: string }).unicode)
        }
      }
    }
    const text = parts.join('').trim()
    console.log(`[pdfjs] pass3: ${text.length} chars`)
    return text
  } catch (err) {
    console.warn('[pdfjs] pass3 error:', err)
    return ''
  }
}

async function extractPageText(page: PDFPageProxy): Promise<string> {
  const p1 = await pass1Standard(page)
  if (p1) return p1

  const p2 = await pass2MarkedContent(page)
  if (p2) return p2

  return pass3OperatorList(page)
}

interface UseResumeUploadReturn {
  file: File | null
  extractedText: string
  loading: boolean
  error: string | null
  handleFile: (file: File) => Promise<void>
  clear: () => void
}

export function useResumeUpload(): UseResumeUploadReturn {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (selectedFile: File) => {
    setError(null)

    if (selectedFile.type !== 'application/pdf') {
      setError('Apenas arquivos PDF são aceitos.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setLoading(true)
    setFile(selectedFile)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      console.log(`[pdfjs] loaded: ${pdf.numPages} page(s)`)

      const pageParts: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const text = await extractPageText(page)
        if (text) pageParts.push(text)
      }

      const fullText = pageParts.join('\n').trim()
      console.log(`[pdfjs] total extracted: ${fullText.length} chars`)

      if (!fullText) {
        setError('Este PDF não possui texto que possamos ler. Para resolver: abra o arquivo no Word ou Google Docs e exporte novamente como PDF. Isso garante que o texto fique selecionável.')
        setFile(null)
        return
      }

      setExtractedText(fullText)
    } catch (err) {
      console.error('[pdfjs] fatal:', err)
      setError('Erro ao processar o PDF. Verifique se o arquivo está correto.')
      setFile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setFile(null)
    setExtractedText('')
    setError(null)
  }, [])

  return { file, extractedText, loading, error, handleFile, clear }
}
