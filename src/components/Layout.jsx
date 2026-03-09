import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield, ScanSearch, Globe, Settings, Menu, X, LogOut, User, Bug, FileCheck, Radar, LayoutDashboard, Presentation, ChevronRight, Wrench, ClipboardCheck } from 'lucide-react'
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
      { to: '/remediation', icon: Wrench, label: 'Remediation' },
      { to: '/audit-actions', icon: ClipboardCheck, label: 'Audit Actions' },
      { to: '/settings', icon: Settings, label: 'Settings' },
      { to: '/pitch', icon: Presentation, label: 'Pitch Deck' },
    ],
  },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col bg-[#060a14]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/20 glow-red">
          <Shield className="h-5 w-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-extrabold tracking-tight text-white">Y-QA</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">Pen Testing</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Project selector */}
      <div className="py-3">
        <ProjectSelector />
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
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
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                        : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-40 -translate-x-1 group-hover:translate-x-0" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* User info + sign out */}
      <div className="px-4 py-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-gray-200">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-[11px] text-gray-600">{user.email}</p>
            </div>
            {user.role && (
              <span className="shrink-0 rounded-md bg-red-500/10 border border-red-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                {user.role}
              </span>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-red-500/5 hover:text-red-400"
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

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:border-r lg:border-white/[0.04]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 shadow-2xl shadow-black/50 animate-slide-up" style={{ animationDuration: '0.3s' }}>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/[0.04] px-5 lg:px-8 bg-[#030712]/80 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-200 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">Connected</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
