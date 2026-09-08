// ============================================================
// USER TYPES
// ============================================================

export type UserRole = 'elderly' | 'caregiver' | 'healthWorker' | 'admin'

export type AgeRange = '60-65' | '65-70' | '70-75' | '75-80' | '80+'

export type SupportedLanguage = 'en' | 'hi' | 'as' | 'bn' | 'mni'

export interface User {
  uid: string
  email: string
  role: UserRole
  displayName: string
  createdAt: Date
  lastLogin: Date
  linkedProfiles?: string[]
}

export interface AccessibilityPreferences {
  largeText: boolean
  highContrast: boolean
  voiceEnabled: boolean
  soundEnabled: boolean
  slowAnimations: boolean
  fontSize: 'normal' | 'large' | 'xlarge'
}

export interface ElderlyProfile {
  profileId: string
  userId: string
  caregiverId: string
  healthWorkerIds: string[]
  name: string
  ageRange: AgeRange
  preferredLanguage: SupportedLanguage
  region: string
  state: string
  interests: string[]
  familiarObjects: string[]
  favoriteCategories: string[]
  preferredActivityTime: string
  accessibility: AccessibilityPreferences
  photoUrl?: string
  greetingName?: string
  createdAt: Date
  updatedAt: Date
}

export interface CaregiverProfile {
  profileId: string
  userId: string
  name: string
  phone?: string
  linkedElderlyIds: string[]
  createdAt: Date
}

export interface HealthWorkerProfile {
  profileId: string
  userId: string
  name: string
  designation: string
  authorizedPatientIds: string[]
  createdAt: Date
}
