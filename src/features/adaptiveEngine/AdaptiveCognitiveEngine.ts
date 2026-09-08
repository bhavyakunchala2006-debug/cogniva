// ============================================================
// COGNIVA — Adaptive Cognitive Engine
// ============================================================
// Deterministic algorithm — works fully offline.
// Architecture is pluggable: replace with ML model via
// AdaptiveEngineInterface without changing consumers.
// ============================================================

import type { SessionMetrics, AdaptiveOutput, DifficultyLevel, GameType } from '@/types/game.types'
import { clamp } from '@/lib/utils'

// ── Game rotation order for cognitive variety ─────────────
const GAME_ROTATION: GameType[] = [
  'memoryMatch',
  'rememberObjects',
  'attentionGame',
  'sequenceMemory',
  'recognitionGame',
  'languageGame',
  'orientationGame',
]

// ── Difficulty-to-config mapping ─────────────────────────
const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { numItems: number; previewDuration: number; numDistractors: number; sessionDuration: number }
> = {
  1: { numItems: 4,  previewDuration: 5000, numDistractors: 1, sessionDuration: 180 },
  2: { numItems: 6,  previewDuration: 4000, numDistractors: 2, sessionDuration: 240 },
  3: { numItems: 8,  previewDuration: 3000, numDistractors: 3, sessionDuration: 300 },
  4: { numItems: 10, previewDuration: 2500, numDistractors: 4, sessionDuration: 360 },
  5: { numItems: 12, previewDuration: 2000, numDistractors: 5, sessionDuration: 420 },
}

// ── Interface (pluggable) ─────────────────────────────────
export interface AdaptiveEngineInterface {
  analyze(metrics: SessionMetrics): AdaptiveOutput
}

// ── AdaptiveCognitiveEngine ───────────────────────────────
export class AdaptiveCognitiveEngine implements AdaptiveEngineInterface {
  analyze(metrics: SessionMetrics): AdaptiveOutput {
    const {
      accuracy,
      responseTimeAvg,
      mistakes,
      attempts,
      sessionDuration,
      previousDifficulty,
      gameType,
      recentSessions,
    } = metrics

    // ── 1. Compute per-session performance score (0–100) ──
    const normalizedResponseTime = this.normalizeResponseTime(responseTimeAvg, previousDifficulty)
    const completionRate = attempts > 0 ? clamp((attempts - mistakes) / attempts, 0, 1) * 100 : 50

    const performanceScore =
      accuracy * 0.40 +
      normalizedResponseTime * 0.25 +
      (100 - clamp(mistakes * 10, 0, 100)) * 0.20 +
      completionRate * 0.15

    // ── 2. Trend analysis (last 3 sessions) ──────────────
    const trend = this.computeTrend(recentSessions, gameType)

    // ── 3. Fatigue detection ──────────────────────────────
    const fatigueDetected = this.detectFatigue(recentSessions, sessionDuration)

    // ── 4. Difficulty decision ───────────────────────────
    let nextDifficulty: DifficultyLevel = previousDifficulty
    let explanation = ''

    if (performanceScore >= 80 && trend === 'improving') {
      nextDifficulty = clamp(previousDifficulty + 1, 1, 5) as DifficultyLevel
      explanation = 'Excellent performance! Difficulty increased to keep you challenged.'
    } else if (performanceScore >= 80 && trend === 'stable') {
      nextDifficulty = clamp(previousDifficulty + 1, 1, 5) as DifficultyLevel
      explanation = 'Consistent accuracy. Difficulty increased slightly.'
    } else if (performanceScore >= 60 && trend !== 'declining') {
      nextDifficulty = previousDifficulty
      explanation = 'Good performance! Maintaining the current difficulty level.'
    } else if (performanceScore < 60 && trend === 'declining') {
      nextDifficulty = clamp(previousDifficulty - 1, 1, 5) as DifficultyLevel
      explanation = 'Difficulty reduced to help you succeed more comfortably.'
    } else if (performanceScore < 40) {
      nextDifficulty = clamp(previousDifficulty - 1, 1, 5) as DifficultyLevel
      explanation = 'Difficulty reduced. Hints are available to help you.'
    } else {
      nextDifficulty = previousDifficulty
      explanation = 'Maintaining current difficulty level.'
    }

    // ── 5. Hints availability ─────────────────────────────
    const hintAvailable = accuracy < 50 || performanceScore < 40

    // ── 6. Recommended game (rotate for variety) ─────────
    const currentIndex = GAME_ROTATION.indexOf(gameType)
    const nextGameIndex = (currentIndex + 1) % GAME_ROTATION.length
    const recommendedGame = GAME_ROTATION[nextGameIndex]

    // ── 7. Session duration (shorten if fatigued) ────────
    const config = DIFFICULTY_CONFIG[nextDifficulty]
    const adjustedSessionDuration = fatigueDetected
      ? Math.floor(config.sessionDuration * 0.7)
      : config.sessionDuration

    if (fatigueDetected) {
      explanation += ' Session shortened — take a break if you need one.'
    }

    // ── 8. Confidence score ───────────────────────────────
    const confidenceScore = Math.min(recentSessions.length * 20 + 20, 100)

    return {
      nextDifficulty,
      recommendedGame,
      numItems: config.numItems,
      previewDuration: config.previewDuration,
      numDistractors: config.numDistractors,
      hintAvailable,
      sessionDuration: adjustedSessionDuration,
      explanation,
      trend,
      confidenceScore,
    }
  }

  // ── Normalize response time to 0–100 score ─────────────
  private normalizeResponseTime(responseTimeMs: number, difficulty: DifficultyLevel): number {
    // Expected response times per difficulty (ms)
    const expectedTimes: Record<DifficultyLevel, number> = {
      1: 6000,
      2: 5000,
      3: 4000,
      4: 3500,
      5: 3000,
    }
    const expected = expectedTimes[difficulty]
    if (responseTimeMs <= expected) return 100
    if (responseTimeMs >= expected * 3) return 0
    return Math.max(0, 100 - ((responseTimeMs - expected) / (expected * 2)) * 100)
  }

  // ── Compute trend from recent sessions ─────────────────
  private computeTrend(
    recentSessions: SessionMetrics['recentSessions'],
    _gameType: GameType
  ): 'improving' | 'stable' | 'declining' {
    if (recentSessions.length < 2) return 'stable'
    const last3 = recentSessions.slice(-3)
    const accuracies = last3.map((s) => s.accuracy)
    if (accuracies.length < 2) return 'stable'
    const first = accuracies[0]
    const last = accuracies[accuracies.length - 1]
    const delta = last - first
    if (delta > 5) return 'improving'
    if (delta < -5) return 'declining'
    return 'stable'
  }

  // ── Detect fatigue from increasing response time ────────
  private detectFatigue(
    recentSessions: SessionMetrics['recentSessions'],
    currentDuration: number
  ): boolean {
    // Fatigue if session was very long
    if (currentDuration > 600) return true
    if (recentSessions.length < 2) return false
    const last2 = recentSessions.slice(-2)
    const timeDelta = last2[1].responseTimeAvg - last2[0].responseTimeAvg
    return timeDelta > 2000 // response time increased by >2s
  }
}

// Singleton instance
export const adaptiveEngine = new AdaptiveCognitiveEngine()

// ── Default game config for a given difficulty ──────────
export function getDefaultGameConfig(
  gameType: GameType,
  difficulty: DifficultyLevel
) {
  const config = DIFFICULTY_CONFIG[difficulty]
  return {
    gameType,
    difficulty,
    ...config,
    hintsAvailable: difficulty <= 2,
  }
}
