import { NavLink, Outlet } from 'react-router-dom'
import { Shield, ScanSearch, Globe, Settings, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/auth'
import ProjectSelector from './ProjectSelector'

const navItems = [
  { to: '/', icon: Shield, label: 'Dashboard' },
  { to: '/scans', icon: ScanSearch, label: 'Scans' },
  { to: '/attack-surface', icon: Globe, label: 'Attack Surface' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20">
          <Shield className="h-5 w-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold tracking-tight text-gray-100">Y-QA Pen Testing</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Security Platform</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Project selector */}
      <div className="border-b border-gray-800 py-3">
        <ProjectSelector />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-gray-100'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-gray-800 px-4 py-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
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
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-800/50 hover:text-gray-300"
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
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-gray-800 lg:bg-gray-950">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-950 shadow-xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-800 px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">Connected</span>
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
