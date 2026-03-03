import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SeverityBadge from '../SeverityBadge'

describe('SeverityBadge', () => {
  it('renders severity text', () => {
    render(<SeverityBadge severity="critical" />)
    expect(screen.getByText('critical')).toBeInTheDocument()
  })

  it('renders with different severities', () => {
    const severities = ['critical', 'high', 'medium', 'low', 'info']
    severities.forEach((sev) => {
      const { unmount } = render(<SeverityBadge severity={sev} />)
      expect(screen.getByText(sev)).toBeInTheDocument()
      unmount()
    })
  })

  it('handles null severity gracefully', () => {
    const { container } = render(<SeverityBadge severity={null} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('supports size prop', () => {
    const { container: sm } = render(<SeverityBadge severity="high" size="sm" />)
    const { container: lg } = render(<SeverityBadge severity="high" size="lg" />)
    expect(sm.firstChild.className).not.toBe(lg.firstChild.className)
  })

  it('applies correct color classes for critical', () => {
    const { container } = render(<SeverityBadge severity="critical" />)
    const el = container.firstChild
    expect(el.className).toContain('red')
  })

  it('applies correct color classes for high', () => {
    const { container } = render(<SeverityBadge severity="high" />)
    expect(container.firstChild.className).toContain('orange')
  })

  it('applies correct color classes for medium', () => {
    const { container } = render(<SeverityBadge severity="medium" />)
    expect(container.firstChild.className).toContain('yellow')
  })
})
