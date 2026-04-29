import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { Footer } from '../components/Layout/Footer'
import { LandingNav } from '../components/Landing/LandingNav'
import { LandingHero } from '../components/Landing/LandingHero'
import { LandingHowItWorks } from '../components/Landing/LandingHowItWorks'
import { LandingFeatures } from '../components/Landing/LandingFeatures'
import { LandingTestimonials } from '../components/Landing/LandingTestimonials'
import { LandingCTA } from '../components/Landing/LandingCTA'

export function Landing() {
  const { user, signInWithGoogle } = useAuthContext()
  const navigate = useNavigate()

  function handleCTA() {
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <LandingNav isAuthenticated={!!user} onCTA={handleCTA} onSignIn={signInWithGoogle} />
      <main className="flex-1">
        <LandingHero isAuthenticated={!!user} onCTA={handleCTA} onSignIn={signInWithGoogle} />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingCTA onCTA={handleCTA} />
      </main>
      <Footer />
    </div>
  )
}
