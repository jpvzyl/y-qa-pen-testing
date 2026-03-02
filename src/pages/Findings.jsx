import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getScanFindings } from '../lib/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'

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
    <div className="space-y-6">
      <Link to={`/scans/${scanId}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300">
        <ArrowLeft className="h-3 w-3" /> Back to Scan
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-gray-100">Findings</h2>
        <p className="text-sm text-gray-500">Vulnerabilities discovered during the scan</p>
      </div>

      {/* Severity filter chips */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Severity</label>
          <div className="flex flex-wrap gap-1">
            {SEVERITY_LEVELS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  severity === s
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  status === s
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">{error}</div>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
        </div>
      ) : findings.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-sm text-gray-600">
          No findings match the current filters
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Affected URL</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">CVSS</th>
                <th className="px-4 py-3 font-medium">CWE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3"><SeverityBadge severity={f.severity} /></td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/scans/${scanId}/findings/${f.id}`}
                      className="font-medium text-gray-200 hover:text-white"
                    >
                      {f.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {f.affected_url ? (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        {f.affected_url}
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-4 py-3 text-xs tabular-nums text-gray-400">{f.cvss_score ?? '—'}</td>
                  <td className="px-4 py-3">
                    {f.cwe_id ? (
                      <a
                        href={`https://cwe.mitre.org/data/definitions/${f.cwe_id.replace('CWE-', '')}.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {f.cwe_id}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
