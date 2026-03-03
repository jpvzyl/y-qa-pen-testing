import {
  DEMO_USER,
  DEMO_TOKEN,
  DEMO_PROJECTS,
  DEMO_SCANS,
  DEMO_FINDINGS,
  DEMO_REPORTS,
  DEMO_ATTACK_SURFACES,
} from './mockData'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function paginate(items, params) {
  const page = parseInt(params?.page) || 1
  const perPage = parseInt(params?.per_page) || 25
  const start = (page - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    meta: { page, per_page: perPage, total: items.length, total_pages: Math.ceil(items.length / perPage) },
  }
}

function filterScans(params) {
  let scans = [...DEMO_SCANS]
  if (params?.status && params.status !== 'all') {
    scans = scans.filter((s) => s.status === params.status)
  }
  if (params?.scan_mode && params.scan_mode !== 'all') {
    scans = scans.filter((s) => s.scan_mode === params.scan_mode)
  }
  return scans
}

function filterFindings(scanId, params) {
  let findings = DEMO_FINDINGS[scanId] || []
  if (params?.severity && params.severity !== 'all') {
    findings = findings.filter((f) => f.severity === params.severity)
  }
  if (params?.status && params.status !== 'all') {
    findings = findings.filter((f) => f.status === params.status)
  }
  return findings
}

const routes = {
  'POST /auth/login': async (body) => {
    await delay(400)
    return { data: { token: DEMO_TOKEN, user: DEMO_USER } }
  },

  'POST /auth/register': async (body) => {
    await delay(500)
    const user = { ...DEMO_USER, ...body?.user, id: 99 }
    return { data: { token: DEMO_TOKEN, user } }
  },

  'DELETE /auth/logout': async () => {
    await delay(200)
    return { data: { message: 'Logged out' } }
  },

  'GET /auth/me': async () => {
    await delay(150)
    return { data: { user: DEMO_USER } }
  },

  'POST /auth/forgot_password': async () => {
    await delay(300)
    return { data: { message: 'Password reset email sent' } }
  },

  'GET /projects': async () => {
    await delay(200)
    return { data: { projects: DEMO_PROJECTS } }
  },

  'GET /scans': async (_, params) => {
    await delay(300)
    const filtered = filterScans(params)
    const { items, meta } = paginate(filtered, params)
    return { data: { scans: items, meta } }
  },

  'GET /scans/:id': async (_, __, pathParams) => {
    await delay(200)
    const scan = DEMO_SCANS.find((s) => s.id === pathParams.id)
    if (!scan) return { data: { error: 'Scan not found' }, status: 404 }
    return { data: { scan } }
  },

  'POST /scans': async (body) => {
    await delay(600)
    const newScan = {
      id: `scan-${String(DEMO_SCANS.length + 1).padStart(3, '0')}`,
      ...body?.scan,
      status: 'queued',
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      phases: [],
      finding_counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    }
    DEMO_SCANS.unshift(newScan)
    return { data: { scan: newScan } }
  },

  'PATCH /scans/:id/cancel': async (_, __, pathParams) => {
    await delay(300)
    const scan = DEMO_SCANS.find((s) => s.id === pathParams.id)
    if (scan) scan.status = 'cancelled'
    return { data: { scan } }
  },

  'GET /scans/:scanId/findings': async (_, params, pathParams) => {
    await delay(350)
    const findings = filterFindings(pathParams.scanId, params)
    const { items, meta } = paginate(findings, params)
    return { data: { findings: items, meta } }
  },

  'GET /scans/:scanId/findings/:findingId': async (_, __, pathParams) => {
    await delay(250)
    const findings = DEMO_FINDINGS[pathParams.scanId] || []
    const finding = findings.find((f) => f.id === pathParams.findingId)
    if (!finding) return { data: { error: 'Finding not found' }, status: 404 }
    return { data: { finding } }
  },

  'PATCH /scans/:scanId/findings/:findingId': async (body, _, pathParams) => {
    await delay(300)
    const findings = DEMO_FINDINGS[pathParams.scanId] || []
    const finding = findings.find((f) => f.id === pathParams.findingId)
    if (finding && body?.finding) Object.assign(finding, body.finding)
    return { data: { finding } }
  },

  'GET /scans/:scanId/reports': async (_, __, pathParams) => {
    await delay(250)
    const reports = DEMO_REPORTS[pathParams.scanId] || []
    return { data: { reports } }
  },

  'POST /scans/:scanId/reports': async (body, _, pathParams) => {
    await delay(800)
    const newReport = {
      id: `report-${Date.now()}`,
      report_type: body?.report?.report_type || 'executive_summary',
      status: 'generated',
      format: 'PDF',
      created_at: new Date().toISOString(),
      executive_summary: {
        overview: `Auto-generated ${(body?.report?.report_type || 'executive_summary').replace(/_/g, ' ')} for this penetration test. The assessment identified multiple vulnerabilities across the target application. Detailed findings and remediation steps are included in this report.`,
      },
    }
    if (!DEMO_REPORTS[pathParams.scanId]) DEMO_REPORTS[pathParams.scanId] = []
    DEMO_REPORTS[pathParams.scanId].push(newReport)
    return { data: { report: newReport } }
  },

  'GET /scans/:scanId/attack_surfaces': async (_, __, pathParams) => {
    await delay(300)
    const surface = DEMO_ATTACK_SURFACES[pathParams.scanId] || DEMO_ATTACK_SURFACES['scan-001']
    return { data: { attack_surface: surface } }
  },

  'POST /scans/:scanId/attack_surfaces/refresh': async () => {
    await delay(1000)
    return { data: { message: 'Attack surface refresh initiated' } }
  },
}

function matchRoute(method, url) {
  const cleanUrl = url.replace(/^\/projects\/[^/]+\/pen_testing/, '').replace(/\?.*$/, '')
  const queryString = url.includes('?') ? url.split('?')[1] : ''
  const params = Object.fromEntries(new URLSearchParams(queryString))

  for (const [pattern, handler] of Object.entries(routes)) {
    const [routeMethod, routePath] = pattern.split(' ')
    if (routeMethod !== method) continue

    const routeParts = routePath.split('/')
    const urlParts = cleanUrl.split('/')

    if (routeParts.length !== urlParts.length) continue

    const pathParams = {}
    let matched = true

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        pathParams[routeParts[i].slice(1)] = urlParts[i]
      } else if (routeParts[i] !== urlParts[i]) {
        matched = false
        break
      }
    }

    if (matched) return { handler, params, pathParams }
  }

  return null
}

export function installMockApi(axiosClient) {
  axiosClient.interceptors.request.use(async (config) => {
    const method = (config.method || 'get').toUpperCase()
    const url = config.url || ''

    const match = matchRoute(method, url)
    if (match) {
      const queryParams = { ...config.params, ...match.params }
      const result = await match.handler(config.data, queryParams, match.pathParams)

      const error = new Error('MOCK_INTERCEPT')
      error.__mockResponse = {
        data: result.data,
        status: result.status || 200,
        statusText: 'OK',
        headers: {},
        config,
      }
      throw error
    }

    return config
  })

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.message === 'MOCK_INTERCEPT' && error.__mockResponse) {
        return Promise.resolve(error.__mockResponse)
      }
      return Promise.reject(error)
    }
  )
}
