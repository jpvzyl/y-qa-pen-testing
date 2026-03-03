import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 cyber-grid">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 glow-red">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-100">
            Y-QA <span className="gradient-text">Pen Testing</span>
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">AI-Driven Penetration Testing Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:shadow-red-500/30 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="text-gray-500 hover:text-gray-300 transition-colors">
              Forgot password?
            </Link>
            <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors">
              Create account
            </Link>
          </div>
        </form>

        <p className="text-center text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Powered by <span className="text-gray-500">Y-QA</span>
        </p>
      </div>
    </div>
  )
}
