import axios from 'axios'

let _authToken = null
let _projectId = null

export function setAuthToken(token) {
  _authToken = token
}

export function setProjectId(id) {
  _projectId = id
}

const client = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  if (_authToken) {
    config.headers['Authorization'] = `Bearer ${_authToken}`
  }

  if (_projectId && config.url && !config.url.includes('/projects/')) {
    config.url = `/projects/${_projectId}/pen_testing${config.url}`
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

// Auth
export const authLogin = (email, password) =>
  client.post('/auth/login', { user: { email, password } })
export const authRegister = (data) =>
  client.post('/auth/register', { user: data })
export const authLogout = () =>
  client.delete('/auth/logout')
export const authMe = () =>
  client.get('/auth/me')
export const authForgotPassword = (email) =>
  client.post('/auth/forgot_password', { user: { email } })
export const getProjects = () =>
  client.get('/projects')

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
