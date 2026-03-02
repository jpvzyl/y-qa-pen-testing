const severityConfig = {
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-500' },
  high:     { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-500' },
  medium:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-500' },
  low:      { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  info:     { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', dot: 'bg-gray-500' },
}

export default function SeverityBadge({ severity, size = 'sm' }) {
  const config = severityConfig[severity?.toLowerCase()] || severityConfig.info
  const padding = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide ${config.bg} ${config.text} ${config.border} ${padding}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {severity}
    </span>
  )
}

export { severityConfig }
