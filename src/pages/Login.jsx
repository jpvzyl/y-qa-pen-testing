import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2, Lock, Mail, ArrowRight, Fingerprint } from 'lucide-react'
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
    <div className="flex min-h-screen bg-[#030712] overflow-hidden">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center hero-gradient">
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-red-500/[0.03] blur-[100px] animate-breathe" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[80px] animate-breathe" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[60%] left-[40%] w-[300px] h-[300px] rounded-full bg-blue-500/[0.02] blur-[60px] animate-breathe" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-lg px-16 animate-fade-in">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/20 glow-red">
              <Shield className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Y-QA</h1>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Security Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-white mb-4">
            AI-Powered<br />
            <span className="gradient-text">Penetration Testing</span>
          </h2>

          <p className="text-base text-gray-400 leading-relaxed mb-10">
            Enterprise-grade security assessment with dual-AI architecture.
            Identify, analyse, and remediate vulnerabilities before they become breaches.
          </p>

          <div className="space-y-4">
            {[
              { label: 'ISO 27001 Compliance Mapping', detail: '93 controls assessed' },
              { label: 'OWASP Top 10 Coverage', detail: 'Full A01–A10 taxonomy' },
              { label: 'CVSS 3.1 Scoring', detail: 'Automated vector calculation' },
            ].map((f, i) => (
              <div key={f.label} className={`flex items-center gap-4 animate-slide-up stagger-${i + 2}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <Fingerprint className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-1 items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-sm space-y-8 animate-scale-in">
          {/* Mobile brand */}
          <div className="text-center lg:hidden">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/20 glow-red">
              <Shield className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-white">
              Y-QA <span className="gradient-text">Pen Testing</span>
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">AI-Driven Security Platform</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block">
            <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to your security dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400 animate-slide-down">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-red-400" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-800 bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-red-500/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-red-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-red-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-xl border border-gray-800 bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-red-500/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-red-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link to="/forgot-password" className="text-gray-500 transition-colors hover:text-gray-300">
                Forgot password?
              </Link>
              <Link to="/register" className="text-red-400 font-medium transition-colors hover:text-red-300">
                Create account
              </Link>
            </div>
          </form>

          <div className="flex items-center gap-3 pt-4">
            <div className="h-px flex-1 bg-gray-800/80" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">Secured by Y-QA</span>
            <div className="h-px flex-1 bg-gray-800/80" />
          </div>
        </div>
      </div>
    </div>
  )
}
