import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GlassCard from '../GlassCard'

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Test Content</GlassCard>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies glass-card base class', () => {
    const { container } = render(<GlassCard>Content</GlassCard>)
    expect(container.firstChild.className).toContain('glass-card')
  })

  it('applies padding by default', () => {
    const { container } = render(<GlassCard>Content</GlassCard>)
    expect(container.firstChild.className).toContain('p-5')
  })

  it('removes padding when padding=false', () => {
    const { container } = render(<GlassCard padding={false}>Content</GlassCard>)
    expect(container.firstChild.className).not.toContain('p-5')
  })

  it('applies glow classes', () => {
    const { container } = render(<GlassCard glow="red">Content</GlassCard>)
    expect(container.firstChild.className).toContain('glow-red')
  })

  it('applies blue glow', () => {
    const { container } = render(<GlassCard glow="blue">Content</GlassCard>)
    expect(container.firstChild.className).toContain('glow-blue')
  })

  it('applies custom className', () => {
    const { container } = render(<GlassCard className="my-class">Content</GlassCard>)
    expect(container.firstChild.className).toContain('my-class')
  })

  it('applies hover effect by default', () => {
    const { container } = render(<GlassCard>Content</GlassCard>)
    expect(container.firstChild.className).toContain('hover:translate-y')
  })

  it('disables hover when hover=false', () => {
    const { container } = render(<GlassCard hover={false}>Content</GlassCard>)
    expect(container.firstChild.className).not.toContain('hover:translate-y')
  })

  it('passes through additional props', () => {
    const { container } = render(<GlassCard data-testid="card">Content</GlassCard>)
    expect(container.querySelector('[data-testid="card"]')).toBeInTheDocument()
  })
})
