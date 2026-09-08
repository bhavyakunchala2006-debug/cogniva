// ============================================================
// Offline Context — Tracks online/offline state + sync status
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed'

interface OfflineContextValue {
  isOnline: boolean
  syncStatus: SyncStatus
  pendingCount: number
  triggerSync: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextValue | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Trigger sync when back online
      setTimeout(() => triggerSync(), 1000)
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) return
    setSyncStatus('syncing')
    try {
      // Import dynamically to avoid circular deps
      const { processSync } = await import('@/services/synchronization/SyncService')
      await processSync()
      setPendingCount(0)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (err) {
      console.error('Sync failed:', err)
      setSyncStatus('failed')
      setTimeout(() => setSyncStatus('idle'), 5000)
    }
  }, [])

  return (
    <OfflineContext.Provider value={{ isOnline, syncStatus, pendingCount, triggerSync }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const ctx = useContext(OfflineContext)
  if (!ctx) throw new Error('useOffline must be used within OfflineProvider')
  return ctx
}
