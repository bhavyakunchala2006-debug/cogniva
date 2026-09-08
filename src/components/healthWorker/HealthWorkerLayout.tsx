// ============================================================
// Health Worker Layout + Pages
// ============================================================

import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut, ClipboardList } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { OfflineBanner } from '@/components/common/OfflineBanner'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/health-worker',          icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/health-worker/patients', icon: Users,           label: 'Patients' },
]

export function HealthWorkerLayout() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <OfflineBanner />
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
            <span className="text-lg">🩺</span>
          </div>
          <div>
            <span className="text-xl font-bold text-secondary">Cogniva</span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-2">Health Worker</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{currentUser?.displayName}</span>
          <button
            onClick={async () => { await logout(); navigate('/login', { replace: true }) }}
            className="p-2 text-muted-foreground hover:text-highlight rounded-xl"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 safe-bottom z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all min-w-[80px]',
                  isActive ? 'text-secondary bg-secondary/10' : 'text-muted-foreground')
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
