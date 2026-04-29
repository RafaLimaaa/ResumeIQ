import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, LogOut, History, User } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { Button } from '../ui/Button'

export function Header() {
  const { user, profile, signInWithGoogle, signOut } = useAuthContext()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-white/[0.08] bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrainCircuit size={20} className="text-accent" />
          <span className="font-semibold text-text-primary text-sm tracking-tight">ResumeIQ</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/history"
                className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm px-3 py-1.5"
              >
                <History size={15} />
                Histórico
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name ?? 'Avatar'}
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={14} className="text-text-secondary" />
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  title="Sair"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={signInWithGoogle}>
              Entrar com Google
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
