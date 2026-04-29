import { Briefcase, BookOpen, Star, AlertTriangle, Lightbulb, RotateCcw, Zap, GraduationCap, Key } from 'lucide-react'
import type { Analysis } from '../../types'
import { ScoreGauge } from './ScoreGauge'
import { ScoreCard } from './ScoreCard'
import { ExportButton } from './ExportButton'
import { Card } from '../ui/Card'

interface StepResultProps {
  analysis: Analysis
  onNewAnalysis: () => void
}

export function StepResult({ analysis, onNewAnalysis }: StepResultProps) {
  const resultId = 'analysis-result-export'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Resultado da análise</h2>
          <p className="text-sm text-text-secondary mt-1">
            {analysis.job_title}
            {analysis.company_name ? ` — ${analysis.company_name}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ExportButton analysis={analysis} targetId={resultId} />
          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 border border-border rounded"
          >
            <RotateCcw size={13} />
            Nova análise
          </button>
        </div>
      </div>

      <div id={resultId} className="space-y-6 bg-background p-1">
        {/* Score geral */}
        <Card>
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-4">
              Compatibilidade geral
            </p>
            <ScoreGauge score={analysis.overall_score} size={200} />
          </div>
        </Card>

        {/* Scores por categoria */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreCard
            label="Experiência"
            score={analysis.experience_score}
            icon={<Briefcase size={14} />}
          />
          <ScoreCard
            label="Habilidades"
            score={analysis.skills_score}
            icon={<Zap size={14} />}
          />
          <ScoreCard
            label="Educação"
            score={analysis.education_score}
            icon={<GraduationCap size={14} />}
          />
          <ScoreCard
            label="Palavras-chave"
            score={analysis.keywords_score}
            icon={<Key size={14} />}
          />
        </div>

        {/* Resumo */}
        {analysis.raw_result?.summary && (
          <Card>
            <p className="text-sm text-text-secondary leading-relaxed">
              {analysis.raw_result.summary}
            </p>
          </Card>
        )}

        {/* Pontos fortes */}
        {analysis.strengths.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Star size={15} className="text-success" />
              <h3 className="text-sm font-semibold text-text-primary">Pontos fortes</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Lacunas */}
        {analysis.gaps.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-warning" />
              <h3 className="text-sm font-semibold text-text-primary">Lacunas identificadas</h3>
            </div>
            <ul className="space-y-2">
              {analysis.gaps.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Sugestões */}
        {analysis.suggestions.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={15} className="text-accent" />
              <h3 className="text-sm font-semibold text-text-primary">Sugestões de melhoria</h3>
            </div>
            <ul className="space-y-2">
              {analysis.suggestions.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary pt-2 border-t border-border">
        <BookOpen size={12} />
        Análise gerada por ResumeIQ com Google Gemini
      </div>
    </div>
  )
}
