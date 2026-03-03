import { useEffect, useRef } from 'react'

export default function ScanWaveform({ active = false, color = '#ef4444', height = 40, className = '' }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = height * 2
    }
    resize()

    function draw() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      if (!active) {
        ctx.beginPath()
        ctx.moveTo(0, h / 2)
        ctx.lineTo(w, h / 2)
        ctx.strokeStyle = '#1f2937'
        ctx.lineWidth = 2
        ctx.stroke()
        return
      }

      phaseRef.current += 0.04
      const bars = 50
      const barWidth = w / bars

      for (let i = 0; i < bars; i++) {
        const wave1 = Math.sin(phaseRef.current + i * 0.15) * 0.5
        const wave2 = Math.sin(phaseRef.current * 1.5 + i * 0.08) * 0.3
        const noise = (Math.random() - 0.5) * 0.1
        const amplitude = Math.abs(wave1 + wave2 + noise)
        const barHeight = amplitude * h * 0.8

        ctx.fillStyle = color + '60'
        ctx.fillRect(
          i * barWidth + 1,
          (h - barHeight) / 2,
          barWidth - 2,
          barHeight
        )

        ctx.fillStyle = color
        const peakH = barHeight * 0.3
        ctx.fillRect(
          i * barWidth + 1,
          (h - peakH) / 2,
          barWidth - 2,
          peakH
        )
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    if (active) frameRef.current = requestAnimationFrame(draw)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [active, color, height])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height }}
    />
  )
}
