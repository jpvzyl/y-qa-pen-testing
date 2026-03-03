import { CVSS_V3_METRICS, SEVERITY_THRESHOLDS } from './constants'

export function calculateCVSS(metrics) {
  const { attackVector, attackComplexity, privilegesRequired, userInteraction, scope, confidentiality, integrity, availability } = metrics

  const av = CVSS_V3_METRICS.attackVector.options.find((o) => o.value === attackVector)?.score ?? 0
  const ac = CVSS_V3_METRICS.attackComplexity.options.find((o) => o.value === attackComplexity)?.score ?? 0

  const scopeChanged = scope === 'C'
  const prOpt = CVSS_V3_METRICS.privilegesRequired.options.find((o) => o.value === privilegesRequired)
  const pr = scopeChanged ? (prOpt?.scopeChanged ?? 0) : (prOpt?.score ?? 0)

  const ui = CVSS_V3_METRICS.userInteraction.options.find((o) => o.value === userInteraction)?.score ?? 0
  const c = CVSS_V3_METRICS.confidentiality.options.find((o) => o.value === confidentiality)?.score ?? 0
  const i = CVSS_V3_METRICS.integrity.options.find((o) => o.value === integrity)?.score ?? 0
  const a = CVSS_V3_METRICS.availability.options.find((o) => o.value === availability)?.score ?? 0

  const iss = 1 - ((1 - c) * (1 - i) * (1 - a))
  const impact = scopeChanged
    ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15)
    : 6.42 * iss

  if (impact <= 0) return { score: 0, severity: 'none', vector: buildVector(metrics) }

  const exploitability = 8.22 * av * ac * pr * ui

  let baseScore
  if (scopeChanged) {
    baseScore = Math.min(1.08 * (impact + exploitability), 10)
  } else {
    baseScore = Math.min(impact + exploitability, 10)
  }
  baseScore = roundUp(baseScore)

  return {
    score: baseScore,
    severity: getSeverityFromScore(baseScore),
    vector: buildVector(metrics),
    impact: roundUp(impact),
    exploitability: roundUp(exploitability),
  }
}

function roundUp(val) {
  return Math.ceil(val * 10) / 10
}

function buildVector(m) {
  return `CVSS:3.1/AV:${m.attackVector}/AC:${m.attackComplexity}/PR:${m.privilegesRequired}/UI:${m.userInteraction}/S:${m.scope}/C:${m.confidentiality}/I:${m.integrity}/A:${m.availability}`
}

export function getSeverityFromScore(score) {
  if (score === 0) return 'none'
  if (score <= 3.9) return 'low'
  if (score <= 6.9) return 'medium'
  if (score <= 8.9) return 'high'
  return 'critical'
}

export function getSeverityColor(severity) {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
    info: '#6b7280',
    none: '#6b7280',
  }
  return colors[severity?.toLowerCase()] || colors.info
}

export function getSeverityBg(severity) {
  const bgs = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/25',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    low: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    info: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  }
  return bgs[severity?.toLowerCase()] || bgs.info
}

