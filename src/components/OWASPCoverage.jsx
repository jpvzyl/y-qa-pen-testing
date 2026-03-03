import { OWASP_TOP_10 } from '../lib/constants'
import { getSeverityColor } from '../lib/utils'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default function OWASPCoverage({ findings = [], compact = false }) {
  const findingsByOWASP = {}
  for (const f of findings) {
    const cat = f.owasp_category || guessCategory(f)
    if (cat) {
      if (!findingsByOWASP[cat]) findingsByOWASP[cat] = []
      findingsByOWASP[cat].push(f)
    }
  }

  function guessCategory(f) {
    const t = (f.title || '').toLowerCase()
    if (/inject|xss|cross.?site|ssti/i.test(t)) return 'A03:2021'
    if (/access.?control|idor|privilege|cors/i.test(t)) return 'A01:2021'
    if (/crypto|tls|ssl|cipher/i.test(t)) return 'A02:2021'
    if (/auth|brute|password|session/i.test(t)) return 'A07:2021'
    if (/misconfig|header|debug/i.test(t)) return 'A05:2021'
    if (/ssrf/i.test(t)) return 'A10:2021'
    if (/outdated|component|cve/i.test(t)) return 'A06:2021'
    return null
  }

  return (
    <div className="space-y-3">
      {!compact && <h3 className="text-sm font-semibold text-gray-300">OWASP Top 10 Coverage</h3>}
      <div className={compact ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {OWASP_TOP_10.map((item) => {
          const itemFindings = findingsByOWASP[item.id] || []
          const hasCritical = itemFindings.some((f) => f.severity === 'critical')
          const hasHigh = itemFindings.some((f) => f.severity === 'high')
          const count = itemFindings.length

          let statusIcon, statusColor
          if (count === 0) {
            statusIcon = <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            statusColor = 'border-green-500/20 bg-green-500/5'
          } else if (hasCritical) {
            statusIcon = <XCircle className="h-3.5 w-3.5 text-red-400" />
            statusColor = 'border-red-500/20 bg-red-500/5'
          } else if (hasHigh) {
            statusIcon = <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
            statusColor = 'border-orange-500/20 bg-orange-500/5'
          } else {
            statusIcon = <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
            statusColor = 'border-yellow-500/20 bg-yellow-500/5'
          }

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg border p-2.5 transition-colors ${statusColor}`}
            >
              {statusIcon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500">{item.id}</span>
                  <span className="truncate text-xs font-medium text-gray-300">{item.name}</span>
                </div>
              </div>
              {count > 0 && (
                <span className="shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-bold tabular-nums text-gray-400">
                  {count}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
