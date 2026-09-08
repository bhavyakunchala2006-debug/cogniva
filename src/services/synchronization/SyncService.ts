// ============================================================
// Sync Service — Processes offline sync queue
// ============================================================

import { getPendingSyncItems, markSyncItemComplete, incrementSyncAttempt } from '@/lib/indexedDB'
import { isDemoMode } from '@/services/firebase/config'

const MAX_ATTEMPTS = 5
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]

export async function processSync(): Promise<void> {
  if (isDemoMode) {
    // In demo mode, just simulate sync
    await new Promise((r) => setTimeout(r, 800))
    return
  }

  try {
    // We need a userId - get it from localStorage or skip
    const storedUser = localStorage.getItem('cogniva_sync_user')
    if (!storedUser) return
    const { uid } = JSON.parse(storedUser)

    const pendingItems = await getPendingSyncItems(uid)
    if (pendingItems.length === 0) return

    const { db } = await import('@/services/firebase/config')
    const { doc, setDoc, updateDoc, deleteDoc } = await import('firebase/firestore')

    for (const item of pendingItems) {
      if ((item.attempts || 0) >= MAX_ATTEMPTS) continue
      if (!item.itemId) continue

      const delayMs = RETRY_DELAYS[Math.min((item.attempts || 0), RETRY_DELAYS.length - 1)]
      await new Promise((r) => setTimeout(r, delayMs / 10)) // reduced delay for processing

      try {
        const docRef = doc(db, item.collection, item.documentId)
        switch (item.operation) {
          case 'create':
            await setDoc(docRef, item.data)
            break
          case 'update':
            await updateDoc(docRef, item.data)
            break
          case 'delete':
            await deleteDoc(docRef)
            break
        }
        await markSyncItemComplete(item.itemId)
      } catch (err) {
        console.error(`Sync failed for item ${item.itemId}:`, err)
        await incrementSyncAttempt(item.itemId)
      }
    }
  } catch (err) {
    console.error('Sync process error:', err)
    throw err
  }
}
