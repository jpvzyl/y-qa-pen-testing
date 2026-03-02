import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ShieldAlert, Code, BookOpen, Wrench, Camera } from 'lucide-react'
import { getFinding, updateFinding } from '../lib/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'

const STATUS_OPTIONS = ['open', 'confirmed', 'resolved', 'false_positive', 'accepted']
const TABS = [
  { key: 'description', label: 'Description', icon: BookOpen },
  { key: 'reproduction', label: 'Reproduction', icon: Code },
  { key: 'poc', label: 'Proof of Concept', icon: ShieldAlert },
  { key: 'remediation', label: 'Remediation', icon: Wrench },
  { key: 'evidence', label: 'Evidence', icon: Camera },
]

export default function FindingDetail() {
  const { id: scanId, findingId } = useParams()
  const [finding, setFinding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('description')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadFinding()
  }, [scanId, findingId])

  async function loadFinding() {
    try {
      setLoading(true)
      const res = await getFinding(scanId, findingId)
      setFinding(res.data?.finding || res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      setUpdating(true)
      await updateFinding(scanId, findingId, { status: newStatus })
      setFinding((prev) => ({ ...prev, status: newStatus }))
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
      </div>
    )
  }

  if (error || !finding) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-400">
        {error || 'Finding not found'}
      </div>
    )
  }

  const remediation = finding.remediation || finding.pen_test_remediation || {}

  return (
    <div className="space-y-6">
      <Link
        to={`/scans/${scanId}/findings`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Findings
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SeverityBadge severity={finding.severity} size="lg" />
            <h2 className="text-xl font-bold text-gray-100">{finding.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {finding.cvss_score != null && (
              <span>CVSS: <strong className="text-gray-300">{finding.cvss_score}</strong></span>
            )}
            {finding.cvss_vector && (
              <span className="font-mono text-[10px] text-gray-600">{finding.cvss_vector}</span>
            )}
            {finding.cwe_id && (
              <a
                href={`https://cwe.mitre.org/data/definitions/${finding.cwe_id.replace('CWE-', '')}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                {finding.cwe_id} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
            {finding.owasp_category && (
              <span>OWASP: <strong className="text-gray-400">{finding.owasp_category}</strong></span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <StatusBadge status={finding.status} />
          <select
            value={finding.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-300 outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-800">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'border-red-500 text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-300">{finding.description || 'No description available.'}</p>
            {finding.affected_url && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Affected URL</h4>
                <a href={finding.affected_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                  {finding.affected_url} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {finding.affected_parameter && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Affected Parameter</h4>
                <code className="text-sm text-orange-400">{finding.affected_parameter}</code>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reproduction' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-300">Steps to Reproduce</h4>
            {finding.reproduction_steps ? (
              <div className="rounded-lg bg-gray-800 p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-300">{finding.reproduction_steps}</pre>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No reproduction steps available.</p>
            )}
          </div>
        )}

        {activeTab === 'poc' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-300">Proof of Concept</h4>
            {finding.proof_of_concept || finding.poc ? (
              <div className="rounded-lg bg-gray-950 p-4 font-mono">
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-green-400">
                  {finding.proof_of_concept || finding.poc}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No proof of concept available.</p>
            )}
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="space-y-4">
            {remediation.priority && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Priority:</span>
                <SeverityBadge severity={remediation.priority} />
              </div>
            )}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-300">Recommendation</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                {remediation.description || finding.remediation_guidance || finding.remediation_text || 'No remediation guidance available.'}
              </p>
            </div>
            {(remediation.fix_code || finding.fix_code) && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-300">Fix Code</h4>
                <div className="rounded-lg bg-gray-950 p-4 font-mono">
                  <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-emerald-400">
                    {remediation.fix_code || finding.fix_code}
                  </pre>
                </div>
              </div>
            )}
            {(remediation.references || finding.references) && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-300">References</h4>
                <ul className="space-y-1">
                  {(remediation.references || finding.references || []).map((ref, i) => (
                    <li key={i}>
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                        {ref} <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-300">Evidence</h4>
            {finding.evidences?.length > 0 || finding.pen_test_evidences?.length > 0 ? (
              <div className="space-y-3">
                {(finding.evidences || finding.pen_test_evidences || []).map((ev, i) => (
                  <div key={i} className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">{ev.evidence_type || ev.type || 'Evidence'}</span>
                      <span className="text-[10px] text-gray-600">{ev.captured_at ? new Date(ev.captured_at).toLocaleString() : ''}</span>
                    </div>
                    {ev.content && (
                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-400">{ev.content}</pre>
                    )}
                    {ev.screenshot_url && (
                      <img src={ev.screenshot_url} alt="Evidence" className="mt-2 max-w-full rounded border border-gray-800" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No evidence collected.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
