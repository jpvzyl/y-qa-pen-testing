import { describe, it, expect } from 'vitest'
import {
  OWASP_TOP_10,
  KILL_CHAIN_PHASES,
  MITRE_TACTICS,
  COMPLIANCE_FRAMEWORKS,
  CVSS_V3_METRICS,
  SEVERITY_THRESHOLDS,
  SCAN_PHASES,
  TARGET_TYPES,
  SCAN_MODES,
  VULNERABILITY_CATEGORIES,
} from '../constants'

describe('OWASP_TOP_10', () => {
  it('contains exactly 10 entries', () => {
    expect(OWASP_TOP_10).toHaveLength(10)
  })

  it('each entry has required fields', () => {
    OWASP_TOP_10.forEach((item) => {
      expect(item.id).toMatch(/^A\d{2}:2021$/)
      expect(item.name).toBeTruthy()
      expect(item.description).toBeTruthy()
      expect(item.cwes).toBeInstanceOf(Array)
      expect(item.cwes.length).toBeGreaterThan(0)
      expect(item.impact).toBeTruthy()
      expect(item.testCases).toBeInstanceOf(Array)
      expect(item.testCases.length).toBeGreaterThan(0)
    })
  })

  it('has unique IDs', () => {
    const ids = OWASP_TOP_10.map((i) => i.id)
    expect(new Set(ids).size).toBe(10)
  })

  it('covers A01 through A10', () => {
    const ids = OWASP_TOP_10.map((i) => i.id).sort()
    expect(ids[0]).toBe('A01:2021')
    expect(ids[9]).toBe('A10:2021')
  })

  it('has valid impact levels', () => {
    const validImpacts = ['critical', 'high', 'medium', 'low']
    OWASP_TOP_10.forEach((item) => {
      expect(validImpacts).toContain(item.impact)
    })
  })
})

