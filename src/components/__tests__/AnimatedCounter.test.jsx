import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import AnimatedCounter from '../AnimatedCounter'

describe('AnimatedCounter', () => {
  it('renders with initial value', () => {
    render(<AnimatedCounter value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders with prefix', () => {
    render(<AnimatedCounter value={0} prefix="$" />)
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('renders with suffix', () => {
    render(<AnimatedCounter value={0} suffix="%" />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<AnimatedCounter value={42} className="custom-class" />)
    expect(container.firstChild.className).toContain('custom-class')
  })

  it('applies tabular-nums class for number alignment', () => {
    const { container } = render(<AnimatedCounter value={0} />)
    expect(container.firstChild.className).toContain('tabular-nums')
  })
})
