import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RiskGauge from '../RiskGauge'

describe('RiskGauge', () => {
  it('renders with default props', () => {
    render(<RiskGauge />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Risk Score')).toBeInTheDocument()
  })

  it('displays the score value', () => {
    render(<RiskGauge score={75} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('clamps score to 0-100 range', () => {
    render(<RiskGauge score={150} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('clamps negative score to 0', () => {
    render(<RiskGauge score={-10} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('displays SECURE for low scores', () => {
    render(<RiskGauge score={10} />)
    expect(screen.getByText('SECURE')).toBeInTheDocument()
  })

  it('displays LOW for scores 20-39', () => {
    render(<RiskGauge score={25} />)
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('displays MEDIUM for scores 40-59', () => {
    render(<RiskGauge score={50} />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('displays HIGH for scores 60-79', () => {
    render(<RiskGauge score={70} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('displays CRITICAL for scores 80+', () => {
    render(<RiskGauge score={90} />)
    expect(screen.getByText('CRITICAL')).toBeInTheDocument()
  })

  it('renders SVG element', () => {
    const { container } = render(<RiskGauge score={50} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('supports custom label', () => {
    render(<RiskGauge score={50} label="Custom Label" />)
    expect(screen.getByText('Custom Label')).toBeInTheDocument()
  })
})
