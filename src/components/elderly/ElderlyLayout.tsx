// ============================================================
// Elderly Layout — Simple bottom-nav shell
// ============================================================

import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Home, Gamepad2, Bell, Mic, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { OfflineBanner } from '@/components/common/OfflineBanner'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/elderly', icon: Home,      label: 'Home',      end: true },
  { to: '/elderly/games', icon: Gamepad2,  label: 'Games' },
  { to: '/elderly/reminders', icon: Bell,     label: 'Reminders' },
  { to: '/elderly/voice', icon: Mic,      label: 'Voice' },
  { to: '/elderly/profile', icon: User,     label: 'Profile' },
]

export function ElderlyLayout() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Top Bar */}
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between safe-top sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <span className="text-xl font-bold text-primary">Cogniva</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {currentUser?.displayName}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-highlight transition-colors rounded-xl hover:bg-highlight/10"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 safe-bottom z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-1 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 min-w-[56px]',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                )
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-6 h-6', isActive && 'scale-110 transition-transform')} />
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
