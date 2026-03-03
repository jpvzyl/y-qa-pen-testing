import { useMemo } from 'react'
import { clamp } from '../lib/utils'

export default function RiskGauge({ score = 0, size = 160, label = 'Risk Score' }) {
  const clamped = clamp(score, 0, 100)

  const { color, bg, severity } = useMemo(() => {
    if (clamped >= 80) return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', severity: 'CRITICAL' }
    if (clamped >= 60) return { color: '#f97316', bg: 'rgba(249,115,22,0.15)', severity: 'HIGH' }
    if (clamped >= 40) return { color: '#eab308', bg: 'rgba(234,179,8,0.15)', severity: 'MEDIUM' }
    if (clamped >= 20) return { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', severity: 'LOW' }
    return { color: '#10b981', bg: 'rgba(16,185,129,0.15)', severity: 'SECURE' }
  }, [clamped])

  const radius = (size - 20) / 2
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (clamped / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          <path
            d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-bold tabular-nums" style={{ color }}>{clamped}</span>
          <span className="text-[10px] font-bold tracking-widest" style={{ color }}>{severity}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  )
}
