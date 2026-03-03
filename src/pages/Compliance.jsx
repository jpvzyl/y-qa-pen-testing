import { useEffect, useState, useMemo } from 'react'
import { Shield, CheckCircle2, XCircle, AlertTriangle, TrendingDown, FileCheck, Lock, BarChart3 } from 'lucide-react'
import { getScans, getScanFindings } from '../lib/api'
import { COMPLIANCE_FRAMEWORKS } from '../lib/constants'
import { getComplianceScore, isRequirementCompliant, getSeverityColor, calculateRiskScore } from '../lib/utils'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'

function ComplianceGauge({ score, framework }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'
  const label = score >= 80 ? 'PASS' : score >= 60 ? 'AT RISK' : 'FAIL'
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums" style={{ color }}>{score}%</span>
          <span className="text-[9px] font-bold tracking-wider" style={{ color }}>{label}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-gray-400">{framework.name}</span>
      <span className="text-[10px] text-gray-600 text-center max-w-[120px] leading-tight">{framework.fullName}</span>
    </div>
  )
}

export default function Compliance() {
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFramework, setSelectedFramework] = useState(COMPLIANCE_FRAMEWORKS[0].id)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const scansRes = await getScans({ per_page: 50 })
      const scanList = scansRes.data?.scans || scansRes.data || []
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

  const scores = useMemo(() => {
    return COMPLIANCE_FRAMEWORKS.map((fw) => ({
      ...fw,
      score: getComplianceScore(findings, fw),
    }))
  }, [findings])

  const overallScore = useMemo(() => {
    if (scores.length === 0) return 100
    return Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)
  }, [scores])

  const activeFramework = COMPLIANCE_FRAMEWORKS.find((f) => f.id === selectedFramework) || COMPLIANCE_FRAMEWORKS[0]
  const activeScore = scores.find((s) => s.id === selectedFramework)?.score ?? 100

  const criticalFindings = findings.filter((f) => f.severity === 'critical')
  const highFindings = findings.filter((f) => f.severity === 'high')

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-800 border-t-red-500" />
          <span className="text-sm text-gray-500">Calculating compliance scores...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">
          Compliance <span className="gradient-text-blue">Dashboard</span>
        </h2>
        <p className="text-sm text-gray-500">Security compliance assessment across industry frameworks</p>
      </div>

      {error && (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm text-red-400">{error}</p>
        </GlassCard>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <GlassCard glow="blue">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <BarChart3 className="h-3.5 w-3.5" /> Overall Score
          </div>
          <div className="mt-2">
            <AnimatedCounter
              value={overallScore}
              suffix="%"
              className="text-3xl font-bold"
              style={{ color: overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#eab308' : '#ef4444' }}
            />
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <FileCheck className="h-3.5 w-3.5" /> Frameworks
          </div>
          <AnimatedCounter value={COMPLIANCE_FRAMEWORKS.length} className="mt-2 text-3xl font-bold text-gray-100" />
        </GlassCard>
        <GlassCard glow="red">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <XCircle className="h-3.5 w-3.5" /> Critical Issues
          </div>
          <AnimatedCounter value={criticalFindings.length} className="mt-2 text-3xl font-bold text-red-400" />
        </GlassCard>
        <GlassCard glow="orange">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <AlertTriangle className="h-3.5 w-3.5" /> High Issues
          </div>
          <AnimatedCounter value={highFindings.length} className="mt-2 text-3xl font-bold text-orange-400" />
        </GlassCard>
      </div>

      {/* Framework gauges */}
      <GlassCard>
        <h3 className="mb-6 text-sm font-semibold text-gray-300">Framework Compliance Scores</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {scores.map((fw) => (
            <button key={fw.id} onClick={() => setSelectedFramework(fw.id)} className={`transition-opacity ${selectedFramework === fw.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}>
              <ComplianceGauge score={fw.score} framework={fw} />
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Selected framework details */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">{activeFramework.name} Requirements</h3>
            <p className="text-[11px] text-gray-500">{activeFramework.fullName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                color: activeScore >= 80 ? '#10b981' : activeScore >= 60 ? '#eab308' : '#ef4444',
                backgroundColor: activeScore >= 80 ? '#10b98115' : activeScore >= 60 ? '#eab30815' : '#ef444415',
              }}
            >
              {activeScore}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {activeFramework.requirements.map((req) => {
            const isCompliant = isRequirementCompliant(findings, req, activeFramework.id)
            return (
              <div
                key={req.id}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  isCompliant ? 'border-green-500/15 bg-green-500/5' : 'border-red-500/15 bg-red-500/5'
                }`}
              >
                {isCompliant
                  ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  : <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">{req.id}</span>
                    <span className="text-xs font-medium text-gray-300">{req.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-600">{req.category}</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold ${isCompliant ? 'text-green-500' : 'text-red-400'}`}>
                  {isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </span>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
