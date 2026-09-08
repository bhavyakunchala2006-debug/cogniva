// ============================================================
// CULTURAL CONTENT TYPES
// ============================================================

export type CulturalCategory =
  | 'food'
  | 'clothing'
  | 'festivals'
  | 'music'
  | 'householdObjects'
  | 'localEnvironment'
  | 'dailyActivities'
  | 'traditionalObjects'
  | 'places'
  | 'nature'
  | 'communityActivities'

export type NERState =
  | 'Assam'
  | 'Meghalaya'
  | 'Manipur'
  | 'Nagaland'
  | 'Arunachal Pradesh'
  | 'Tripura'
  | 'Mizoram'
  | 'Sikkim'
  | 'General'

export interface LocalizedString {
  en: string
  hi: string
  [key: string]: string // extensible for NER languages
}

export interface CulturalContent {
  contentId: string
  state: NERState
  region: string
  languages: string[]
  category: CulturalCategory
  contentType: 'image' | 'emoji' | 'text'
  name: LocalizedString
  description: LocalizedString
  tags: string[]
  emoji?: string
  imageUrl?: string
  audioUrl?: string
  approved: boolean
  createdBy?: string
}

// ============================================================
// FAMILY MEDIA
// ============================================================

export interface FamilyMedia {
  mediaId: string
  elderlyProfileId: string
  uploadedBy: string
  url: string
  thumbnailUrl?: string
  caption: string
  usedInGames: boolean
  uploadedAt: Date
}

// ============================================================
// VOICE INTERACTION
// ============================================================

export interface VoiceInteraction {
  interactionId: string
  elderlyProfileId: string
  userInput: string
  assistantResponse: string
  intent?: string
  timestamp: Date
  synced: boolean
}
