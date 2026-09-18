import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading, isConfigured } = useAuth()

  if (!isConfigured) {
    // Supabase not connected yet — let the admin area render so the
    // interface can still be reviewed, in place of an infinite redirect loop.
    return children
  }
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-fg">Loading…</div>
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
