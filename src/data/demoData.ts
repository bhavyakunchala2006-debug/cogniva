// ============================================================
// DEMO DATA — Used when Firebase is not configured
// Provides realistic mock data for all three user roles
// ============================================================

import type { ElderlyProfile } from '@/types/user.types'
import type { GameSession } from '@/types/game.types'
import type { Reminder, Alert } from '@/types/reminder.types'
import type { User } from '@/types/user.types'

// ── Demo Users ────────────────────────────────────────────
export const DEMO_USERS: User[] = [
  {
    uid: 'demo-elderly-001',
    email: 'ravi@demo.cogniva',
    role: 'elderly',
    displayName: 'Ravi Kumar',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    linkedProfiles: ['profile-001'],
  },
  {
    uid: 'demo-caregiver-001',
    email: 'priya@demo.cogniva',
    role: 'caregiver',
    displayName: 'Priya Kumar',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date(),
    linkedProfiles: ['profile-001'],
  },
  {
    uid: 'demo-health-001',
    email: 'dr.sharma@demo.cogniva',
    role: 'healthWorker',
    displayName: 'Dr. Anita Sharma',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
]

// ── Demo Credentials ──────────────────────────────────────
export const DEMO_CREDENTIALS = [
  { email: 'elderly@demo.com', password: 'demo1234', role: 'elderly', name: 'Ravi Kumar' },
  { email: 'caregiver@demo.com', password: 'demo1234', role: 'caregiver', name: 'Priya Kumar' },
  { email: 'health@demo.com', password: 'demo1234', role: 'healthWorker', name: 'Dr. Anita Sharma' },
]

// ── Demo Elderly Profile ─────────────────────────────────
export const DEMO_ELDERLY_PROFILE: ElderlyProfile = {
  profileId: 'profile-001',
  userId: 'demo-elderly-001',
  caregiverId: 'demo-caregiver-001',
  healthWorkerIds: ['demo-health-001'],
  name: 'Ravi Kumar',
  ageRange: '70-75',
  preferredLanguage: 'en',
  region: 'Assam',
  state: 'Assam',
  interests: ['farming', 'music', 'nature'],
  familiarObjects: ['rice', 'fish', 'tea', 'elephant'],
  favoriteCategories: ['food', 'nature', 'festivals'],
  preferredActivityTime: '10:00',
  greetingName: 'Ravi',
  accessibility: {
    largeText: true,
    highContrast: false,
    voiceEnabled: true,
    soundEnabled: true,
    slowAnimations: false,
    fontSize: 'large',
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
}

// ── Demo Game Sessions ───────────────────────────────────
export function generateDemoSessions(profileId: string): GameSession[] {
  const now = Date.now()
  return [
    {
      sessionId: 'session-001',
      elderlyProfileId: profileId,
      gameType: 'memoryMatch',
      difficulty: 2,
      score: 85,
      accuracy: 85,
      responseTimeAvg: 3200,
      mistakes: 2,
      attempts: 8,
      sessionDuration: 180,
      timestamp: new Date(now - 7 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-002',
      elderlyProfileId: profileId,
      gameType: 'rememberObjects',
      difficulty: 2,
      score: 70,
      accuracy: 70,
      responseTimeAvg: 4100,
      mistakes: 3,
      attempts: 6,
      sessionDuration: 220,
      timestamp: new Date(now - 6 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-003',
      elderlyProfileId: profileId,
      gameType: 'memoryMatch',
      difficulty: 2,
      score: 90,
      accuracy: 90,
      responseTimeAvg: 2800,
      mistakes: 1,
      attempts: 8,
      sessionDuration: 160,
      timestamp: new Date(now - 5 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-004',
      elderlyProfileId: profileId,
      gameType: 'attentionGame',
      difficulty: 2,
      score: 75,
      accuracy: 75,
      responseTimeAvg: 3500,
      mistakes: 2,
      attempts: 8,
      sessionDuration: 200,
      timestamp: new Date(now - 4 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-005',
      elderlyProfileId: profileId,
      gameType: 'memoryMatch',
      difficulty: 3,
      score: 88,
      accuracy: 88,
      responseTimeAvg: 3100,
      mistakes: 2,
      attempts: 10,
      sessionDuration: 240,
      timestamp: new Date(now - 3 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-006',
      elderlyProfileId: profileId,
      gameType: 'sequenceMemory',
      difficulty: 2,
      score: 80,
      accuracy: 80,
      responseTimeAvg: 3800,
      mistakes: 2,
      attempts: 8,
      sessionDuration: 190,
      timestamp: new Date(now - 2 * 86400000),
      synced: true,
    },
    {
      sessionId: 'session-007',
      elderlyProfileId: profileId,
      gameType: 'memoryMatch',
      difficulty: 3,
      score: 92,
      accuracy: 92,
      responseTimeAvg: 2900,
      mistakes: 1,
      attempts: 10,
      sessionDuration: 210,
      timestamp: new Date(now - 1 * 86400000),
      synced: true,
    },
  ]
}

// ── Weekly Data for Charts ──────────────────────────────
export const DEMO_WEEKLY_DATA = [
  { week: 'Week 1', memory: 62, attention: 55, recognition: 58 },
  { week: 'Week 2', memory: 68, attention: 62, recognition: 65 },
  { week: 'Week 3', memory: 74, attention: 70, recognition: 72 },
  { week: 'Week 4', memory: 79, attention: 75, recognition: 78 },
  { week: 'Week 5', memory: 85, attention: 80, recognition: 82 },
  { week: 'Week 6', memory: 88, attention: 83, recognition: 86 },
  { week: 'Week 7', memory: 90, attention: 86, recognition: 88 },
]

// ── Demo Reminders ────────────────────────────────────────
export const DEMO_REMINDERS: Reminder[] = [
  {
    reminderId: 'rem-001',
    elderlyProfileId: 'profile-001',
    caregiverId: 'demo-caregiver-001',
    title: 'Morning Medicine',
    type: 'medicine',
    time: '09:00',
    recurrence: { type: 'daily' },
    instructions: 'Take 1 tablet of Donepezil with water',
    active: true,
    voiceEnabled: true,
    escalationConfig: { enabled: true, missedThreshold: 2, escalateToCaregiverId: 'demo-caregiver-001' },
    icon: '💊',
    createdAt: new Date('2024-01-15'),
  },
  {
    reminderId: 'rem-002',
    elderlyProfileId: 'profile-001',
    caregiverId: 'demo-caregiver-001',
    title: 'Drink Water',
    type: 'hydration',
    time: '10:00',
    recurrence: { type: 'daily' },
    instructions: 'Drink a full glass of water',
    active: true,
    voiceEnabled: true,
    escalationConfig: { enabled: false, missedThreshold: 3 },
    icon: '💧',
    createdAt: new Date('2024-01-15'),
  },
  {
    reminderId: 'rem-003',
    elderlyProfileId: 'profile-001',
    caregiverId: 'demo-caregiver-001',
    title: 'Brain Activity',
    type: 'activity',
    time: '11:00',
    recurrence: { type: 'daily' },
    instructions: 'Complete today\'s brain exercise on Cogniva',
    active: true,
    voiceEnabled: true,
    escalationConfig: { enabled: true, missedThreshold: 3, escalateToCaregiverId: 'demo-caregiver-001' },
    icon: '🧠',
    createdAt: new Date('2024-01-15'),
  },
  {
    reminderId: 'rem-004',
    elderlyProfileId: 'profile-001',
    caregiverId: 'demo-caregiver-001',
    title: 'Evening Medicine',
    type: 'medicine',
    time: '20:00',
    recurrence: { type: 'daily' },
    instructions: 'Take blood pressure tablet with water',
    active: true,
    voiceEnabled: false,
    escalationConfig: { enabled: true, missedThreshold: 2, escalateToCaregiverId: 'demo-caregiver-001' },
    icon: '💊',
    createdAt: new Date('2024-01-15'),
  },
]

// ── Demo Alerts ───────────────────────────────────────────
export const DEMO_ALERTS: Alert[] = [
  {
    alertId: 'alert-001',
    caregiverId: 'demo-caregiver-001',
    elderlyProfileId: 'profile-001',
    elderlyName: 'Ravi Kumar',
    type: 'missedMedication',
    severity: 'warning',
    message: 'Ravi Kumar missed the Evening Medicine reminder twice this week.',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    alertId: 'alert-002',
    caregiverId: 'demo-caregiver-001',
    elderlyProfileId: 'profile-001',
    elderlyName: 'Ravi Kumar',
    type: 'performanceChange',
    severity: 'info',
    message: 'Memory activity performance has improved over the last 3 weeks. Keep encouraging the sessions!',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000),
  },
  {
    alertId: 'alert-003',
    caregiverId: 'demo-caregiver-001',
    elderlyProfileId: 'profile-001',
    elderlyName: 'Ravi Kumar',
    type: 'lowActivity',
    severity: 'warning',
    message: 'No cognitive session completed yesterday. Consider checking in.',
    read: false,
    createdAt: new Date(Date.now() - 26 * 3600000),
  },
]

// ── Demo AI Insights ──────────────────────────────────────
export const DEMO_INSIGHTS = [
  {
    id: 'insight-001',
    title: 'Memory Performance',
    description: 'Memory activity performance has improved from 62% to 90% over the last 7 weeks. This is excellent progress in cognitive engagement!',
    trend: 'improving' as const,
    icon: '🧠',
  },
  {
    id: 'insight-002',
    title: 'Attention & Focus',
    description: 'Attention game scores have been consistently improving. Response times are getting faster each week.',
    trend: 'improving' as const,
    icon: '👁️',
  },
  {
    id: 'insight-003',
    title: 'Reminder Adherence',
    description: 'Morning medication reminders were confirmed 6 out of 7 days this week. Evening reminders were missed twice — please check in.',
    trend: 'stable' as const,
    icon: '💊',
  },
]
