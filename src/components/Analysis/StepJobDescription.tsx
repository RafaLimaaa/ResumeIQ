import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import type { StepJobData } from '../../types'

const schema = z.object({
  jobTitle: z.string().min(2, 'Informe o título da vaga.'),
  companyName: z.string().optional(),
  jobDescription: z.string().min(100, 'A descrição deve ter pelo menos 100 caracteres.'),
})

type FormValues = z.infer<typeof schema>

interface StepJobDescriptionProps {
  onNext: (data: StepJobData) => void
  onBack: () => void
}

export function StepJobDescription({ onNext, onBack }: StepJobDescriptionProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const description = watch('jobDescription') ?? ''

  function onSubmit(values: FormValues) {
    onNext({
      jobDescription: values.jobDescription,
      jobTitle: values.jobTitle,
      companyName: values.companyName,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Dados da vaga</h2>
        <p className="text-sm text-text-secondary mt-1">
          Cole a descrição completa da vaga para uma análise precisa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">
            Título da vaga <span className="text-error">*</span>
          </label>
          <input
            {...register('jobTitle')}
            placeholder="Ex: Desenvolvedor Full Stack"
            className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
          />
          {errors.jobTitle && (
            <p className="text-xs text-error">{errors.jobTitle.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Empresa</label>
          <input
            {...register('companyName')}
            placeholder="Ex: Acme Corp (opcional)"
            className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            Descrição da vaga <span className="text-error">*</span>
          </label>
          <span
            className={`text-xs ${description.length >= 100 ? 'text-success' : 'text-text-secondary'}`}
          >
            {description.length} / mín. 100 caracteres
          </span>
        </div>
        <textarea
          {...register('jobDescription')}
          rows={10}
          placeholder="Cole aqui a descrição completa da vaga..."
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors resize-none"
        />
        {errors.jobDescription && (
          <p className="text-xs text-error">{errors.jobDescription.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" type="button" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit">Analisar</Button>
      </div>
    </form>
  )
}