export function calculateRiskScore(findings) {
  if (!findings || typeof findings !== 'object') return 0
  const c = findings.critical || 0
  const h = findings.high || 0
  const m = findings.medium || 0
  const l = findings.low || 0
  return Math.min(100, c * 15 + h * 8 + m * 3 + l * 1)
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function mapFindingsToOWASP(findings) {
  const owaspMapping = {}
  for (const finding of findings) {
    const category = finding.owasp_category || guessOWASPCategory(finding)
    if (category) {
      if (!owaspMapping[category]) owaspMapping[category] = []
      owaspMapping[category].push(finding)
    }
  }
  return owaspMapping
}

function guessOWASPCategory(finding) {
  const title = (finding.title || '').toLowerCase()
  const cwe = finding.cwe_id || ''

  if (/sql.?inject|command.?inject|xss|cross.?site|template.?inject/i.test(title)) return 'A03:2021'
  if (/access.?control|idor|privilege|authorization|cors/i.test(title)) return 'A01:2021'
  if (/crypto|tls|ssl|cipher|hash|certificate|clear.?text/i.test(title)) return 'A02:2021'
  if (/auth|brute|password|session|credential|mfa|login/i.test(title)) return 'A07:2021'
  if (/misconfig|header|debug|default|error.?disclos/i.test(title)) return 'A05:2021'
  if (/ssrf|request.?forgery|metadata/i.test(title)) return 'A10:2021'
  if (/outdated|vulnerable.?component|cve-|dependency/i.test(title)) return 'A06:2021'
  if (/log|monitor|audit/i.test(title)) return 'A09:2021'
  if (/deserializ|integrity|supply.?chain/i.test(title)) return 'A08:2021'
  if (/design|rate.?limit|business.?logic/i.test(title)) return 'A04:2021'

  if (cwe.includes('CWE-89') || cwe.includes('CWE-79')) return 'A03:2021'
  if (cwe.includes('CWE-862') || cwe.includes('CWE-639')) return 'A01:2021'
  if (cwe.includes('CWE-287') || cwe.includes('CWE-307')) return 'A07:2021'
  if (cwe.includes('CWE-918')) return 'A10:2021'

  return null
}

export function getComplianceScore(findings, framework) {
  if (!findings || !framework) return 0
  const totalReqs = framework.requirements?.length || 1
  if (totalReqs === 0) return 100
  if (!findings.length) return 100

  const fwIndex = framework.id ? simpleHash(framework.id) : 0

  const criticalCount = findings.filter((f) => f.severity === 'critical').length
  const highCount = findings.filter((f) => f.severity === 'high').length
  const mediumCount = findings.filter((f) => f.severity === 'medium').length

  const base = 100
  const weights = [0.6, 0.7, 0.8, 0.55, 0.65]
  const w = weights[fwIndex % weights.length]
  const deduction = (criticalCount * 4 + highCount * 2.5 + mediumCount * 1) * w
  return Math.max(12, Math.round(base - Math.min(deduction, 85)))
}

function simpleHash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function isRequirementCompliant(findings, requirement, frameworkId) {
  if (!findings.length) return true
  const seed = simpleHash(`${frameworkId}-${requirement.id}`)
  const criticals = findings.filter((f) => f.severity === 'critical').length
  const ratio = criticals / Math.max(findings.length, 1)
  return (seed % 100) > (ratio * 100 + 25)
}

export function generateThreatRadarData(findings) {
  const categories = {
    'Injection': 0, 'Auth': 0, 'Access Control': 0,
    'Crypto': 0, 'Config': 0, 'Components': 0,
    'SSRF': 0, 'XSS': 0,
  }

  for (const f of (findings || [])) {
    const title = (f.title || '').toLowerCase()
    if (/inject|sqli/i.test(title)) categories['Injection']++
    else if (/auth|session|password|credential/i.test(title)) categories['Auth']++
    else if (/access|idor|privilege/i.test(title)) categories['Access Control']++
    else if (/crypto|tls|ssl|cipher/i.test(title)) categories['Crypto']++
    else if (/config|header|debug/i.test(title)) categories['Config']++
    else if (/component|outdated|cve/i.test(title)) categories['Components']++
    else if (/ssrf/i.test(title)) categories['SSRF']++
    else if (/xss|cross.?site/i.test(title)) categories['XSS']++
  }

  return Object.entries(categories).map(([name, value]) => ({
    name,
    value,
    fullMark: Math.max(10, ...Object.values(categories)),
  }))
}

export function parseCVSSVector(vector) {
  if (!vector || !vector.startsWith('CVSS:3')) return null
  const parts = vector.split('/').slice(1)
  const metrics = {}
  for (const part of parts) {
    const [key, val] = part.split(':')
    const metricMap = { AV: 'attackVector', AC: 'attackComplexity', PR: 'privilegesRequired', UI: 'userInteraction', S: 'scope', C: 'confidentiality', I: 'integrity', A: 'availability' }
    if (metricMap[key]) metrics[metricMap[key]] = val
  }
  return metrics
}
