import { useCallback, useRef, type DragEvent } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { useResumeUpload } from '../../hooks/useResumeUpload'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

interface StepUploadProps {
  onNext: (data: { file: File; extractedText: string }) => void
}

export function StepUpload({ onNext }: StepUploadProps) {
  const { file, extractedText, loading, error, handleFile, clear } = useResumeUpload()
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (f: File) => {
      handleFile(f)
    },
    [handleFile]
  )

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) processFile(dropped)
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) processFile(selected)
    e.target.value = ''
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Envie seu currículo</h2>
        <p className="text-sm text-text-secondary mt-1">Formato PDF, máximo 5MB.</p>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent/50 transition-all hover:shadow-[0_0_0_2px_#6366f1,0_0_20px_rgba(99,102,241,0.15)]"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? (
            <Spinner size={32} />
          ) : (
            <>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Upload size={22} className="text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">
                  Arraste seu PDF ou clique para selecionar
                </p>
                <p className="text-xs text-text-secondary mt-1">Apenas PDF — até 5MB</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-secondary">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            onClick={clear}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-error text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          disabled={!file || !extractedText || loading}
          onClick={() => file && extractedText && onNext({ file, extractedText })}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
