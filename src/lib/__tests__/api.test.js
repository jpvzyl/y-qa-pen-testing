import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios', () => {
  const interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  }
  const client = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors,
  }
  return {
    default: {
      create: vi.fn(() => client),
    },
    __mockClient: client,
  }
})

describe('API module', () => {
  let api, mockClient

  beforeEach(async () => {
    vi.resetModules()
    const axiosMod = await import('axios')
    mockClient = axiosMod.__mockClient
    api = await import('../api')
  })

  describe('setAuthToken', () => {
    it('is a function', () => {
      expect(typeof api.setAuthToken).toBe('function')
    })
  })

  describe('setProjectId', () => {
    it('is a function', () => {
      expect(typeof api.setProjectId).toBe('function')
    })
  })

  describe('Auth endpoints', () => {
    it('authLogin posts to /auth/login', async () => {
      mockClient.post.mockResolvedValue({ data: { token: 'jwt', user: {} } })
      await api.authLogin('test@example.com', 'password')
      expect(mockClient.post).toHaveBeenCalledWith('/auth/login', {
        user: { email: 'test@example.com', password: 'password' },
      })
    })

    it('authRegister posts to /auth/register', async () => {
      const data = { first_name: 'John', last_name: 'Doe', email: 'j@d.com', password: 'pass' }
      mockClient.post.mockResolvedValue({ data: {} })
      await api.authRegister(data)
      expect(mockClient.post).toHaveBeenCalledWith('/auth/register', { user: data })
    })

    it('authLogout deletes /auth/logout', async () => {
      mockClient.delete.mockResolvedValue({ data: {} })
      await api.authLogout()
      expect(mockClient.delete).toHaveBeenCalledWith('/auth/logout')
    })

    it('authMe gets /auth/me', async () => {
      mockClient.get.mockResolvedValue({ data: { user: {} } })
      await api.authMe()
      expect(mockClient.get).toHaveBeenCalledWith('/auth/me')
    })

    it('authForgotPassword posts to /auth/forgot_password', async () => {
      mockClient.post.mockResolvedValue({ data: {} })
      await api.authForgotPassword('test@example.com')
      expect(mockClient.post).toHaveBeenCalledWith('/auth/forgot_password', {
        user: { email: 'test@example.com' },
      })
    })
  })

  describe('Projects', () => {
    it('getProjects gets /projects', async () => {
      mockClient.get.mockResolvedValue({ data: { projects: [] } })
      await api.getProjects()
      expect(mockClient.get).toHaveBeenCalledWith('/projects')
    })
  })

  describe('Scans', () => {
    it('getScans gets /scans with params', async () => {
      mockClient.get.mockResolvedValue({ data: { scans: [] } })
      await api.getScans({ page: 1, per_page: 10 })
      expect(mockClient.get).toHaveBeenCalledWith('/scans', { params: { page: 1, per_page: 10 } })
    })

    it('getScan gets /scans/:id', async () => {
      mockClient.get.mockResolvedValue({ data: { scan: {} } })
      await api.getScan(123)
      expect(mockClient.get).toHaveBeenCalledWith('/scans/123')
    })

    it('createScan posts to /scans', async () => {
      mockClient.post.mockResolvedValue({ data: { scan: { id: 1 } } })
      await api.createScan({ target_url: 'https://test.com' })
      expect(mockClient.post).toHaveBeenCalledWith('/scans', {
        scan: { target_url: 'https://test.com' },
      })
    })

    it('cancelScan patches /scans/:id/cancel', async () => {
      mockClient.patch.mockResolvedValue({ data: {} })
      await api.cancelScan(456)
      expect(mockClient.patch).toHaveBeenCalledWith('/scans/456/cancel')
    })
  })

  describe('Findings', () => {
    it('getScanFindings gets /scans/:scanId/findings', async () => {
      mockClient.get.mockResolvedValue({ data: { findings: [] } })
      await api.getScanFindings(1, { severity: 'critical' })
      expect(mockClient.get).toHaveBeenCalledWith('/scans/1/findings', { params: { severity: 'critical' } })
    })

    it('getFinding gets /scans/:scanId/findings/:findingId', async () => {
      mockClient.get.mockResolvedValue({ data: { finding: {} } })
      await api.getFinding(1, 42)
      expect(mockClient.get).toHaveBeenCalledWith('/scans/1/findings/42')
    })

    it('updateFinding patches finding', async () => {
      mockClient.patch.mockResolvedValue({ data: {} })
      await api.updateFinding(1, 42, { status: 'confirmed' })
      expect(mockClient.patch).toHaveBeenCalledWith('/scans/1/findings/42', {
        finding: { status: 'confirmed' },
      })
    })
  })

  describe('Reports', () => {
    it('getScanReports gets reports', async () => {
      mockClient.get.mockResolvedValue({ data: { reports: [] } })
      await api.getScanReports(1)
      expect(mockClient.get).toHaveBeenCalledWith('/scans/1/reports')
    })

    it('createReport posts report', async () => {
      mockClient.post.mockResolvedValue({ data: {} })
      await api.createReport(1, { report_type: 'executive_summary' })
      expect(mockClient.post).toHaveBeenCalledWith('/scans/1/reports', {
        report: { report_type: 'executive_summary' },
      })
    })
  })

  describe('Attack Surface', () => {
    it('getAttackSurface gets attack surfaces', async () => {
      mockClient.get.mockResolvedValue({ data: {} })
      await api.getAttackSurface(1)
      expect(mockClient.get).toHaveBeenCalledWith('/scans/1/attack_surfaces')
    })

    it('refreshAttackSurface posts refresh', async () => {
      mockClient.post.mockResolvedValue({ data: {} })
      await api.refreshAttackSurface(1)
      expect(mockClient.post).toHaveBeenCalledWith('/scans/1/attack_surfaces/refresh')
    })
  })

  describe('Connection test', () => {
    it('testConnection gets scans', async () => {
      mockClient.get.mockResolvedValue({ data: {} })
      await api.testConnection()
      expect(mockClient.get).toHaveBeenCalledWith('/scans')
    })
  })
})
