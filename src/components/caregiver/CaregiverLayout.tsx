// ============================================================
// Caregiver Layout
// ============================================================

import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, Bell, BarChart2, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { OfflineBanner } from '@/components/common/OfflineBanner'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/caregiver',         icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/caregiver/patients', icon: Users,           label: 'Patients' },
  { to: '/caregiver/alerts',   icon: Bell,            label: 'Alerts' },
  { to: '/caregiver/reports',  icon: BarChart2,       label: 'Reports' },
]

export function CaregiverLayout() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <OfflineBanner />

      {/* Top Bar */}
      <header className="bg-white border-b border-border/50 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div>
            <span className="text-xl font-bold text-primary">Cogniva</span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-2">Caregiver</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{currentUser?.displayName}</span>
          <button
            onClick={async () => { await logout(); navigate('/login', { replace: true }) }}
            className="p-2 text-muted-foreground hover:text-highlight transition-colors rounded-xl hover:bg-highlight/10"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Layout: sidebar on desktop, bottom-nav on mobile */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <nav className="hidden lg:flex flex-col w-56 bg-white border-r border-border/50 py-4 px-3 gap-1 shrink-0">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-150 text-base',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (mobile) */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 bg-white border-t border-border/50 safe-bottom z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-1 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px]',
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
                  <span className="text-xs font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
