import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Plus, Download, Calendar, BarChart3 } from 'lucide-react'
import { getScanReports, createReport } from '../lib/api'
import StatusBadge from '../components/StatusBadge'

const REPORT_TYPES = [
  { value: 'executive_summary', label: 'Executive Summary' },
  { value: 'technical_report', label: 'Technical Report' },
  { value: 'remediation_plan', label: 'Remediation Plan' },
  { value: 'compliance_report', label: 'Compliance Report' },
]

export default function Reports() {
  const { id: scanId } = useParams()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState('executive_summary')
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    loadReports()
  }, [scanId])

  async function loadReports() {
    try {
      setLoading(true)
      const res = await getScanReports(scanId)
      setReports(res.data?.reports || res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    try {
      setGenerating(true)
      setError(null)
      await createReport(scanId, { report_type: selectedType })
      setShowGenerator(false)
      loadReports()
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link to={`/scans/${scanId}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300">
        <ArrowLeft className="h-3 w-3" /> Back to Scan
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Reports</h2>
          <p className="text-sm text-gray-500">Generated pen test reports</p>
        </div>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Report generator */}
      {showGenerator && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Generate New Report</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {REPORT_TYPES.map(({ value, label }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  selectedType === value
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="report_type"
                  value={value}
                  checked={selectedType === value}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="accent-red-500"
                />
                <span className="text-sm text-gray-200">{label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-16">
          <FileText className="mb-3 h-10 w-10 text-gray-700" />
          <p className="text-sm text-gray-500">No reports generated yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium capitalize text-gray-200">
                    {(report.report_type || report.type || '').replace(/_/g, ' ')}
                  </span>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}
                </span>
                {report.format && (
                  <span className="uppercase">{report.format}</span>
                )}
              </div>

              {/* Executive summary preview */}
              {report.executive_summary && (
                <div className="space-y-2 rounded-lg bg-gray-950 p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Executive Summary</h4>
                  <p className="text-xs leading-relaxed text-gray-400 line-clamp-4">
                    {typeof report.executive_summary === 'string'
                      ? report.executive_summary
                      : report.executive_summary?.overview || JSON.stringify(report.executive_summary)}
                  </p>
                </div>
              )}

              {report.download_url && (
                <a
                  href={report.download_url}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Download className="h-3 w-3" />
                  Download Report
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
