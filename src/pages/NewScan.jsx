import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, AlertTriangle, Zap, Shield, Crosshair, RefreshCw, Globe, Code, Network, Smartphone, Cloud, ArrowRight, Lock, Info } from 'lucide-react'
import { createScan } from '../lib/api'
import { SCAN_MODES, TARGET_TYPES } from '../lib/constants'
import GlassCard from '../components/GlassCard'
import ScanWaveform from '../components/ScanWaveform'

const ICON_MAP = {
  globe: Globe, code: Code, network: Network, smartphone: Smartphone, cloud: Cloud,
}
const MODE_ICONS = {
  quick: Zap, standard: ScanSearch, deep: Shield, continuous: RefreshCw, red_team: Crosshair,
}

const AI_RECOMMENDATIONS = [
  { trigger: 'web_application', mode: 'deep', reason: 'Web applications benefit from deep scanning to detect injection, XSS, and access control flaws with exploit validation.' },
  { trigger: 'api', mode: 'standard', reason: 'API scanning with standard mode covers authentication, authorization, and data exposure issues effectively.' },
  { trigger: 'network', mode: 'deep', reason: 'Network targets require deep scanning to identify all open ports, services, and potential lateral movement paths.' },
  { trigger: 'cloud_infrastructure', mode: 'red_team', reason: 'Cloud infrastructure assessments benefit from red team simulation to test IAM, storage, and network misconfigurations.' },
]

export default function NewScan() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
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

  const recommendation = AI_RECOMMENDATIONS.find((r) => r.trigger === form.target_type)

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">
          New <span className="gradient-text">Pen Test</span>
        </h2>
        <p className="text-sm text-gray-500">Configure and launch an AI-driven penetration test</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: 'Target' },
          { n: 2, label: 'Configuration' },
          { n: 3, label: 'Authorization' },
        ].map(({ n, label }, idx) => (
          <div key={n} className="flex items-center gap-3">
            <button
              onClick={() => setStep(n)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                step === n
                  ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'
                  : step > n
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-gray-800 text-gray-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                {step > n ? '✓' : n}
              </span>
              {label}
            </button>
            {idx < 2 && <ArrowRight className="h-3 w-3 text-gray-700" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Target */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <GlassCard>
              <label className="mb-2 block text-sm font-medium text-gray-300">Target URL</label>
              <input
                type="url"
                required
                value={form.target_url}
                onChange={(e) => update('target_url', e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors"
              />
            </GlassCard>

            <GlassCard>
              <label className="mb-3 block text-sm font-medium text-gray-300">Target Type</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {TARGET_TYPES.map((t) => {
                  const Icon = ICON_MAP[t.icon] || Globe
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update('target_type', t.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                        form.target_type === t.value
                          ? 'border-red-500/40 bg-red-500/10 shadow-lg shadow-red-500/5'
                          : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${form.target_type === t.value ? 'text-red-400' : 'text-gray-500'}`} />
                      <span className={`text-xs font-medium ${form.target_type === t.value ? 'text-red-400' : 'text-gray-400'}`}>
                        {t.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </GlassCard>

            <button type="button" onClick={() => setStep(2)} disabled={!form.target_url}
              className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Scan Mode */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            {recommendation && (
              <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-blue-400">AI Recommendation</p>
                  <p className="mt-0.5 text-xs text-gray-400">{recommendation.reason}</p>
                  {form.scan_mode !== recommendation.mode && (
                    <button
                      type="button"
                      onClick={() => update('scan_mode', recommendation.mode)}
                      className="mt-2 text-[11px] font-medium text-blue-400 hover:text-blue-300 underline"
                    >
                      Switch to {SCAN_MODES.find((m) => m.value === recommendation.mode)?.label}
                    </button>
                  )}
                </div>
              </div>
            )}

            <GlassCard>
              <label className="mb-3 block text-sm font-medium text-gray-300">Scan Mode</label>
              <div className="grid gap-2">
                {SCAN_MODES.map(({ value, label, desc, color, intensity }) => {
                  const Icon = MODE_ICONS[value] || ScanSearch
                  const isSelected = form.scan_mode === value
                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-red-500/40 bg-red-500/5 shadow-lg shadow-red-500/5'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="scan_mode"
                        value={value}
                        checked={isSelected}
                        onChange={(e) => update('scan_mode', e.target.value)}
                        className="mt-1 accent-red-500"
                      />
                      <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">{label}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-1.5 w-3 rounded-full"
                                style={{ backgroundColor: i < intensity ? color : '#1f2937' }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-700 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800">
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Authorization */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <GlassCard>
              <h3 className="mb-3 text-sm font-semibold text-gray-300">Scan Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">Target</span>
                  <p className="mt-0.5 font-medium text-gray-200 break-all">{form.target_url}</p>
                </div>
                <div>
                  <span className="text-gray-600">Type</span>
                  <p className="mt-0.5 font-medium capitalize text-gray-200">{form.target_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Mode</span>
                  <p className="mt-0.5 font-medium capitalize text-gray-200">{form.scan_mode.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Intensity</span>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const mode = SCAN_MODES.find((m) => m.value === form.scan_mode)
                      return (
                        <div key={i} className="h-1.5 w-4 rounded-full" style={{ backgroundColor: i < (mode?.intensity || 2) ? mode?.color || '#ef4444' : '#1f2937' }} />
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ScanWaveform active={false} color={SCAN_MODES.find((m) => m.value === form.scan_mode)?.color} height={24} />
              </div>
            </GlassCard>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">Authorization Required</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                You must have explicit written authorization to perform penetration testing against the target.
                Unauthorized penetration testing is <strong className="text-yellow-400">illegal</strong> under the Computer Fraud and Abuse Act (CFAA)
                and similar legislation worldwide. Ensure you have proper scope documentation before proceeding.
              </p>
              <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-800 p-3 hover:border-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={form.authorized}
                  onChange={(e) => update('authorized', e.target.checked)}
                  className="mt-0.5 accent-red-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-medium text-gray-200">I confirm I have written authorization to test this target</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">I understand that unauthorized testing may result in legal consequences</p>
                </div>
              </label>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Authorization document URL (optional)</label>
                <input
                  type="url"
                  value={form.authorization_doc_url}
                  onChange={(e) => update('authorization_doc_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-lg border border-gray-700 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800">
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !form.authorized}
                className="flex-1 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Crosshair className="h-4 w-4" />
                    Launch Pen Test
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
