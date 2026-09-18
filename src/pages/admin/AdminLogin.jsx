import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { House, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function AdminLogin() {
  const { signIn, user, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError(signInError)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-bg p-8 shadow-pop">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-fg">
            <House className="h-5 w-5" />
          </span>
          <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-fg">Manage products, categories and settings.</p>
        </div>

        {!isConfigured && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-ink">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p>Supabase isn't connected yet. Add your project URL and anon key to <code>.env</code> to enable real admin login.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
