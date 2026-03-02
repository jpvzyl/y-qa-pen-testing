import { Settings as SettingsIcon, User, FolderOpen, Shield } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Settings() {
  const { user, selectedProject, projects } = useAuth()

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
        <p className="text-sm text-gray-500">Account and project information</p>
      </div>

      {/* User profile */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <User className="h-4 w-4" />
          Account
        </div>

        {user && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">First Name</p>
                <p className="mt-0.5 text-sm text-gray-200">{user.first_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Last Name</p>
                <p className="mt-0.5 text-sm text-gray-200">{user.last_name || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="mt-0.5 text-sm text-gray-200">{user.email}</p>
            </div>
            {user.role && (
              <div>
                <p className="text-xs font-medium text-gray-500">Role</p>
                <span className="mt-1 inline-block rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current project */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <FolderOpen className="h-4 w-4" />
          Active Project
        </div>

        {selectedProject ? (
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Project Name</p>
              <p className="mt-0.5 text-sm text-gray-200">{selectedProject.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Project ID</p>
              <p className="mt-0.5 font-mono text-sm text-gray-400">{selectedProject.id}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No project selected</p>
        )}
      </div>

      {/* API info */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Shield className="h-4 w-4" />
          API Connection
        </div>
        <div className="rounded-lg bg-gray-950 p-3 font-mono text-xs text-gray-400 space-y-1">
          <p>Base URL: <span className="text-gray-200">/api/v1</span></p>
          <p>Pen Testing: <span className="text-gray-200">/api/v1/projects/{selectedProject?.id || '{id}'}/pen_testing</span></p>
          <p>Auth: <span className="text-gray-200">JWT Bearer Token</span></p>
          <p>Projects: <span className="text-gray-200">{projects.length} available</span></p>
        </div>
      </div>
    </div>
  )
}
