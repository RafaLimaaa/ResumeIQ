import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'
import { StepUpload } from '../components/Analysis/StepUpload'
import { StepJobDescription } from '../components/Analysis/StepJobDescription'
import { LoadingAnalysis } from '../components/Analysis/LoadingAnalysis'
import { StepResult } from '../components/Analysis/StepResult'
import { AnalysisProgress } from '../components/Analysis/AnalysisProgress'
import { FreeAnalysesBanner } from '../components/Analysis/FreeAnalysesBanner'
import { LoginLimitModal } from '../components/Analysis/LoginLimitModal'
import { useAnalysis } from '../hooks/useAnalysis'
import { useAnalysisLimit } from '../hooks/useAnalysisLimit'
import { useAuthContext } from '../context/AuthContext'
import type { Analysis, AnalysisStep, StepUploadData, StepJobData } from '../types'

export function App() {
  const [step, setStep] = useState<AnalysisStep>('upload')
  const [uploadData, setUploadData] = useState<StepUploadData | null>(null)
  const [result, setResult] = useState<Analysis | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { runAnalysis, error } = useAnalysis()
  const { user, signInWithGoogle } = useAuthContext()
  const { isLimited, remaining, increment } = useAnalysisLimit()

  function handleUploadNext(data: StepUploadData) {
    if (!user && isLimited) { setShowLoginModal(true); return }
    setUploadData(data)
    setStep('job')
  }

  async function handleJobNext(jobData: StepJobData) {
    if (!uploadData) return
    if (!user && isLimited) { setShowLoginModal(true); return }

    setStep('loading')
    const analysis = await runAnalysis({
      resumeText: uploadData.extractedText,
      jobDescription: jobData.jobDescription,
      jobTitle: jobData.jobTitle,
      companyName: jobData.companyName,
      userId: user?.id,
    })

    if (analysis) {
      if (!user) increment()
      setResult(analysis)
      setStep('result')
    } else {
      setStep('job')
    }
  }

  function handleNewAnalysis() {
    setStep('upload')
    setUploadData(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <AnalysisProgress step={step} />

        {!user && step !== 'result' && step !== 'loading' && (
          <FreeAnalysesBanner remaining={remaining} onSignIn={signInWithGoogle} />
        )}

        {error && step === 'job' && (
          <div className="mb-4 flex items-center gap-2 text-error text-sm p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {step === 'upload' && <StepUpload onNext={handleUploadNext} />}
        {step === 'job' && (
          <StepJobDescription onNext={handleJobNext} onBack={() => setStep('upload')} />
        )}
        {step === 'loading' && <LoadingAnalysis />}
        {step === 'result' && result && (
          <StepResult analysis={result} onNewAnalysis={handleNewAnalysis} />
        )}
      </main>
      <Footer />
      <LoginLimitModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignIn={signInWithGoogle}
      />
    </div>
  )
}
