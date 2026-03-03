import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield, ScanSearch, Globe, Settings, Menu, X, LogOut, User, Bug, FileCheck, Radar, LayoutDashboard, Presentation } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/auth'
import ProjectSelector from './ProjectSelector'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Pen Testing',
    items: [
      { to: '/scans', icon: ScanSearch, label: 'Scans' },
      { to: '/vulnerabilities', icon: Bug, label: 'Vulnerabilities' },
      { to: '/attack-surface', icon: Globe, label: 'Attack Surface' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/threat-intel', icon: Radar, label: 'Threat Intel' },
      { to: '/compliance', icon: FileCheck, label: 'Compliance' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
      { to: '/pitch', icon: Presentation, label: 'Pitch Deck' },
    ],
  },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-gray-800/50 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 glow-red">
          <Shield className="h-5 w-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold tracking-tight text-gray-100">Y-QA <span className="gradient-text">Pen Testing</span></h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-600">AI Security Platform</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Project selector */}
      <div className="border-b border-gray-800/50 py-3">
        <ProjectSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-red-500/10 text-red-400 shadow-sm'
                        : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-gray-800/50 px-4 py-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-200">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-[11px] text-gray-500">{user.email}</p>
            </div>
            {user.role && (
              <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                {user.role}
              </span>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-gray-800/50 lg:bg-gray-950">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-950 shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-800/50 px-4 lg:px-6 glass">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-gray-400">API Connected</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
