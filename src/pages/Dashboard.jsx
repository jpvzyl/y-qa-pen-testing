import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ScanSearch, Bug, AlertTriangle, Plus, Activity, TrendingUp, Clock, Zap, Target } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getScans, getScanFindings } from '../lib/api'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import RiskGauge from '../components/RiskGauge'
import KillChainDiagram from '../components/KillChainDiagram'
import OWASPCoverage from '../components/OWASPCoverage'
import ThreatRadar from '../components/ThreatRadar'
import ScanWaveform from '../components/ScanWaveform'
import StatusBadge from '../components/StatusBadge'
import { calculateRiskScore, formatRelativeTime, generateThreatRadarData, getSeverityColor } from '../lib/utils'

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
}

export default function Dashboard() {
  const [scans, setScans] = useState([])
  const [allFindings, setAllFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const res = await getScans({ per_page: 50 })
      const scanList = res.data?.scans || res.data || []
      setScans(scanList)

      const completedScans = scanList.filter((s) => s.status === 'completed').slice(0, 5)
      const findingsArr = []
      for (const scan of completedScans) {
        try {
          const fRes = await getScanFindings(scan.id, { per_page: 100 })
          const items = fRes.data?.findings || fRes.data || []
          findingsArr.push(...items)
        } catch {
          // scan may not have findings
        }
      }
      setAllFindings(findingsArr)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const totalScans = scans.length
  const runningScans = scans.filter((s) => s.status === 'running' || s.status === 'in_progress')
  const completedScans = scans.filter((s) => s.status === 'completed')

  const severityCounts = scans.reduce(
    (acc, s) => {
      const c = s.finding_counts || s.findings_count || {}
      return {
        critical: acc.critical + (c.critical || 0),
        high: acc.high + (c.high || 0),
        medium: acc.medium + (c.medium || 0),
        low: acc.low + (c.low || 0),
        info: acc.info + (c.info || 0),
      }
    },
    { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
  )

  const totalFindings = Object.values(severityCounts).reduce((a, b) => a + b, 0)
  const riskScore = calculateRiskScore(severityCounts)

  const pieData = Object.entries(severityCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  const trendData = scans
    .filter((s) => s.created_at)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-12)
    .map((s) => {
      const c = s.finding_counts || s.findings_count || {}
      return {
        name: new Date(s.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        critical: c.critical || 0,
        high: c.high || 0,
        medium: c.medium || 0,
        total: (c.critical || 0) + (c.high || 0) + (c.medium || 0) + (c.low || 0),
      }
    })

  const radarData = generateThreatRadarData(allFindings)
  const activeKillChainPhases = ['reconnaissance', 'scanning', 'enumeration', 'exploitation']
  const isScanning = runningScans.length > 0

  const stats = [
    { label: 'Total Scans', value: totalScans, icon: ScanSearch, color: '#3b82f6', glow: 'blue' },
    { label: 'Vulnerabilities', value: totalFindings, icon: Bug, color: '#f97316', glow: 'orange' },
    { label: 'Critical Issues', value: severityCounts.critical, icon: AlertTriangle, color: '#ef4444', glow: 'red' },
    { label: 'Active Scans', value: runningScans.length, icon: Activity, color: '#10b981', glow: 'green' },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-red-500/20" />
          </div>
          <span className="text-sm text-gray-500">Loading security data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <GlassCard glow="red" className="text-center">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-400" />
        <p className="text-sm font-medium text-red-400">{error}</p>
        <p className="mt-1 text-xs text-gray-500">Verify API connectivity in Settings</p>
        <button onClick={loadData} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">
          Retry
        </button>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6 cyber-grid min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-100">
            Security <span className="gradient-text">Command Center</span>
          </h2>
          <p className="text-sm text-gray-500">Real-time penetration testing intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          {isScanning && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400">{runningScans.length} scan{runningScans.length > 1 ? 's' : ''} active</span>
            </div>
          )}
          <Link
            to="/scans/new"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:shadow-red-500/30"
          >
            <Plus className="h-4 w-4" />
            New Scan
          </Link>
        </div>
      </div>

      {/* Live scan waveform */}
      {isScanning && (
        <GlassCard className="!p-3 animate-slide-up" glow="green">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">LIVE SCAN ACTIVITY</span>
            <span className="ml-auto text-[10px] text-gray-500">
              {runningScans.map((s) => s.target_url || s.target).join(', ')}
            </span>
          </div>
          <ScanWaveform active={true} color="#10b981" height={32} />
        </GlassCard>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, glow }, idx) => (
          <GlassCard key={label} glow={glow} className={`animate-slide-up stagger-${idx + 1}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
              <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <div className="mt-3">
              <AnimatedCounter value={value} className="text-3xl font-bold text-gray-100" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main grid: Risk Gauge + Severity Pie + Threat Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center animate-slide-up stagger-1">
          <RiskGauge score={riskScore} size={180} />
          <div className="mt-3 w-full space-y-1.5">
            {['critical', 'high', 'medium', 'low'].map((sev) => (
              <div key={sev} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[sev] }} />
                <span className="w-14 capitalize text-gray-500">{sev}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${totalFindings ? (severityCounts[sev] / totalFindings) * 100 : 0}%`,
                      backgroundColor: SEVERITY_COLORS[sev],
                    }}
                  />
                </div>
                <span className="w-6 text-right tabular-nums text-gray-400">{severityCounts[sev]}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Severity Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#d1d5db' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
                  <span key={sev} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="capitalize">{sev}</span>
                    <span className="font-bold text-gray-400">{severityCounts[sev] || 0}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-600">
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-gray-700" />
                <p>No findings yet</p>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-3">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Threat Radar</h3>
          <ThreatRadar data={radarData} />
        </GlassCard>
      </div>

      {/* Vulnerability trend */}
      {trendData.length > 1 && (
        <GlassCard className="animate-slide-up">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-300">Vulnerability Trend</h3>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="url(#gradCritical)" strokeWidth={2} />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="url(#gradHigh)" strokeWidth={2} />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="transparent" strokeWidth={1} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Kill Chain + OWASP Coverage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard className="animate-slide-up stagger-1">
          <KillChainDiagram
            activePhases={activeKillChainPhases}
            findings={{
              reconnaissance: severityCounts.info,
              scanning: severityCounts.low,
              exploitation: severityCounts.critical + severityCounts.high,
            }}
          />
        </GlassCard>
        <GlassCard className="animate-slide-up stagger-2">
          <OWASPCoverage findings={allFindings} compact />
        </GlassCard>
      </div>

      {/* Recent scans */}
      <GlassCard padding={false} className="animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-gray-300">Recent Scans</h3>
          <Link to="/scans" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">View all</Link>
        </div>
        {scans.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-600">
            <div className="text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-gray-700" />
              <p>No scans yet. Launch your first pen test!</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50 text-left text-[11px] font-medium uppercase tracking-wider text-gray-600">
                  <th className="px-5 py-2.5">Target</th>
                  <th className="px-5 py-2.5">Mode</th>
                  <th className="px-5 py-2.5">Status</th>
                  <th className="px-5 py-2.5">Findings</th>
                  <th className="px-5 py-2.5">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {scans.slice(0, 8).map((scan) => {
                  const counts = scan.finding_counts || scan.findings_count || {}
                  return (
                    <tr key={scan.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <Link to={`/scans/${scan.id}`} className="font-medium text-gray-200 hover:text-white transition-colors">
                          {scan.target_url || scan.target || '—'}
                        </Link>
                        <p className="text-[11px] text-gray-600">{scan.target_type}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs capitalize text-gray-400">
                          {scan.scan_mode || scan.mode || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={scan.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-xs tabular-nums">
                          {counts.critical > 0 && <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-medium text-red-400">{counts.critical}C</span>}
                          {counts.high > 0 && <span className="rounded bg-orange-500/15 px-1.5 py-0.5 font-medium text-orange-400">{counts.high}H</span>}
                          {counts.medium > 0 && <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 font-medium text-yellow-400">{counts.medium}M</span>}
                          {!counts.critical && !counts.high && !counts.medium && <span className="text-gray-600">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(scan.started_at || scan.created_at)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
