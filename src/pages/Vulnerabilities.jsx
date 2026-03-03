import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Search, Filter, ExternalLink, ChevronDown, AlertTriangle, Bug, BookOpen } from 'lucide-react'
import { getScans, getScanFindings } from '../lib/api'
import { VULNERABILITY_CATEGORIES, OWASP_TOP_10 } from '../lib/constants'
import { getSeverityColor, getSeverityBg, mapFindingsToOWASP } from '../lib/utils'
import GlassCard from '../components/GlassCard'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import OWASPCoverage from '../components/OWASPCoverage'
import CVSSCalculator from '../components/CVSSCalculator'

export default function Vulnerabilities() {
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeView, setActiveView] = useState('list')
  const [showCVSS, setShowCVSS] = useState(false)

  useEffect(() => {
    loadAllFindings()
  }, [])

  async function loadAllFindings() {
    try {
      setLoading(true)
      const scansRes = await getScans({ per_page: 50 })
      const scanList = scansRes.data?.scans || scansRes.data || []
      const completedScans = scanList.filter((s) => s.status === 'completed').slice(0, 10)

      const allFindings = []
      for (const scan of completedScans) {
        try {
          const fRes = await getScanFindings(scan.id, { per_page: 100 })
          const items = (fRes.data?.findings || fRes.data || []).map((f) => ({
            ...f,
            scan_id: scan.id,
            scan_target: scan.target_url || scan.target,
          }))
          allFindings.push(...items)
        } catch {
          // continue
        }
      }
      setFindings(allFindings)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      if (severityFilter !== 'all' && f.severity?.toLowerCase() !== severityFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const searchable = `${f.title} ${f.description} ${f.cwe_id} ${f.affected_url} ${f.owasp_category}`.toLowerCase()
        if (!searchable.includes(q)) return false
      }
      return true
    })
  }, [findings, severityFilter, searchQuery])

  const owaspMapping = useMemo(() => mapFindingsToOWASP(findings), [findings])

  const severityStats = useMemo(() => {
    const stats = { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    for (const f of findings) {
      const sev = f.severity?.toLowerCase()
      if (stats[sev] !== undefined) stats[sev]++
    }
    return stats
  }, [findings])

  const views = [
    { id: 'list', label: 'All Findings' },
    { id: 'owasp', label: 'OWASP Mapping' },
    { id: 'categories', label: 'Categories' },
    { id: 'cvss', label: 'CVSS Calculator' },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
          <span className="text-sm text-gray-500">Aggregating vulnerability data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            Vulnerability <span className="gradient-text">Database</span>
          </h2>
          <p className="text-sm text-gray-500">Comprehensive vulnerability taxonomy and analysis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(severityStats).map(([sev, count]) => (
          <GlassCard key={sev} className="!p-3 text-center cursor-pointer" onClick={() => setSeverityFilter(severityFilter === sev ? 'all' : sev)}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: getSeverityColor(sev) }}>
              {count}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{sev}</div>
          </GlassCard>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-800">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeView === v.id
                ? 'border-red-500 text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search + Filter (for list view) */}
      {activeView === 'list' && (
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search vulnerabilities, CWEs, OWASP categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/30"
            />
          </div>
          <div className="flex gap-1">
            {['all', 'critical', 'high', 'medium', 'low', 'info'].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`rounded-md px-2.5 py-2 text-xs font-medium capitalize transition-colors ${
                  severityFilter === s
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm text-red-400">{error}</p>
        </GlassCard>
      )}

      {/* List View */}
      {activeView === 'list' && (
        <GlassCard padding={false} className="overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-600">
              {findings.length === 0 ? 'No vulnerabilities found across scans' : 'No results match your filters'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/50 text-left text-[11px] font-medium uppercase tracking-wider text-gray-600">
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Vulnerability</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">CVSS</th>
                    <th className="px-4 py-3">CWE</th>
                    <th className="px-4 py-3">OWASP</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {filtered.map((f) => (
                    <tr key={`${f.scan_id}-${f.id}`} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3"><SeverityBadge severity={f.severity} /></td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/scans/${f.scan_id}/findings/${f.id}`}
                          className="font-medium text-gray-200 hover:text-white"
                        >
                          {f.title}
                        </Link>
                        {f.affected_url && (
                          <p className="mt-0.5 text-[11px] text-gray-600 truncate max-w-[250px]">{f.affected_url}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{f.scan_target || '—'}</td>
                      <td className="px-4 py-3">
                        {f.cvss_score != null ? (
                          <span className="text-xs font-bold tabular-nums" style={{ color: getSeverityColor(f.severity) }}>
                            {f.cvss_score}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {f.cwe_id ? (
                          <a
                            href={`https://cwe.mitre.org/data/definitions/${f.cwe_id.replace('CWE-', '')}.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                          >
                            {f.cwe_id} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : <span className="text-xs text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {f.owasp_category ? (
                          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                            {f.owasp_category}
                          </span>
                        ) : <span className="text-xs text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* OWASP View */}
      {activeView === 'owasp' && (
        <div className="space-y-6">
          <OWASPCoverage findings={findings} />
          <div className="grid gap-4 lg:grid-cols-2">
            {OWASP_TOP_10.map((item) => {
              const itemFindings = owaspMapping[item.id] || []
              return (
                <GlassCard key={item.id}>
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500">{item.id}</span>
                      <h4 className="text-sm font-semibold text-gray-200">{item.name}</h4>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getSeverityBg(item.impact)}`}>
                      {item.impact}
                    </span>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-gray-500">{item.description}</p>
                  {item.testCases.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Test Cases</span>
                      <ul className="space-y-0.5">
                        {item.testCases.slice(0, 4).map((tc, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
                            {tc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {itemFindings.length > 0 && (
                    <div className="border-t border-gray-800 pt-2 mt-2">
                      <span className="text-[10px] font-semibold text-gray-600">{itemFindings.length} finding{itemFindings.length > 1 ? 's' : ''} detected</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {itemFindings.slice(0, 3).map((f) => (
                          <span key={f.id} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getSeverityBg(f.severity)}`}>
                            {f.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}

      {/* Categories View */}
      {activeView === 'categories' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VULNERABILITY_CATEGORIES.map((cat) => (
            <GlassCard key={cat.id}>
              <div className="mb-3 flex items-start justify-between">
                <h4 className="text-sm font-semibold text-gray-200">{cat.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getSeverityBg(cat.severity)}`}>
                  {cat.severity}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.types.map((type) => (
                  <span key={type} className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[10px] text-gray-400">
                    {type}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* CVSS Calculator View */}
      {activeView === 'cvss' && (
        <GlassCard>
          <CVSSCalculator />
        </GlassCard>
      )}
    </div>
  )
}
