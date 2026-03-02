import axios from 'axios'

const client = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const projectId = localStorage.getItem('yqa_project_id')
  const apiKey = localStorage.getItem('yqa_api_key')

  if (apiKey) {
    config.headers['Authorization'] = `Bearer ${apiKey}`
  }

  if (projectId && config.url && !config.url.includes('/projects/')) {
    config.url = `/projects/${projectId}/pen_testing${config.url}`
  }

  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.response?.data?.message || err.message
    return Promise.reject(new Error(message))
  }
)

function prefix() {
  return ''
}

// Scans
export const getScans = (params) => client.get(`${prefix()}/scans`, { params })
export const getScan = (id) => client.get(`${prefix()}/scans/${id}`)
export const createScan = (data) => client.post(`${prefix()}/scans`, { scan: data })
export const cancelScan = (id) => client.patch(`${prefix()}/scans/${id}/cancel`)

// Findings
export const getScanFindings = (scanId, params) =>
  client.get(`${prefix()}/scans/${scanId}/findings`, { params })
export const getFinding = (scanId, findingId) =>
  client.get(`${prefix()}/scans/${scanId}/findings/${findingId}`)
export const updateFinding = (scanId, findingId, data) =>
  client.patch(`${prefix()}/scans/${scanId}/findings/${findingId}`, { finding: data })

// Reports
export const getScanReports = (scanId) =>
  client.get(`${prefix()}/scans/${scanId}/reports`)
export const createReport = (scanId, data) =>
  client.post(`${prefix()}/scans/${scanId}/reports`, { report: data })

// Attack Surface
export const getAttackSurface = (scanId) =>
  client.get(`${prefix()}/scans/${scanId}/attack_surfaces`)
export const refreshAttackSurface = (scanId) =>
  client.post(`${prefix()}/scans/${scanId}/attack_surfaces/refresh`)

// Connection test
export const testConnection = () => client.get(`${prefix()}/scans`)

export default client
