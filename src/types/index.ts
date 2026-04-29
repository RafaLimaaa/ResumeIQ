export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  free_analyses_used: number
  created_at: string
}

export interface Analysis {
  id: string
  user_id: string | null
  job_title: string
  company_name: string | null
  overall_score: number
  experience_score: number
  skills_score: number
  education_score: number
  keywords_score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  raw_result: AnalysisRawResult
  created_at: string
}

export interface AnalysisRawResult {
  overall_score: number
  experience_score: number
  skills_score: number
  education_score: number
  keywords_score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  summary: string
}

export interface ResumeFile {
  id: string
  user_id: string
  storage_path: string
  original_name: string
  created_at: string
}

export interface AnalysisRequest {
  resumeText: string
  jobDescription: string
  jobTitle: string
  companyName?: string
  userId?: string
}

export type AnalysisStep = 'upload' | 'job' | 'loading' | 'result'

export interface StepUploadData {
  file: File
  extractedText: string
}

export interface StepJobData {
  jobDescription: string
  jobTitle: string
  companyName?: string
}

export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface AnalysisLimitState {
  freeCount: number
  isLimited: boolean
  remaining: number
}

export type ScoreCategory = 'experience' | 'skills' | 'education' | 'keywords'

export interface ScoreCategoryConfig {
  key: ScoreCategory
  label: string
  scoreKey: keyof Pick<
    Analysis,
    'experience_score' | 'skills_score' | 'education_score' | 'keywords_score'
  >
}
