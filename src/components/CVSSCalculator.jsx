import { useState, useMemo } from 'react'
import { CVSS_V3_METRICS } from '../lib/constants'
import { calculateCVSS, getSeverityColor } from '../lib/utils'

export default function CVSSCalculator({ initialVector = null, onChange }) {
  const [metrics, setMetrics] = useState(() => {
    if (initialVector) return initialVector
    return {
      attackVector: 'N',
      attackComplexity: 'L',
      privilegesRequired: 'N',
      userInteraction: 'N',
      scope: 'U',
      confidentiality: 'H',
      integrity: 'H',
      availability: 'H',
    }
  })

  const result = useMemo(() => calculateCVSS(metrics), [metrics])

  function updateMetric(key, value) {
    const updated = { ...metrics, [key]: value }
    setMetrics(updated)
    onChange?.(calculateCVSS(updated))
  }

  const severityColor = getSeverityColor(result.severity)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">CVSS 3.1 Calculator</h3>
        <div className="flex items-center gap-3">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: severityColor }}
          >
            {result.score}
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: severityColor,
              backgroundColor: `${severityColor}20`,
            }}
          >
            {result.severity}
          </span>
        </div>
      </div>

      <div className="font-mono text-[11px] text-gray-500 break-all rounded-lg bg-gray-950 px-3 py-2 border border-gray-800">
        {result.vector}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(CVSS_V3_METRICS).map(([key, metric]) => (
          <div key={key}>
            <label className="mb-1.5 block text-[11px] font-medium text-gray-500">
              {metric.label}
            </label>
            <div className="flex flex-wrap gap-1">
              {metric.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateMetric(key, opt.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    metrics[key] === opt.value
                      ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-750 hover:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-800 bg-gray-950 p-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">Impact</span>
          <p className="text-lg font-bold tabular-nums text-gray-300">{result.impact}</p>
        </div>
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">Exploitability</span>
          <p className="text-lg font-bold tabular-nums text-gray-300">{result.exploitability}</p>
        </div>
      </div>
    </div>
  )
}