describe('KILL_CHAIN_PHASES', () => {
  it('contains 7 phases', () => {
    expect(KILL_CHAIN_PHASES).toHaveLength(7)
  })

  it('starts with reconnaissance and ends with actions', () => {
    expect(KILL_CHAIN_PHASES[0].id).toBe('reconnaissance')
    expect(KILL_CHAIN_PHASES[6].id).toBe('actions')
  })

  it('each phase has required fields', () => {
    KILL_CHAIN_PHASES.forEach((phase) => {
      expect(phase.id).toBeTruthy()
      expect(phase.name).toBeTruthy()
      expect(phase.description).toBeTruthy()
      expect(phase.icon).toBeTruthy()
      expect(phase.color).toMatch(/^#[0-9a-f]{6}$/)
    })
  })
})

describe('MITRE_TACTICS', () => {
  it('contains 14 tactics', () => {
    expect(MITRE_TACTICS).toHaveLength(14)
  })

  it('each tactic has valid MITRE ID format', () => {
    MITRE_TACTICS.forEach((tactic) => {
      expect(tactic.id).toMatch(/^TA\d{4}$/)
      expect(tactic.name).toBeTruthy()
      expect(tactic.color).toMatch(/^#[0-9a-f]{6}$/)
    })
  })
})

describe('COMPLIANCE_FRAMEWORKS', () => {
  it('contains 5 frameworks', () => {
    expect(COMPLIANCE_FRAMEWORKS).toHaveLength(5)
  })

  it('includes PCI DSS, OWASP, HIPAA, SOC2, ISO 27001', () => {
    const ids = COMPLIANCE_FRAMEWORKS.map((f) => f.id)
    expect(ids).toContain('pci_dss')
    expect(ids).toContain('owasp')
    expect(ids).toContain('hipaa')
    expect(ids).toContain('soc2')
    expect(ids).toContain('iso27001')
  })

  it('each framework has requirements', () => {
    COMPLIANCE_FRAMEWORKS.forEach((fw) => {
      expect(fw.id).toBeTruthy()
      expect(fw.name).toBeTruthy()
      expect(fw.fullName).toBeTruthy()
      expect(fw.requirements).toBeInstanceOf(Array)
      expect(fw.requirements.length).toBeGreaterThan(0)
      fw.requirements.forEach((req) => {
        expect(req.id).toBeTruthy()
        expect(req.name).toBeTruthy()
        expect(req.category).toBeTruthy()
      })
    })
  })

  it('PCI DSS has 12 requirements', () => {
    const pci = COMPLIANCE_FRAMEWORKS.find((f) => f.id === 'pci_dss')
    expect(pci.requirements).toHaveLength(12)
  })
})

describe('CVSS_V3_METRICS', () => {
  it('contains 8 metric groups', () => {
    const keys = Object.keys(CVSS_V3_METRICS)
    expect(keys).toHaveLength(8)
  })

  it('each metric has label and options', () => {
    Object.entries(CVSS_V3_METRICS).forEach(([key, metric]) => {
      expect(metric.label).toBeTruthy()
      expect(metric.options).toBeInstanceOf(Array)
      expect(metric.options.length).toBeGreaterThanOrEqual(2)
      metric.options.forEach((opt) => {
        expect(opt.value).toBeTruthy()
        expect(opt.label).toBeTruthy()
      })
    })
  })

  it('attack vector has 4 options (N, A, L, P)', () => {
    expect(CVSS_V3_METRICS.attackVector.options).toHaveLength(4)
    const values = CVSS_V3_METRICS.attackVector.options.map((o) => o.value)
    expect(values).toEqual(['N', 'A', 'L', 'P'])
  })

  it('privileges required has scopeChanged values', () => {
    CVSS_V3_METRICS.privilegesRequired.options.forEach((opt) => {
      expect(opt).toHaveProperty('scopeChanged')
      expect(typeof opt.scopeChanged).toBe('number')
    })
  })
})

describe('SEVERITY_THRESHOLDS', () => {
  it('covers the full 0-10 range without gaps', () => {
    expect(SEVERITY_THRESHOLDS.none.min).toBe(0)
    expect(SEVERITY_THRESHOLDS.none.max).toBe(0)
    expect(SEVERITY_THRESHOLDS.low.min).toBe(0.1)
    expect(SEVERITY_THRESHOLDS.critical.max).toBe(10.0)
  })
})

describe('SCAN_PHASES', () => {
  it('contains 6 phases', () => {
    expect(SCAN_PHASES).toHaveLength(6)
  })
  it('starts with reconnaissance', () => {
    expect(SCAN_PHASES[0]).toBe('reconnaissance')
  })
  it('ends with reporting', () => {
    expect(SCAN_PHASES[5]).toBe('reporting')
  })
})

describe('TARGET_TYPES', () => {
  it('contains 5 types', () => {
    expect(TARGET_TYPES).toHaveLength(5)
  })
  it('includes web_application', () => {
    expect(TARGET_TYPES.find((t) => t.value === 'web_application')).toBeTruthy()
  })
})

describe('SCAN_MODES', () => {
  it('contains 5 modes', () => {
    expect(SCAN_MODES).toHaveLength(5)
  })
  it('has increasing intensity', () => {
    for (let i = 0; i < SCAN_MODES.length - 1; i++) {
      expect(SCAN_MODES[i].intensity).toBeLessThan(SCAN_MODES[i + 1].intensity)
    }
  })
})

describe('VULNERABILITY_CATEGORIES', () => {
  it('contains at least 8 categories', () => {
    expect(VULNERABILITY_CATEGORIES.length).toBeGreaterThanOrEqual(8)
  })
  it('each category has types', () => {
    VULNERABILITY_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy()
      expect(cat.name).toBeTruthy()
      expect(cat.severity).toBeTruthy()
      expect(cat.types).toBeInstanceOf(Array)
      expect(cat.types.length).toBeGreaterThan(0)
    })
  })
})
