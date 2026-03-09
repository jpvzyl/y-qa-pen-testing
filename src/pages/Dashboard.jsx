import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ScanSearch, Bug, AlertTriangle, Plus, Activity, TrendingUp, Clock, Zap, Target, ArrowUpRight } from 'lucide-react'
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
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
            <div className="absolute inset-0 h-14 w-14 animate-ping rounded-full border border-red-500/20" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-300">Initialising Security Dashboard</p>
            <p className="text-xs text-gray-600 mt-1">Loading threat intelligence...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <GlassCard glow="red" className="text-center max-w-md mx-auto mt-20">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <p className="text-base font-semibold text-red-400">{error}</p>
        <p className="mt-2 text-sm text-gray-500">Verify API connectivity in Settings</p>
        <button onClick={loadData} className="mt-5 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors">
          Retry
        </button>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-8 min-h-full">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#060a14] p-8 hero-gradient">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative flex items-start justify-between gap-6">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Security <span className="gradient-text">Command Center</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-lg">Real-time penetration testing intelligence and threat analysis for the Y-QA Platform.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isScanning && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-emerald-400">{runningScans.length} scan{runningScans.length > 1 ? 's' : ''} active</span>
              </div>
            )}
            <Link
              to="/scans/new"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:shadow-red-500/30"
            >
              <Plus className="h-4 w-4" />
              New Scan
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live scan waveform */}
      {isScanning && (
        <GlassCard className="!p-4 animate-slide-up" glow="green">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Live Scan Activity</span>
            <span className="ml-auto text-[10px] text-gray-600 font-mono">
              {runningScans.map((s) => s.target_url || s.target).join(' | ')}
            </span>
          </div>
          <ScanWaveform active={true} color="#10b981" height={32} />
        </GlassCard>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, glow }, idx) => (
          <GlassCard key={label} glow={glow} className={`stat-card animate-slide-up stagger-${idx + 1}`} style={{ '--accent': `${color}40` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">{label}</span>
              <div className="rounded-xl p-2.5" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}15` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <AnimatedCounter value={value} className="text-4xl font-extrabold text-white" />
          </GlassCard>
        ))}
      </div>

      {/* Main grid: Risk Gauge + Severity Pie + Threat Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center animate-slide-up stagger-1">
          <RiskGauge score={riskScore} size={200} />
          <div className="mt-5 w-full space-y-2">
            {['critical', 'high', 'medium', 'low'].map((sev) => (
              <div key={sev} className="flex items-center gap-2.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: SEVERITY_COLORS[sev] }} />
                <span className="w-16 capitalize font-medium text-gray-500">{sev}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${totalFindings ? (severityCounts[sev] / totalFindings) * 100 : 0}%`,
                      backgroundColor: SEVERITY_COLORS[sev],
                      boxShadow: `0 0 8px ${SEVERITY_COLORS[sev]}40`,
                    }}
                  />
                </div>
                <span className="w-7 text-right tabular-nums font-bold text-gray-400">{severityCounts[sev]}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-2">
          <h3 className="mb-5 text-sm font-bold text-gray-300">Severity Distribution</h3>
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
                    contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                    itemStyle={{ color: '#d1d5db' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-3">
                {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
                  <span key={sev} className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="capitalize">{sev}</span>
                    <span className="font-bold text-gray-400">{severityCounts[sev] || 0}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-600">
              <div className="text-center">
                <Shield className="mx-auto mb-3 h-10 w-10 text-gray-800" />
                <p className="font-medium">No findings yet</p>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-3">
          <h3 className="mb-5 text-sm font-bold text-gray-300">Threat Radar</h3>
          <ThreatRadar data={radarData} />
        </GlassCard>
      </div>

      {/* Vulnerability trend */}
      {trendData.length > 1 && (
        <GlassCard className="animate-slide-up">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-bold text-gray-300">Vulnerability Trend</h3>
            </div>
            <div className="flex items-center gap-5 text-[10px] font-medium">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-orange-500" /> High</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-yellow-500" /> Medium</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
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
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-sm font-bold text-gray-300">Recent Scans</h3>
          <Link to="/scans" className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {scans.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-sm text-gray-600">
            <div className="text-center">
              <Target className="mx-auto mb-3 h-10 w-10 text-gray-800" />
              <p className="font-medium text-gray-500">No scans yet</p>
              <p className="text-xs text-gray-600 mt-1">Launch your first pen test to get started</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Findings</th>
                  <th className="px-6 py-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {scans.slice(0, 8).map((scan) => {
                  const counts = scan.finding_counts || scan.findings_count || {}
                  return (
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs tabular-nums">
                          {counts.critical > 0 && <span className="rounded-md bg-red-500/10 border border-red-500/15 px-2 py-0.5 font-bold text-red-400">{counts.critical}C</span>}
                          {counts.high > 0 && <span className="rounded-md bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 font-bold text-orange-400">{counts.high}H</span>}
                          {counts.medium > 0 && <span className="rounded-md bg-yellow-500/10 border border-yellow-500/15 px-2 py-0.5 font-bold text-yellow-400">{counts.medium}M</span>}
                          {!counts.critical && !counts.high && !counts.medium && <span className="text-gray-700">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="font-medium">{formatRelativeTime(scan.started_at || scan.created_at)}</span>
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
