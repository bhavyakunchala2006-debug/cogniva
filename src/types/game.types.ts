// ============================================================
// GAME TYPES
// ============================================================

export type GameType =
  | 'memoryMatch'
  | 'rememberObjects'
  | 'sequenceMemory'
  | 'attentionGame'
  | 'recognitionGame'
  | 'languageGame'
  | 'orientationGame'

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export interface GameItem {
  id: string
  name: string
  emoji?: string
  imageUrl?: string
  category: string
  culturalTag?: string
}

export interface GameConfig {
  gameType: GameType
  difficulty: DifficultyLevel
  numItems: number
  previewDuration: number // ms
  numDistractors: number
  hintsAvailable: boolean
  sessionDuration: number // seconds max
  culturalFilter?: string
}

export interface GameSession {
  sessionId: string
  elderlyProfileId: string
  gameType: GameType
  difficulty: DifficultyLevel
  score: number
  accuracy: number // 0-100
  responseTimeAvg: number // ms
  mistakes: number
  attempts: number
  sessionDuration: number // seconds
  timestamp: Date
  synced: boolean
  adaptiveOutput?: AdaptiveOutput
  offlineCreated?: boolean
}

// ============================================================
// ADAPTIVE ENGINE TYPES
// ============================================================

export interface SessionMetrics {
  accuracy: number
  responseTimeAvg: number
  mistakes: number
  attempts: number
  sessionDuration: number
  previousDifficulty: DifficultyLevel
  gameType: GameType
  recentSessions: GameSession[]
}

export interface AdaptiveOutput {
  nextDifficulty: DifficultyLevel
  recommendedGame: GameType
  numItems: number
  previewDuration: number
  numDistractors: number
  hintAvailable: boolean
  sessionDuration: number
  explanation: string
  trend: 'improving' | 'stable' | 'declining'
  confidenceScore: number
}

// ============================================================
// COGNITIVE METRICS
// ============================================================

export interface CognitiveMetric {
  metricId: string
  elderlyProfileId: string
  week: string
  month: string
  gameType: GameType
  avgAccuracy: number
  avgResponseTime: number
  totalSessions: number
  improvementTrend: 'improving' | 'stable' | 'declining'
  timestamp: Date
}
