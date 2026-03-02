import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2 } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-100">Y-QA Pen Testing</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="text-gray-500 hover:text-gray-300 transition-colors">
              Forgot password?
            </Link>
            <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors">
              Don't have an account? Register
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
