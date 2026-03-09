const severityConfig = {
  critical: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25', dot: 'bg-red-500', glow: 'shadow-red-500/20' },
  high:     { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/25', dot: 'bg-orange-500', glow: 'shadow-orange-500/20' },
  medium:   { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/25', dot: 'bg-yellow-500', glow: 'shadow-yellow-500/20' },
  low:      { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/25', dot: 'bg-blue-500', glow: 'shadow-blue-500/20' },
  info:     { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/25', dot: 'bg-gray-500', glow: '' },
}

export default function SeverityBadge({ severity, size = 'sm' }) {
  const config = severityConfig[severity?.toLowerCase()] || severityConfig.info
  const padding = size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-[11px]'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${padding}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {severity}
    </span>
  )
}

export { severityConfig }
