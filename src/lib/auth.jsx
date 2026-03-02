import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authLogin, authRegister, authLogout, authMe, getProjects, setAuthToken, setProjectId } from './api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'yqa_jwt_token'
const PROJECT_KEY = 'yqa_selected_project'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistToken = useCallback((jwt) => {
    setToken(jwt)
    if (jwt) {
      localStorage.setItem(TOKEN_KEY, jwt)
      setAuthToken(jwt)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setAuthToken(null)
    }
  }, [])

  const persistProject = useCallback((project) => {
    setSelectedProject(project)
    if (project) {
      localStorage.setItem(PROJECT_KEY, JSON.stringify(project))
      setProjectId(project.id)
    } else {
      localStorage.removeItem(PROJECT_KEY)
      setProjectId(null)
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    try {
      const res = await getProjects()
      const list = res.data.projects || res.data || []
      setProjects(list)

      const saved = localStorage.getItem(PROJECT_KEY)
      let restoredProject = null
      if (saved) {
        try { restoredProject = JSON.parse(saved) } catch {}
      }

      if (restoredProject && list.find(p => p.id === restoredProject.id)) {
        persistProject(restoredProject)
      } else if (list.length > 0) {
        persistProject(list[0])
      }
    } catch {
      setProjects([])
    }
  }, [persistProject])

  useEffect(() => {
    async function validateSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        setLoading(false)
        return
      }

      setAuthToken(storedToken)
      try {
        const res = await authMe()
        setUser(res.data.user)
        setToken(storedToken)
        await fetchProjects()
      } catch {
        persistToken(null)
        persistProject(null)
        setUser(null)
      }
      setLoading(false)
    }

    validateSession()
  }, [persistToken, persistProject, fetchProjects])

  async function login(email, password) {
    const res = await authLogin(email, password)
    const jwt = res.data.token || res.headers?.authorization?.replace('Bearer ', '')
    persistToken(jwt)
    setUser(res.data.user)
    await fetchProjects()
  }

  async function register(data) {
    const res = await authRegister(data)
    const jwt = res.data.token || res.headers?.authorization?.replace('Bearer ', '')
    persistToken(jwt)
    setUser(res.data.user)
    await fetchProjects()
  }

  async function logout() {
    try {
      await authLogout()
    } catch {
      // even if the server rejects, clear local state
    }
    persistToken(null)
    persistProject(null)
    setUser(null)
    setProjects([])
  }

  function selectProject(project) {
    persistProject(project)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, projects, selectedProject, loading, login, register, logout, selectProject }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
