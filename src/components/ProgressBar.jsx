export default function ProgressBar({ value = 0, max = 100, color = 'bg-emerald-500', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${color} ${pct > 0 && pct < 100 ? 'animate-pulse' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
