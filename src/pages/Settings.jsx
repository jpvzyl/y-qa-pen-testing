import { useState } from 'react'
import { Settings as SettingsIcon, User, FolderOpen, Shield, CheckCircle2, XCircle, Wifi, ExternalLink } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { testConnection } from '../lib/api'
import GlassCard from '../components/GlassCard'

export default function Settings() {
  const { user, selectedProject, projects } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [testing, setTesting] = useState(false)

  async function handleTestConnection() {
    try {
      setTesting(true)
      setConnectionStatus(null)
      await testConnection()
      setConnectionStatus('success')
    } catch (e) {
      setConnectionStatus('error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
        <p className="text-sm text-gray-500">Account, project, and API configuration</p>
      </div>

      {/* User profile */}
      <GlassCard>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-300">
          <User className="h-4 w-4" />
          Account
        </div>
        {user && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">First Name</p>
                <p className="mt-1 text-sm text-gray-200">{user.first_name || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">Last Name</p>
                <p className="mt-1 text-sm text-gray-200">{user.last_name || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">Email</p>
              <p className="mt-1 text-sm text-gray-200">{user.email}</p>
            </div>
            {user.role && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">Role</p>
                <span className="mt-1 inline-block rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Current project */}
      <GlassCard>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-300">
          <FolderOpen className="h-4 w-4" />
          Active Project
        </div>
        {selectedProject ? (
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">Project Name</p>
              <p className="mt-1 text-sm text-gray-200">{selectedProject.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">Project ID</p>
              <p className="mt-1 font-mono text-sm text-gray-400">{selectedProject.id}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No project selected</p>
        )}
      </GlassCard>

      {/* API info */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <Shield className="h-4 w-4" />
            API Connection
          </div>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-gray-800 disabled:opacity-50"
          >
            <Wifi className="h-3 w-3" />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {connectionStatus && (
          <div className={`mb-4 flex items-center gap-2 rounded-lg border p-3 ${
            connectionStatus === 'success'
              ? 'border-green-500/20 bg-green-500/10'
              : 'border-red-500/20 bg-red-500/10'
          }`}>
            {connectionStatus === 'success'
              ? <CheckCircle2 className="h-4 w-4 text-green-400" />
              : <XCircle className="h-4 w-4 text-red-400" />
            }
            <span className={`text-xs font-medium ${connectionStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {connectionStatus === 'success' ? 'Connection successful' : 'Connection failed'}
            </span>
          </div>
        )}

        <div className="rounded-lg bg-gray-950 p-4 font-mono text-xs text-gray-400 space-y-1.5 border border-gray-800">
          <p>Base URL: <span className="text-gray-200">/api/v1</span></p>
          <p>Pen Testing: <span className="text-gray-200">/api/v1/projects/{selectedProject?.id || '{id}'}/pen_testing</span></p>
          <p>Auth: <span className="text-gray-200">JWT Bearer Token</span></p>
          <p>Projects: <span className="text-gray-200">{projects.length} available</span></p>
        </div>
      </GlassCard>
    </div>
  )
}
