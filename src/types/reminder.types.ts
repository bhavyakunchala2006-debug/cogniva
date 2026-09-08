// ============================================================
// REMINDER TYPES
// ============================================================

export type ReminderType = 'medicine' | 'hydration' | 'activity' | 'meal' | 'appointment'

export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'custom'

export interface RecurrenceRule {
  type: RecurrenceType
  days?: number[] // 0=Sun, 1=Mon, ...
  customInterval?: number // days
}

export interface EscalationConfig {
  enabled: boolean
  missedThreshold: number // number of consecutive misses before escalation
  escalateToCaregiverId?: string
}

export interface Reminder {
  reminderId: string
  elderlyProfileId: string
  caregiverId: string
  title: string
  type: ReminderType
  time: string // HH:MM
  recurrence: RecurrenceRule
  instructions: string
  active: boolean
  voiceEnabled: boolean
  escalationConfig: EscalationConfig
  icon: string
  createdAt: Date
}

export type ReminderStatus = 'pending' | 'confirmed' | 'missed' | 'escalated'

export interface ReminderEvent {
  eventId: string
  reminderId: string
  elderlyProfileId: string
  scheduledAt: Date
  confirmedAt?: Date
  status: ReminderStatus
  synced: boolean
}

// ============================================================
// ALERT TYPES
// ============================================================

export type AlertType =
  | 'missedMedication'
  | 'lowActivity'
  | 'performanceChange'
  | 'missedHydration'
  | 'custom'

export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface Alert {
  alertId: string
  caregiverId: string
  elderlyProfileId: string
  elderlyName?: string
  type: AlertType
  severity: AlertSeverity
  message: string
  read: boolean
  createdAt: Date
}
