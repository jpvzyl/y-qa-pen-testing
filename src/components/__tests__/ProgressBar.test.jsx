import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  function getInnerBar(container) {
    const outer = container.firstChild
    return outer.firstChild
  }

  it('renders with default props', () => {
    const { container } = render(<ProgressBar />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders correct percentage width', () => {
    const { container } = render(<ProgressBar value={50} max={100} />)
    const bar = getInnerBar(container)
    expect(bar.style.width).toBe('50%')
  })

  it('clamps to 0% for negative values', () => {
    const { container } = render(<ProgressBar value={-10} />)
    const bar = getInnerBar(container)
    expect(bar.style.width).toBe('0%')
  })

  it('clamps to 100% for values exceeding max', () => {
    const { container } = render(<ProgressBar value={200} max={100} />)
    const bar = getInnerBar(container)
    expect(bar.style.width).toBe('100%')
  })

  it('applies custom color to inner bar', () => {
    const { container } = render(<ProgressBar value={50} color="bg-red-500" />)
    const bar = getInnerBar(container)
    expect(bar.className).toContain('bg-red-500')
  })

  it('applies custom className to outer container', () => {
    const { container } = render(<ProgressBar className="my-custom-class" />)
    expect(container.firstChild.className).toContain('my-custom-class')
  })

  it('animates inner bar when between 0 and 100', () => {
    const { container } = render(<ProgressBar value={50} />)
    const bar = getInnerBar(container)
    expect(bar.className).toContain('animate-pulse')
  })

  it('does not animate inner bar at 100%', () => {
    const { container } = render(<ProgressBar value={100} />)
    const bar = getInnerBar(container)
    expect(bar.className).not.toContain('animate-pulse')
  })
})
