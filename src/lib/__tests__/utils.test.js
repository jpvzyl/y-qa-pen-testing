import { describe, it, expect } from 'vitest'
import {
  calculateCVSS,
  getSeverityFromScore,
  getSeverityColor,
  getSeverityBg,
  calculateRiskScore,
  formatRelativeTime,
  formatNumber,
  clamp,
  mapFindingsToOWASP,
  getComplianceScore,
  generateThreatRadarData,
  parseCVSSVector,
} from '../utils'

describe('calculateCVSS', () => {
  it('calculates maximum severity (10.0) for worst-case metrics', () => {
    const result = calculateCVSS({
      attackVector: 'N',
      attackComplexity: 'L',
      privilegesRequired: 'N',
      userInteraction: 'N',
      scope: 'C',
      confidentiality: 'H',
      integrity: 'H',
      availability: 'H',
    })
    expect(result.score).toBe(10.0)
    expect(result.severity).toBe('critical')
    expect(result.vector).toContain('CVSS:3.1')
  })

  it('calculates 0 when all impact metrics are None', () => {
    const result = calculateCVSS({
      attackVector: 'N',
      attackComplexity: 'L',
      privilegesRequired: 'N',
      userInteraction: 'N',
      scope: 'U',
      confidentiality: 'N',
      integrity: 'N',
      availability: 'N',
    })
    expect(result.score).toBe(0)
    expect(result.severity).toBe('none')
  })

  it('produces a medium score for moderate complexity attack', () => {
    const result = calculateCVSS({
      attackVector: 'N',
      attackComplexity: 'H',
      privilegesRequired: 'L',
      userInteraction: 'R',
      scope: 'U',
      confidentiality: 'L',
      integrity: 'L',
      availability: 'N',
    })
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThan(10)
    expect(['low', 'medium']).toContain(result.severity)
  })

  it('uses scope-changed PR values when scope is Changed', () => {
    const unchanged = calculateCVSS({
      attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L',
      userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H',
    })
    const changed = calculateCVSS({
      attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L',
      userInteraction: 'N', scope: 'C', confidentiality: 'H', integrity: 'H', availability: 'H',
    })
    expect(changed.score).not.toBe(unchanged.score)
  })

  it('returns valid vector string format', () => {
    const result = calculateCVSS({
      attackVector: 'A', attackComplexity: 'H', privilegesRequired: 'H',
      userInteraction: 'R', scope: 'U', confidentiality: 'L', integrity: 'N', availability: 'N',
    })
    expect(result.vector).toMatch(/^CVSS:3\.1\/AV:[NALP]\/AC:[LH]\/PR:[NLH]\/UI:[NR]\/S:[UC]\/C:[HLN]\/I:[HLN]\/A:[HLN]$/)
  })

  it('provides impact and exploitability sub-scores', () => {
    const result = calculateCVSS({
      attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'N',
      userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H',
    })
    expect(result.impact).toBeGreaterThan(0)
    expect(result.exploitability).toBeGreaterThan(0)
  })
})

describe('getSeverityFromScore', () => {
  it('returns none for 0', () => expect(getSeverityFromScore(0)).toBe('none'))
  it('returns low for 1.0', () => expect(getSeverityFromScore(1.0)).toBe('low'))
  it('returns low for 3.9', () => expect(getSeverityFromScore(3.9)).toBe('low'))
  it('returns medium for 4.0', () => expect(getSeverityFromScore(4.0)).toBe('medium'))
  it('returns medium for 6.9', () => expect(getSeverityFromScore(6.9)).toBe('medium'))
  it('returns high for 7.0', () => expect(getSeverityFromScore(7.0)).toBe('high'))
  it('returns high for 8.9', () => expect(getSeverityFromScore(8.9)).toBe('high'))
  it('returns critical for 9.0', () => expect(getSeverityFromScore(9.0)).toBe('critical'))
  it('returns critical for 10.0', () => expect(getSeverityFromScore(10.0)).toBe('critical'))
})

