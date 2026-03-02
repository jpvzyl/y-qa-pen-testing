import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ScanSearch, ChevronLeft, ChevronRight } from 'lucide-react'
import { getScans } from '../lib/api'
import StatusBadge from '../components/StatusBadge'

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
      <div className="flex items-center gap-2 text-xs tabular-nums">
        {c.critical > 0 && <span className="text-red-400">{c.critical}C</span>}
        {c.high > 0 && <span className="text-orange-400">{c.high}H</span>}
        {c.medium > 0 && <span className="text-yellow-400">{c.medium}M</span>}
        {c.low > 0 && <span className="text-blue-400">{c.low}L</span>}
        {!c.critical && !c.high && !c.medium && !c.low && <span className="text-gray-600">—</span>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Scans</h2>
          <p className="text-sm text-gray-500">Manage penetration test scans</p>
        </div>
        <Link
          to="/scans/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          New Scan
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Mode</label>
          <div className="flex flex-wrap gap-1">
            {MODE_FILTERS.map((m) => (
              <button
                key={m}
                onClick={() => { setModeFilter(m); setPage(1) }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  modeFilter === m
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scan list */}
      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">{error}</div>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-16">
          <ScanSearch className="mb-3 h-10 w-10 text-gray-700" />
          <p className="text-sm text-gray-500">No scans found</p>
          <Link to="/scans/new" className="mt-3 text-sm text-red-400 hover:text-red-300">Start your first scan</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Findings</th>
                <th className="px-4 py-3 font-medium">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/scans/${scan.id}`} className="font-medium text-gray-200 hover:text-white">
                      {scan.target_url || scan.target || '—'}
                    </Link>
                    <p className="text-xs text-gray-600">{scan.target_type}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-400">{scan.scan_mode || scan.mode || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={scan.status} /></td>
                  <td className="px-4 py-3">{severitySummary(scan)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {scan.started_at ? new Date(scan.started_at).toLocaleDateString() : scan.created_at ? new Date(scan.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
