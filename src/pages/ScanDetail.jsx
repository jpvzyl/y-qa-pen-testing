import { useEffect, useState } from 'react'
import { useParams, Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft, XCircle, Bug, FileText, Globe, Clock, Target, Activity } from 'lucide-react'
import { getScan, cancelScan } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import ProgressBar from '../components/ProgressBar'

const PHASES = ['reconnaissance', 'scanning', 'enumeration', 'exploitation', 'post_exploitation', 'reporting']

const phaseIcons = {
  reconnaissance: '1',
  scanning: '2',
  enumeration: '3',
  exploitation: '4',
  post_exploitation: '5',
  reporting: '6',
}

function PhaseTimeline({ phases = [] }) {
  const phaseMap = {}
  phases.forEach((p) => { phaseMap[p.phase_type || p.name] = p })

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {PHASES.map((name, idx) => {
        const phase = phaseMap[name]
        const status = phase?.status || 'pending'
        const isComplete = status === 'completed'
        const isRunning = status === 'running' || status === 'in_progress'
        const isFailed = status === 'failed'

        const ringColor = isComplete ? 'border-green-500 bg-green-500/20 text-green-400'
          : isRunning ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400 animate-pulse'
          : isFailed ? 'border-red-500 bg-red-500/20 text-red-400'
          : 'border-gray-700 bg-gray-800 text-gray-600'

        return (
          <div key={name} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${ringColor}`}>
                {phaseIcons[name]}
              </div>
              <span className="mt-1 text-[10px] capitalize text-gray-500 whitespace-nowrap">
                {name.replace('_', ' ')}
              </span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className={`mx-1 mt-[-12px] h-0.5 w-6 ${isComplete ? 'bg-green-500/50' : 'bg-gray-800'}`} />
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

  useEffect(() => {
    loadScan()
  }, [id])

  async function loadScan() {
    try {
      setLoading(true)
      const res = await getScan(id)
      setScan(res.data?.scan || res.data)
      localStorage.setItem('yqa_last_scan_id', id)
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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
      </div>
    )
  }

  if (error || !scan) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-400">
        {error || 'Scan not found'}
      </div>
    )
  }

  const isRunning = scan.status === 'running' || scan.status === 'in_progress'
  const counts = scan.finding_counts || scan.findings_count || {}
  const completedPhases = (scan.phases || []).filter((p) => p.status === 'completed').length
  const progress = scan.progress_percentage || Math.round((completedPhases / PHASES.length) * 100)

  const tabs = [
    { to: `/scans/${id}/findings`, label: 'Findings', icon: Bug },
    { to: `/scans/${id}/reports`, label: 'Reports', icon: FileText },
  ]

  const isChildRoute = location.pathname !== `/scans/${id}`

  if (isChildRoute) {
    return <Outlet />
  }

  return (
    <div className="space-y-6">
      <Link to="/scans" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300">
        <ArrowLeft className="h-3 w-3" /> Back to Scans
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{scan.target_url || scan.target}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {scan.target_type}</span>
            <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {scan.scan_mode || scan.mode}</span>
            {scan.started_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {new Date(scan.started_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={scan.status} />
          {isRunning && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <XCircle className="h-3 w-3" />
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {/* Phase timeline */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Scan Phases</h3>
        <PhaseTimeline phases={scan.phases || []} />
      </div>

      {/* Finding severity bars */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Findings by Severity</h3>
        <div className="space-y-2">
          {[
            { label: 'Critical', key: 'critical', color: 'bg-red-500', text: 'text-red-400' },
            { label: 'High', key: 'high', color: 'bg-orange-500', text: 'text-orange-400' },
            { label: 'Medium', key: 'medium', color: 'bg-yellow-500', text: 'text-yellow-400' },
            { label: 'Low', key: 'low', color: 'bg-blue-500', text: 'text-blue-400' },
            { label: 'Info', key: 'info', color: 'bg-gray-500', text: 'text-gray-400' },
          ].map(({ label, key, color, text }) => {
            const count = counts[key] || 0
            const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0) || 1
            return (
              <div key={key} className="flex items-center gap-3">
                <span className={`w-16 text-xs font-medium ${text}`}>{label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <span className="w-8 text-right text-xs tabular-nums text-gray-400">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-0">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-200"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
