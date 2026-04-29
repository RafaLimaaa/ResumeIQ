import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { Spinner } from '../ui/Spinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={24} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
