import { useMemo } from 'react'
import { clamp } from '../lib/utils'

export default function RiskGauge({ score = 0, size = 180, label = 'Risk Score' }) {
  const clamped = clamp(score, 0, 100)

  const { color, severity } = useMemo(() => {
    if (clamped >= 80) return { color: '#ef4444', severity: 'CRITICAL' }
    if (clamped >= 60) return { color: '#f97316', severity: 'HIGH' }
    if (clamped >= 40) return { color: '#eab308', severity: 'MEDIUM' }
    if (clamped >= 20) return { color: '#3b82f6', severity: 'LOW' }
    return { color: '#10b981', severity: 'SECURE' }
  }, [clamped])

  const radius = (size - 24) / 2
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (clamped / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size / 2 + 24 }}>
        <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`}>
          <defs>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={`M 12 ${cy} A ${radius} ${radius} 0 0 1 ${size - 12} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={`M 12 ${cy} A ${radius} ${radius} 0 0 1 ${size - 12} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gaugeGlow)"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-4xl font-extrabold tabular-nums" style={{ color, textShadow: `0 0 20px ${color}40` }}>{clamped}</span>
          <span className="text-[10px] font-extrabold tracking-[0.2em]" style={{ color }}>{severity}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-500">{label}</span>
    </div>
  )
}