describe('getSeverityColor', () => {
  it('returns red for critical', () => expect(getSeverityColor('critical')).toBe('#ef4444'))
  it('returns orange for high', () => expect(getSeverityColor('high')).toBe('#f97316'))
  it('returns yellow for medium', () => expect(getSeverityColor('medium')).toBe('#eab308'))
  it('returns blue for low', () => expect(getSeverityColor('low')).toBe('#3b82f6'))
  it('returns gray for info', () => expect(getSeverityColor('info')).toBe('#6b7280'))
  it('handles uppercase', () => expect(getSeverityColor('CRITICAL')).toBe('#ef4444'))
  it('returns default for unknown', () => expect(getSeverityColor('unknown')).toBe('#6b7280'))
  it('handles null', () => expect(getSeverityColor(null)).toBe('#6b7280'))
})

describe('getSeverityBg', () => {
  it('returns correct classes for critical', () => {
    const bg = getSeverityBg('critical')
    expect(bg).toContain('bg-red')
    expect(bg).toContain('text-red')
  })
  it('handles null', () => {
    expect(getSeverityBg(null)).toContain('text-gray')
  })
})

describe('calculateRiskScore', () => {
  it('returns 0 for no findings', () => expect(calculateRiskScore({})).toBe(0))
  it('returns 0 for null', () => expect(calculateRiskScore(null)).toBe(0))

  it('calculates based on severity weights', () => {
    expect(calculateRiskScore({ critical: 1 })).toBe(15)
    expect(calculateRiskScore({ high: 1 })).toBe(8)
    expect(calculateRiskScore({ medium: 1 })).toBe(3)
    expect(calculateRiskScore({ low: 1 })).toBe(1)
  })

  it('caps at 100', () => {
    expect(calculateRiskScore({ critical: 10, high: 10, medium: 10 })).toBe(100)
  })

  it('calculates compound risk', () => {
    const score = calculateRiskScore({ critical: 2, high: 3, medium: 5, low: 10 })
    expect(score).toBe(Math.min(100, 2 * 15 + 3 * 8 + 5 * 3 + 10 * 1))
  })
})

describe('formatRelativeTime', () => {
  it('returns — for null', () => expect(formatRelativeTime(null)).toBe('—'))
  it('returns — for empty string', () => expect(formatRelativeTime('')).toBe('—'))
  it('returns "just now" for recent timestamps', () => {
    const now = new Date()
    expect(formatRelativeTime(now.toISOString())).toBe('just now')
  })
  it('formats minutes correctly', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(date.toISOString())).toBe('5m ago')
  })
  it('formats hours correctly', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(date.toISOString())).toBe('3h ago')
  })
  it('formats days correctly', () => {
    const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(date.toISOString())).toBe('7d ago')
  })
})

describe('formatNumber', () => {
  it('returns string for small numbers', () => expect(formatNumber(42)).toBe('42'))
  it('formats thousands', () => expect(formatNumber(1500)).toBe('1.5K'))
  it('formats millions', () => expect(formatNumber(2500000)).toBe('2.5M'))
})

describe('clamp', () => {
  it('returns value when in range', () => expect(clamp(5, 0, 10)).toBe(5))
  it('clamps to min', () => expect(clamp(-5, 0, 10)).toBe(0))
  it('clamps to max', () => expect(clamp(15, 0, 10)).toBe(10))
  it('handles equal min and max', () => expect(clamp(5, 5, 5)).toBe(5))
})

