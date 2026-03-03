import { useEffect, useState, useMemo } from 'react'
import { Radar, Activity, Globe, Cpu, AlertTriangle, TrendingUp, Database, Zap, Eye, Lock } from 'lucide-react'
import { getScans, getScanFindings } from '../lib/api'
import { MITRE_TACTICS, KILL_CHAIN_PHASES, VULNERABILITY_CATEGORIES } from '../lib/constants'
import { getSeverityColor, calculateRiskScore, generateThreatRadarData } from '../lib/utils'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import KillChainDiagram from '../components/KillChainDiagram'
import ThreatRadar from '../components/ThreatRadar'

export default function ThreatIntel() {
  const [findings, setFindings] = useState([])
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const scansRes = await getScans({ per_page: 50 })
      const scanList = scansRes.data?.scans || scansRes.data || []
      setScans(scanList)

      const completed = scanList.filter((s) => s.status === 'completed').slice(0, 10)
      const allFindings = []
      for (const scan of completed) {
        try {
          const fRes = await getScanFindings(scan.id, { per_page: 100 })
          allFindings.push(...(fRes.data?.findings || fRes.data || []))
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

  const radarData = useMemo(() => generateThreatRadarData(findings), [findings])

  const severityBreakdown = useMemo(() => {
    const breakdown = { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    for (const f of findings) {
      const sev = f.severity?.toLowerCase()
      if (breakdown[sev] !== undefined) breakdown[sev]++
    }
    return breakdown
  }, [findings])

  const riskScore = calculateRiskScore(severityBreakdown)

  const topThreats = useMemo(() => {
    const threatMap = {}
    for (const f of findings) {
      const key = f.title || 'Unknown'
      if (!threatMap[key]) threatMap[key] = { title: key, count: 0, severity: f.severity, cwe: f.cwe_id }
      threatMap[key].count++
    }
    return Object.values(threatMap)
      .sort((a, b) => {
        const sevOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
        return (sevOrder[a.severity] || 4) - (sevOrder[b.severity] || 4) || b.count - a.count
      })
      .slice(0, 10)
  }, [findings])

  const attackPatterns = useMemo(() => {
    return VULNERABILITY_CATEGORIES.map((cat) => {
      const count = findings.filter((f) => {
        const t = (f.title || '').toLowerCase()
        return cat.types.some((type) => t.includes(type.toLowerCase()))
      }).length
      return { ...cat, count }
    }).sort((a, b) => b.count - a.count)
  }, [findings])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-800 border-t-purple-500" />
          <span className="text-sm text-gray-500">Analyzing threat intelligence...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">
          Threat <span className="gradient-text">Intelligence</span>
        </h2>
        <p className="text-sm text-gray-500">AI-driven threat analysis and attack pattern recognition</p>
      </div>

      {error && (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm text-red-400">{error}</p>
        </GlassCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard glow="red">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Threat Level</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: riskScore >= 60 ? '#ef4444' : riskScore >= 30 ? '#eab308' : '#10b981' }}>
            {riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'ELEVATED' : 'LOW'}
          </div>
        </GlassCard>
        <GlassCard glow="purple">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-purple-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Threats</span>
          </div>
          <AnimatedCounter value={findings.length} className="text-3xl font-bold text-gray-100" />
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Attack Vectors</span>
          </div>
          <AnimatedCounter value={attackPatterns.filter((p) => p.count > 0).length} className="text-3xl font-bold text-gray-100" />
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-orange-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Scans Analyzed</span>
          </div>
          <AnimatedCounter value={scans.filter((s) => s.status === 'completed').length} className="text-3xl font-bold text-gray-100" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Threat Radar */}
        <GlassCard>
          <div className="mb-2 flex items-center gap-2">
            <Radar className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-gray-300">Threat Radar</h3>
          </div>
          <ThreatRadar data={radarData} />
        </GlassCard>

        {/* Kill Chain */}
        <GlassCard>
          <KillChainDiagram
            activePhases={['reconnaissance', 'scanning', 'enumeration', 'exploitation', 'command_control']}
            findings={{
              reconnaissance: severityBreakdown.info,
              scanning: severityBreakdown.low,
              enumeration: severityBreakdown.medium,
              exploitation: severityBreakdown.critical + severityBreakdown.high,
              command_control: Math.floor(severityBreakdown.critical / 2),
            }}
          />
        </GlassCard>
      </div>

      {/* MITRE ATT&CK Tactics */}
      <GlassCard>
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-gray-300">MITRE ATT&CK Tactics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {MITRE_TACTICS.map((tactic) => {
            const isActive = findings.length > 0
            return (
              <div
                key={tactic.id}
                className="rounded-lg border px-3 py-2 text-xs transition-all"
                style={{
                  borderColor: isActive ? `${tactic.color}30` : '#1f2937',
                  backgroundColor: isActive ? `${tactic.color}10` : 'transparent',
                }}
              >
                <span className="text-[9px] font-bold tracking-wider text-gray-600">{tactic.id}</span>
                <p className="font-medium" style={{ color: isActive ? tactic.color : '#4b5563' }}>{tactic.name}</p>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Top Threats + Attack Patterns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-gray-300">Top Threats</h3>
          </div>
          {topThreats.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">No threats detected</p>
          ) : (
            <div className="space-y-2">
              {topThreats.map((threat, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg border border-gray-800/50 bg-gray-950/50 p-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ color: getSeverityColor(threat.severity), backgroundColor: `${getSeverityColor(threat.severity)}15` }}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-gray-300">{threat.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      {threat.cwe && <span>{threat.cwe}</span>}
                      <span>{threat.count}x detected</span>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{ color: getSeverityColor(threat.severity), backgroundColor: `${getSeverityColor(threat.severity)}15` }}
                  >
                    {threat.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-gray-300">Attack Pattern Analysis</h3>
          </div>
          <div className="space-y-2.5">
            {attackPatterns.map((pattern) => (
              <div key={pattern.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-400">{pattern.name}</span>
                  <span className="tabular-nums text-gray-500">{pattern.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${findings.length ? (pattern.count / findings.length) * 100 : 0}%`,
                      backgroundColor: getSeverityColor(pattern.severity),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
