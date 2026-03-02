import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ScanSearch, Bug, AlertTriangle, Plus } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getScans } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import SeverityBadge from '../components/SeverityBadge'

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
}

export default function Dashboard() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const res = await getScans({ per_page: 20 })
      setScans(res.data?.scans || res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const totalScans = scans.length
  const allFindings = scans.reduce((acc, s) => {
    const counts = s.finding_counts || s.findings_count || {}
    return {
      critical: (acc.critical || 0) + (counts.critical || 0),
      high: (acc.high || 0) + (counts.high || 0),
      medium: (acc.medium || 0) + (counts.medium || 0),
      low: (acc.low || 0) + (counts.low || 0),
      info: (acc.info || 0) + (counts.info || 0),
    }
  }, { critical: 0, high: 0, medium: 0, low: 0, info: 0 })

  const totalFindings = Object.values(allFindings).reduce((a, b) => a + b, 0)
  const riskScore = Math.min(100, allFindings.critical * 10 + allFindings.high * 5 + allFindings.medium * 2 + allFindings.low * 1)

  const pieData = Object.entries(allFindings)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  const stats = [
    { label: 'Total Scans', value: totalScans, icon: ScanSearch, color: 'text-blue-400' },
    { label: 'Open Findings', value: totalFindings, icon: Bug, color: 'text-orange-400' },
    { label: 'Critical Issues', value: allFindings.critical, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Risk Score', value: riskScore, icon: Shield, color: riskScore > 60 ? 'text-red-400' : riskScore > 30 ? 'text-yellow-400' : 'text-green-400' },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <p className="mt-1 text-xs text-gray-500">Check your API settings in the Settings page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
          <p className="text-sm text-gray-500">Security overview across all pen tests</p>
        </div>
        <Link
          to="/scans/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          New Scan
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-gray-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Severity distribution */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Severity Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  itemStyle={{ color: '#d1d5db' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-600">
              No findings yet
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
              <span key={sev} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {sev}: {allFindings[sev] || 0}
              </span>
            ))}
          </div>
        </div>

        {/* Recent scans */}
        <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Recent Scans</h3>
            <Link to="/scans" className="text-xs text-gray-500 hover:text-gray-300">View all</Link>
          </div>
          {scans.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-600">
              No scans yet. Start your first pen test!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                    <th className="pb-2 font-medium">Target</th>
                    <th className="pb-2 font-medium">Mode</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {scans.slice(0, 8).map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-800/30">
                      <td className="py-2.5">
                        <Link to={`/scans/${scan.id}`} className="text-gray-200 hover:text-white">
                          {scan.target_url || scan.target || '—'}
                        </Link>
                      </td>
                      <td className="py-2.5 text-gray-400">{scan.scan_mode || scan.mode || '—'}</td>
                      <td className="py-2.5"><StatusBadge status={scan.status} /></td>
                      <td className="py-2.5 text-right tabular-nums text-gray-400">
                        {scan.finding_counts?.critical || scan.findings_count?.critical || 0}
                        <span className="text-red-400"> C</span>
                        {' / '}
                        {scan.finding_counts?.high || scan.findings_count?.high || 0}
                        <span className="text-orange-400"> H</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
