import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, duration = 1200, prefix = '', suffix = '', className = '' }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    const to = typeof value === 'number' ? value : 0
    prevRef.current = to

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = null

    function animate(timestamp) {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}
