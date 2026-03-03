import { useEffect, useState, useRef } from 'react'
import { useParams, Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft, XCircle, Bug, FileText, Globe, Clock, Target, Activity, RefreshCw } from 'lucide-react'
import { getScan, cancelScan } from '../lib/api'
import { SCAN_PHASES } from '../lib/constants'
import { formatRelativeTime, getSeverityColor } from '../lib/utils'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'
import ProgressBar from '../components/ProgressBar'
import ScanWaveform from '../components/ScanWaveform'
import AnimatedCounter from '../components/AnimatedCounter'

const phaseLabels = {
  reconnaissance: 'Recon',
  scanning: 'Scan',
  enumeration: 'Enum',
  exploitation: 'Exploit',
  post_exploitation: 'Post-Exploit',
  reporting: 'Report',
}

function PhaseTimeline({ phases = [] }) {
  const phaseMap = {}
  phases.forEach((p) => { phaseMap[p.phase_type || p.name] = p })

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {SCAN_PHASES.map((name, idx) => {
        const phase = phaseMap[name]
        const status = phase?.status || 'pending'
        const isComplete = status === 'completed'
        const isRunning = status === 'running' || status === 'in_progress'
        const isFailed = status === 'failed'

        const style = isComplete
          ? { borderColor: '#22c55e', backgroundColor: '#22c55e20', color: '#22c55e' }
          : isRunning
            ? { borderColor: '#10b981', backgroundColor: '#10b98120', color: '#10b981' }
            : isFailed
              ? { borderColor: '#ef4444', backgroundColor: '#ef444420', color: '#ef4444' }
              : { borderColor: '#1f2937', backgroundColor: '#111827', color: '#4b5563' }

        return (
          <div key={name} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all duration-500 ${isRunning ? 'animate-pulse' : ''}`}
                style={style}
              >
                {idx + 1}
              </div>
              <span className="mt-1.5 text-[10px] text-gray-500 whitespace-nowrap">
                {phaseLabels[name] || name}
              </span>
              {phase?.duration && (
                <span className="text-[9px] text-gray-600">{phase.duration}</span>
              )}
            </div>
            {idx < SCAN_PHASES.length - 1 && (
              <div
                className="mx-1 mt-[-16px] h-0.5 w-6 transition-colors duration-500"
                style={{ backgroundColor: isComplete ? '#22c55e50' : '#1f2937' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ScanDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => {
    loadScan()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [id])

  async function loadScan() {
    try {
      setLoading(true)
      const res = await getScan(id)
      const data = res.data?.scan || res.data
      setScan(data)
      localStorage.setItem('yqa_last_scan_id', id)

      if (data.status === 'running' || data.status === 'in_progress' || data.status === 'queued') {
        if (pollRef.current) clearInterval(pollRef.current)
        pollRef.current = setInterval(async () => {
          try {
            const r = await getScan(id)
            const updated = r.data?.scan || r.data
            setScan(updated)
            if (updated.status !== 'running' && updated.status !== 'in_progress' && updated.status !== 'queued') {
              clearInterval(pollRef.current)
            }
          } catch {
            // silent
          }
        }, 5000)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this scan?')) return
    try {
      setCancelling(true)
      await cancelScan(id)
      loadScan()
    } catch (e) {
      setError(e.message)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
      </div>
    )
  }

  if (error || !scan) {
    return (
      <GlassCard glow="red" className="text-center">
        <p className="text-sm text-red-400">{error || 'Scan not found'}</p>
      </GlassCard>
    )
  }

  const isRunning = scan.status === 'running' || scan.status === 'in_progress'
  const isQueued = scan.status === 'queued'
  const counts = scan.finding_counts || scan.findings_count || {}
  const completedPhases = (scan.phases || []).filter((p) => p.status === 'completed').length
  const progress = scan.progress_percentage || Math.round((completedPhases / SCAN_PHASES.length) * 100)

  const tabs = [
    { to: `/scans/${id}/findings`, label: 'Findings', icon: Bug },
    { to: `/scans/${id}/reports`, label: 'Reports', icon: FileText },
  ]

  const isChildRoute = location.pathname !== `/scans/${id}` && !location.pathname.endsWith(`/scans/${id}/`)

  if (isChildRoute) {
    return <Outlet />
  }

  return (
    <div className="space-y-6">
      <Link to="/scans" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Scans
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{scan.target_url || scan.target}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {scan.target_type}</span>
            <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {scan.scan_mode || scan.mode}</span>
            {scan.started_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {formatRelativeTime(scan.started_at)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={scan.status} />
          {(isRunning || isQueued) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              {cancelling ? 'Cancelling...' : 'Cancel Scan'}
            </button>
          )}
          <button onClick={loadScan} className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Live waveform for running scans */}
      {isRunning && (
        <GlassCard className="!p-3" glow="green">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-400">SCAN IN PROGRESS</span>
            </div>
            <span className="text-xs tabular-nums text-gray-500">{progress}%</span>
          </div>
          <ProgressBar value={progress} color="bg-emerald-500" />
          <ScanWaveform active={true} color="#10b981" height={28} className="mt-2" />
        </GlassCard>
      )}

      {/* Phase timeline */}
      <GlassCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Scan Phases</h3>
        <PhaseTimeline phases={scan.phases || []} />
      </GlassCard>

      {/* Findings severity */}
      <GlassCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Findings by Severity</h3>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { key: 'critical', label: 'Critical' },
            { key: 'high', label: 'High' },
            { key: 'medium', label: 'Medium' },
            { key: 'low', label: 'Low' },
            { key: 'info', label: 'Info' },
          ].map(({ key, label }) => {
            const count = counts[key] || 0
            return (
              <div key={key} className="text-center rounded-lg border border-gray-800 bg-gray-950 p-3">
                <AnimatedCounter value={count} className="text-xl font-bold" style={{ color: getSeverityColor(key) }} />
                <p className="text-[10px] font-medium text-gray-500">{label}</p>
              </div>
            )
          })}
        </div>
        <div className="space-y-2">
          {['critical', 'high', 'medium', 'low', 'info'].map((key) => {
            const count = counts[key] || 0
            const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0) || 1
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-14 text-xs font-medium capitalize" style={{ color: getSeverityColor(key) }}>{key}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(count / total) * 100}%`, backgroundColor: getSeverityColor(key) }}
                  />
                </div>
                <span className="w-8 text-right text-xs tabular-nums text-gray-400">{count}</span>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-2 border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
