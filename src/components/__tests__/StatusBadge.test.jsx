import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="running" />)
    expect(screen.getByText('running')).toBeInTheDocument()
  })

  it('normalizes underscore to space in display', () => {
    render(<StatusBadge status="in_progress" />)
    expect(screen.getByText('in progress')).toBeInTheDocument()
  })

  it('handles null status', () => {
    const { container } = render(<StatusBadge status={null} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders various statuses correctly', () => {
    const statuses = ['pending', 'queued', 'running', 'completed', 'failed', 'cancelled']
    statuses.forEach((status) => {
      const { unmount } = render(<StatusBadge status={status} />)
      expect(screen.getByText(status.replace(/_/g, ' '))).toBeInTheDocument()
      unmount()
    })
  })

  it('shows dot indicator', () => {
    const { container } = render(<StatusBadge status="running" />)
    const dot = container.querySelector('span span')
    expect(dot).toBeInTheDocument()
    expect(dot.className).toContain('rounded-full')
  })

  it('applies pulse animation for running status', () => {
    const { container } = render(<StatusBadge status="running" />)
    const dot = container.querySelector('span span')
    expect(dot.className).toContain('animate-pulse')
  })
})
