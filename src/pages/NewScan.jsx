import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, AlertTriangle, Clock, Zap, Shield, Crosshair, RefreshCw } from 'lucide-react'
import { createScan } from '../lib/api'

const TARGET_TYPES = [
  { value: 'web_application', label: 'Web Application' },
  { value: 'api', label: 'API' },
  { value: 'network', label: 'Network' },
  { value: 'mobile_api', label: 'Mobile API' },
  { value: 'cloud_infrastructure', label: 'Cloud Infrastructure' },
]

const SCAN_MODES = [
  { value: 'quick', label: 'Quick Scan', desc: '~15 minutes. Surface-level vulnerability assessment.', icon: Zap, color: 'text-blue-400' },
  { value: 'standard', label: 'Standard', desc: '1-2 hours. Comprehensive vulnerability scanning.', icon: ScanSearch, color: 'text-emerald-400' },
  { value: 'deep', label: 'Deep Scan', desc: '4-8 hours. Thorough testing with exploit validation.', icon: Shield, color: 'text-orange-400' },
  { value: 'continuous', label: 'Continuous', desc: 'Recurring scans on schedule.', icon: RefreshCw, color: 'text-purple-400' },
  { value: 'red_team', label: 'Red Team', desc: 'Full adversarial simulation. Most comprehensive.', icon: Crosshair, color: 'text-red-400' },
]

export default function NewScan() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    target_url: '',
    target_type: 'web_application',
    scan_mode: 'standard',
    authorized: false,
    authorization_doc_url: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.authorized) {
      setError('You must confirm authorization before scanning.')
      return
    }
    try {
      setSubmitting(true)
      setError(null)
      const res = await createScan(form)
      const scan = res.data?.scan || res.data
      navigate(`/scans/${scan.id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">New Pen Test Scan</h2>
        <p className="text-sm text-gray-500">Configure and launch a new penetration test</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target URL */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Target URL</label>
            <input
              type="url"
              required
              value={form.target_url}
              onChange={(e) => update('target_url', e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Target Type</label>
            <select
              value={form.target_type}
              onChange={(e) => update('target_type', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-red-500/50"
            >
              {TARGET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scan mode */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <label className="mb-3 block text-sm font-medium text-gray-300">Scan Mode</label>
          <div className="grid gap-2">
            {SCAN_MODES.map(({ value, label, desc, icon: Icon, color }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  form.scan_mode === value
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="scan_mode"
                  value={value}
                  checked={form.scan_mode === value}
                  onChange={(e) => update('scan_mode', e.target.value)}
                  className="mt-1 accent-red-500"
                />
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                <div>
                  <span className="text-sm font-medium text-gray-200">{label}</span>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Authorization */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Authorization Required</span>
          </div>
          <p className="text-xs text-gray-400">
            You must have explicit written authorization to perform penetration testing against the target.
            Unauthorized testing is illegal.
          </p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.authorized}
              onChange={(e) => update('authorized', e.target.checked)}
              className="mt-0.5 accent-red-500"
            />
            <span className="text-sm text-gray-300">
              I confirm I have written authorization to test this target
            </span>
          </label>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Authorization document URL (optional)</label>
            <input
              type="url"
              value={form.authorization_doc_url}
              onChange={(e) => update('authorization_doc_url', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {submitting ? 'Launching Scan...' : 'Launch Pen Test'}
        </button>
      </form>
    </div>
  )
}
