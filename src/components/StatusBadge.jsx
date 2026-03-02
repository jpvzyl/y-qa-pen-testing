const statusConfig = {
  pending:     { dot: 'bg-gray-400', text: 'text-gray-400' },
  queued:      { dot: 'bg-gray-400', text: 'text-gray-400' },
  running:     { dot: 'bg-emerald-400 animate-pulse', text: 'text-emerald-400' },
  in_progress: { dot: 'bg-emerald-400 animate-pulse', text: 'text-emerald-400' },
  completed:   { dot: 'bg-green-400', text: 'text-green-400' },
  failed:      { dot: 'bg-red-400', text: 'text-red-400' },
  cancelled:   { dot: 'bg-yellow-400', text: 'text-yellow-400' },
  open:        { dot: 'bg-orange-400', text: 'text-orange-400' },
  confirmed:   { dot: 'bg-red-400', text: 'text-red-400' },
  resolved:    { dot: 'bg-green-400', text: 'text-green-400' },
  false_positive: { dot: 'bg-gray-500', text: 'text-gray-500' },
  accepted:    { dot: 'bg-yellow-400', text: 'text-yellow-400' },
  draft:       { dot: 'bg-gray-400', text: 'text-gray-400' },
  generated:   { dot: 'bg-blue-400', text: 'text-blue-400' },
}

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase()?.replace(/\s+/g, '_')
  const config = statusConfig[normalized] || statusConfig.pending
  const label = status?.replace(/_/g, ' ')

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {label}
    </span>
  )
}
