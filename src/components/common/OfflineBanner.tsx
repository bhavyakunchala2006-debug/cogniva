// ============================================================
// Offline Banner — Shows connectivity status
// ============================================================

import React from 'react'
import { useOffline } from '@/contexts/OfflineContext'
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OfflineBanner() {
  const { isOnline, syncStatus } = useOffline()

  if (isOnline && syncStatus === 'idle') return null

  const banners = {
    offline: {
      bg: 'bg-highlight/90',
      icon: <WifiOff className="w-4 h-4" />,
      text: "You're offline — activities saved locally",
    },
    syncing: {
      bg: 'bg-primary/90',
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      text: 'Back online — syncing your data...',
    },
    synced: {
      bg: 'bg-secondary/90',
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: 'All activities synchronized ✓',
    },
    failed: {
      bg: 'bg-accent/90',
      icon: <WifiOff className="w-4 h-4" />,
      text: 'Sync failed — will retry automatically',
    },
  }

  const state = !isOnline ? 'offline' : syncStatus === 'idle' ? null : syncStatus
  if (!state) return null

  const banner = banners[state as keyof typeof banners]
  if (!banner) return null

  return (
    <div
      className={cn(
        'w-full flex items-center justify-center gap-2 py-2 px-4 text-white text-sm font-medium z-50',
        banner.bg
      )}
      role="status"
      aria-live="polite"
    >
      {banner.icon}
      <span>{banner.text}</span>
    </div>
  )
}

// Connectivity indicator dot
export function ConnectivityDot() {
  const { isOnline } = useOffline()
  return (
    <div
      className={cn(
        'w-2.5 h-2.5 rounded-full',
        isOnline ? 'bg-secondary' : 'bg-highlight animate-pulse'
      )}
      title={isOnline ? 'Online' : 'Offline'}
    />
  )
}
