import { clsx } from 'clsx'

export default function GlassCard({ children, className, glow, hover = true, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'glass-card',
        padding && 'p-5',
        hover && 'hover:translate-y-[-1px]',
        glow === 'red' && 'glow-red',
        glow === 'blue' && 'glow-blue',
        glow === 'green' && 'glow-green',
        glow === 'purple' && 'glow-purple',
        glow === 'orange' && 'glow-orange',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
