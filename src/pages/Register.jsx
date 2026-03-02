import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-100">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Get started with Y-QA Pen Testing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">First Name</label>
              <input type="text" required value={form.first_name} onChange={update('first_name')} placeholder="Jane" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Last Name</label>
              <input type="text" required value={form.last_name} onChange={update('last_name')} placeholder="Doe" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Email</label>
            <input type="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" className={inputCls} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Password</label>
            <input type="password" required value={form.password} onChange={update('password')} placeholder="••••••••" className={inputCls} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Confirm Password</label>
            <input type="password" required value={form.password_confirmation} onChange={update('password_confirmation')} placeholder="••••••••" className={inputCls} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 transition-colors">Sign in</Link>
          </p>
        </form>

        <p className="text-center text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Powered by <span className="text-gray-500">Y-QA</span>
        </p>
      </div>
    </div>
  )
}
