import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Filter, Bug } from 'lucide-react'
import { getScanFindings } from '../lib/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import GlassCard from '../components/GlassCard'

const SEVERITY_LEVELS = ['all', 'critical', 'high', 'medium', 'low', 'info']
const STATUS_OPTIONS = ['all', 'open', 'confirmed', 'resolved', 'false_positive', 'accepted']

export default function Findings() {
  const { id: scanId } = useParams()
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [severity, setSeverity] = useState('all')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    loadFindings()
  }, [scanId, severity, status])

  async function loadFindings() {
    try {
      setLoading(true)
      const params = {}
      if (severity !== 'all') params.severity = severity
      if (status !== 'all') params.status = status
      const res = await getScanFindings(scanId, params)
      setFindings(res.data?.findings || res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-7">
      <Link to={`/scans/${scanId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Scan
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Findings</h2>
          <p className="text-sm text-gray-500 mt-1">Vulnerabilities discovered during the scan</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Bug className="h-3.5 w-3.5" />
          {findings.length} results
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Filters</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-600">Severity</label>
            <div className="flex flex-wrap gap-1">
              {SEVERITY_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                    severity === s
                      ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-600">Status</label>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                    status === s
                      ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {error ? (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </GlassCard>
      ) : loading ? (
        <div className="flex h-44 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
        </div>
      ) : findings.length === 0 ? (
        <GlassCard className="flex h-44 items-center justify-center text-sm text-gray-500 font-medium">
          No findings match the current filters
        </GlassCard>
      ) : (
        <GlassCard padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Affected URL</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">CVSS</th>
                  <th className="px-6 py-3.5">CWE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {findings.map((f) => (
                  <tr key={f.id} className="table-row-hover">
                    <td className="px-6 py-4"><SeverityBadge severity={f.severity} /></td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/scans/${scanId}/findings/${f.id}`}
                        className="font-semibold text-gray-200 hover:text-white transition-colors"
                      >
                        {f.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {f.affected_url ? (
                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                          {f.affected_url}
                          <ExternalLink className="h-3 w-3 text-gray-600" />
                        </span>
                      ) : (
                        <span className="text-xs text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={f.status} /></td>
                    <td className="px-6 py-4">
                      {f.cvss_score != null ? (
                        <span className={`text-xs font-bold tabular-nums ${
                          f.cvss_score >= 9 ? 'text-red-400' :
                          f.cvss_score >= 7 ? 'text-orange-400' :
                          f.cvss_score >= 4 ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {f.cvss_score}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {f.cwe_id ? (
                        <a
                          href={`https://cwe.mitre.org/data/definitions/${f.cwe_id.replace('CWE-', '')}.html`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors font-mono"
                        >
                          {f.cwe_id}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-700">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
