const statusConfig = {
  pending:     { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/10' },
  queued:      { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/10' },
  running:     { dot: 'bg-emerald-400 animate-pulse', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  in_progress: { dot: 'bg-emerald-400 animate-pulse', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  completed:   { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10' },
  failed:      { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
  cancelled:   { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  open:        { dot: 'bg-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  confirmed:   { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
  resolved:    { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10' },
  false_positive: { dot: 'bg-gray-500', text: 'text-gray-500', bg: 'bg-gray-500/10' },
  accepted:    { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  draft:       { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/10' },
  generated:   { dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10' },
}

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase()?.replace(/\s+/g, '_')
  const config = statusConfig[normalized] || statusConfig.pending
  const label = status?.replace(/_/g, ' ')

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold capitalize ${config.text} ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  )
}