describe('mapFindingsToOWASP', () => {
  it('returns empty object for empty array', () => {
    expect(mapFindingsToOWASP([])).toEqual({})
  })

  it('maps findings with owasp_category', () => {
    const findings = [
      { title: 'Test', owasp_category: 'A01:2021' },
      { title: 'Test2', owasp_category: 'A01:2021' },
    ]
    const result = mapFindingsToOWASP(findings)
    expect(result['A01:2021']).toHaveLength(2)
  })

  it('guesses OWASP category from title for injection', () => {
    const findings = [{ title: 'SQL Injection in login form' }]
    const result = mapFindingsToOWASP(findings)
    expect(result['A03:2021']).toHaveLength(1)
  })

  it('guesses access control from title', () => {
    const findings = [{ title: 'IDOR - Access Control Bypass' }]
    const result = mapFindingsToOWASP(findings)
    expect(result['A01:2021']).toHaveLength(1)
  })

  it('guesses auth issues from title', () => {
    const findings = [{ title: 'Weak password policy allows brute force' }]
    const result = mapFindingsToOWASP(findings)
    expect(result['A07:2021']).toHaveLength(1)
  })

  it('guesses SSRF from title', () => {
    const findings = [{ title: 'SSRF via image upload endpoint' }]
    const result = mapFindingsToOWASP(findings)
    expect(result['A10:2021']).toHaveLength(1)
  })
})

describe('getComplianceScore', () => {
  it('returns 100 for no findings', () => {
    const framework = { requirements: [{ id: '1', name: 'Test' }] }
    expect(getComplianceScore([], framework)).toBe(100)
  })

  it('deducts for critical findings', () => {
    const framework = { id: 'test-fw', requirements: [{ id: '1', name: 'Test' }] }
    const findings = [{ severity: 'critical' }]
    const score = getComplianceScore(findings, framework)
    expect(score).toBeLessThan(100)
    expect(score).toBeGreaterThanOrEqual(12)
  })

  it('deducts for high findings', () => {
    const framework = { id: 'test-fw', requirements: [{ id: '1', name: 'Test' }] }
    const findings = [{ severity: 'high' }]
    const score = getComplianceScore(findings, framework)
    expect(score).toBeLessThan(100)
    expect(score).toBeGreaterThanOrEqual(12)
  })

  it('never goes below minimum', () => {
    const framework = { id: 'test-fw', requirements: [{ id: '1', name: 'Test' }] }
    const findings = Array(20).fill({ severity: 'critical' })
    const score = getComplianceScore(findings, framework)
    expect(score).toBeGreaterThanOrEqual(12)
  })
})

describe('generateThreatRadarData', () => {
  it('returns categories for empty array', () => {
    const result = generateThreatRadarData([])
    expect(result.length).toBeGreaterThan(0)
    result.forEach((item) => {
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('value')
      expect(item).toHaveProperty('fullMark')
    })
  })

  it('counts injection findings', () => {
    const findings = [
      { title: 'SQL Injection' },
      { title: 'Another SQLi vulnerability' },
    ]
    const result = generateThreatRadarData(findings)
    const injection = result.find((r) => r.name === 'Injection')
    expect(injection.value).toBe(2)
  })
})

describe('parseCVSSVector', () => {
  it('parses a valid CVSS 3.1 vector', () => {
    const result = parseCVSSVector('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H')
    expect(result).toEqual({
      attackVector: 'N',
      attackComplexity: 'L',
      privilegesRequired: 'N',
      userInteraction: 'N',
      scope: 'U',
      confidentiality: 'H',
      integrity: 'H',
      availability: 'H',
    })
  })

  it('returns null for invalid vector', () => {
    expect(parseCVSSVector(null)).toBeNull()
    expect(parseCVSSVector('')).toBeNull()
    expect(parseCVSSVector('not-a-vector')).toBeNull()
  })

  it('handles CVSS 3.0 prefix', () => {
    const result = parseCVSSVector('CVSS:3.0/AV:L/AC:H/PR:H/UI:R/S:C/C:L/I:N/A:N')
    expect(result).toBeTruthy()
    expect(result.attackVector).toBe('L')
    expect(result.scope).toBe('C')
  })
})
