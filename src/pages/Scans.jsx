import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ScanSearch, ChevronLeft, ChevronRight, Filter, ArrowUpRight } from 'lucide-react'
import { getScans } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import GlassCard from '../components/GlassCard'

const STATUS_FILTERS = ['all', 'queued', 'running', 'completed', 'failed', 'cancelled']
const MODE_FILTERS = ['all', 'quick', 'standard', 'deep', 'continuous', 'red_team']

export default function Scans() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [modeFilter, setModeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadScans()
  }, [statusFilter, modeFilter, page])

  async function loadScans() {
    try {
      setLoading(true)
      const params = { page, per_page: 15 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (modeFilter !== 'all') params.scan_mode = modeFilter

      const res = await getScans(params)
      const data = res.data
      setScans(data?.scans || data || [])
      setTotalPages(data?.meta?.total_pages || data?.total_pages || 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function severitySummary(scan) {
    const c = scan.finding_counts || scan.findings_count || {}
    return (
      <div className="flex items-center gap-1.5 text-xs tabular-nums">
        {c.critical > 0 && <span className="rounded-md bg-red-500/10 border border-red-500/15 px-2 py-0.5 font-bold text-red-400">{c.critical}C</span>}
        {c.high > 0 && <span className="rounded-md bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 font-bold text-orange-400">{c.high}H</span>}
        {c.medium > 0 && <span className="rounded-md bg-yellow-500/10 border border-yellow-500/15 px-2 py-0.5 font-bold text-yellow-400">{c.medium}M</span>}
        {c.low > 0 && <span className="rounded-md bg-blue-500/10 border border-blue-500/15 px-2 py-0.5 font-bold text-blue-400">{c.low}L</span>}
        {!c.critical && !c.high && !c.medium && !c.low && <span className="text-gray-700">—</span>}
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Scans</h2>
          <p className="text-sm text-gray-500 mt-1">Manage penetration test scans</p>
        </div>
        <Link
          to="/scans/new"
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:shadow-red-500/30"
        >
          <Plus className="h-4 w-4" />
          New Scan
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Filters */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Filters</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-600">Status</label>
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1) }}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                    statusFilter === s
                      ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-600">Mode</label>
            <div className="flex flex-wrap gap-1">
              {MODE_FILTERS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setModeFilter(m); setPage(1) }}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                    modeFilter === m
                      ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Scan list */}
      {error ? (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </GlassCard>
      ) : loading ? (
        <div className="flex h-44 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
        </div>
      ) : scans.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-16">
          <ScanSearch className="mb-4 h-12 w-12 text-gray-800" />
          <p className="text-sm font-medium text-gray-500">No scans found</p>
          <Link to="/scans/new" className="mt-3 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">Start your first scan</Link>
        </GlassCard>
      ) : (
        <GlassCard padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  <th className="px-6 py-3.5">Target</th>
                  <th className="px-6 py-3.5">Mode</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Findings</th>
                  <th className="px-6 py-3.5">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {scans.map((scan) => (
                  <tr key={scan.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <Link to={`/scans/${scan.id}`} className="font-semibold text-gray-200 hover:text-white transition-colors">
                        {scan.target_url || scan.target || '—'}
                      </Link>
                      <p className="text-[11px] text-gray-600 mt-0.5">{scan.target_type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {scan.scan_mode || scan.mode || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={scan.status} /></td>
                    <td className="px-6 py-4">{severitySummary(scan)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {scan.started_at ? new Date(scan.started_at).toLocaleDateString() : scan.created_at ? new Date(scan.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
