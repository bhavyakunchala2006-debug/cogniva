// ============================================================
// IndexedDB Schema using Dexie.js — Offline-first storage
// ============================================================

import Dexie, { type Table } from 'dexie'
import type { GameSession } from '@/types/game.types'
import type { ReminderEvent } from '@/types/reminder.types'
import type { ElderlyProfile } from '@/types/user.types'

interface SyncQueueItem {
  itemId?: number
  userId: string
  operation: 'create' | 'update' | 'delete'
  collection: string
  documentId: string
  data: Record<string, unknown>
  attempts: number
  lastAttempt?: Date
  createdAt: Date
  synced: boolean
}

interface CachedContent {
  id: string
  type: 'cultural' | 'profile' | 'reminder'
  data: unknown
  cachedAt: Date
  expiresAt?: Date
}

class CognivaDexie extends Dexie {
  gameSessions!: Table<GameSession>
  reminderEvents!: Table<ReminderEvent>
  elderlyProfiles!: Table<ElderlyProfile>
  syncQueue!: Table<SyncQueueItem>
  cachedContent!: Table<CachedContent>

  constructor() {
    super('CognivaDB')
    this.version(1).stores({
      gameSessions: 'sessionId, elderlyProfileId, timestamp, synced, gameType',
      reminderEvents: 'eventId, reminderId, elderlyProfileId, scheduledAt, synced, status',
      elderlyProfiles: 'profileId, userId, caregiverId',
      syncQueue: '++itemId, userId, collection, synced, createdAt',
      cachedContent: 'id, type, cachedAt',
    })
  }
}

export const cognivaDB = new CognivaDexie()

// ── Sync Queue Helpers ────────────────────────────────────

export async function addToSyncQueue(
  userId: string,
  operation: SyncQueueItem['operation'],
  collection: string,
  documentId: string,
  data: Record<string, unknown>
): Promise<void> {
  await cognivaDB.syncQueue.add({
    userId,
    operation,
    collection,
    documentId,
    data,
    attempts: 0,
    createdAt: new Date(),
    synced: false,
  })
}

export async function getPendingSyncItems(userId: string): Promise<SyncQueueItem[]> {
  return cognivaDB.syncQueue
    .where({ userId, synced: 0 as unknown as boolean })
    .toArray()
}

export async function markSyncItemComplete(itemId: number): Promise<void> {
  await cognivaDB.syncQueue.update(itemId, { synced: true })
}

export async function incrementSyncAttempt(itemId: number): Promise<void> {
  const item = await cognivaDB.syncQueue.get(itemId)
  if (item) {
    await cognivaDB.syncQueue.update(itemId, {
      attempts: (item.attempts || 0) + 1,
      lastAttempt: new Date(),
    })
  }
}

// ── Game Session Helpers ──────────────────────────────────

export async function saveGameSessionLocally(session: GameSession): Promise<void> {
  await cognivaDB.gameSessions.put(session)
}

export async function getUnsyncedGameSessions(elderlyProfileId: string): Promise<GameSession[]> {
  return cognivaDB.gameSessions
    .where({ elderlyProfileId, synced: 0 as unknown as boolean })
    .toArray()
}

export async function markGameSessionSynced(sessionId: string): Promise<void> {
  await cognivaDB.gameSessions.update(sessionId, { synced: true })
}

export async function getRecentGameSessions(
  elderlyProfileId: string,
  limit = 10
): Promise<GameSession[]> {
  return cognivaDB.gameSessions
    .where('elderlyProfileId')
    .equals(elderlyProfileId)
    .reverse()
    .limit(limit)
    .toArray()
}

// ── Reminder Event Helpers ────────────────────────────────

export async function saveReminderEventLocally(event: ReminderEvent): Promise<void> {
  await cognivaDB.reminderEvents.put(event)
}

export async function getTodayReminderEvents(elderlyProfileId: string): Promise<ReminderEvent[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return cognivaDB.reminderEvents
    .where('elderlyProfileId')
    .equals(elderlyProfileId)
    .filter((e) => e.scheduledAt >= today && e.scheduledAt < tomorrow)
    .toArray()
}

// ── Profile Cache ─────────────────────────────────────────

export async function cacheElderlyProfile(profile: ElderlyProfile): Promise<void> {
  await cognivaDB.elderlyProfiles.put(profile)
}

export async function getCachedProfile(userId: string): Promise<ElderlyProfile | undefined> {
  return cognivaDB.elderlyProfiles.where('userId').equals(userId).first()
}
