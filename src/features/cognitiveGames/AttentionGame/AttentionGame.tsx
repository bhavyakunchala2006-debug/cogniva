// ============================================================
// COGNIVA — Attention Game
// ============================================================
// Cognitive domain: Sustained attention & visual scanning
// Task: Find the target emoji among distractors in a 5×5 grid
// Rounds: 10  |  Timer: 10s per round
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { getCulturalGameItems } from '@/data/nerCulturalContent'
import { adaptiveEngine } from '@/features/adaptiveEngine/AdaptiveCognitiveEngine'
import { saveGameSessionLocally } from '@/lib/indexedDB'
import { speak } from '@/services/voice/VoiceService'
import { shuffleArray, generateId } from '@/lib/utils'
import { DEMO_ELDERLY_PROFILE, generateDemoSessions } from '@/data/demoData'
import type { GameSession, AdaptiveOutput, DifficultyLevel } from '@/types/game.types'

// ── Constants ─────────────────────────────────────────────────
const TOTAL_ROUNDS = 10
const GRID_SIZE = 25   // 5 × 5
const ROUND_DURATION = 10 // seconds

// ── Types ─────────────────────────────────────────────────────
interface GameItem {
  id: string
  name: string
  emoji: string
  category: string
}

type CellFlash = 'correct' | 'wrong' | null

interface CellState {
  item: GameItem
  flash: CellFlash
}

type Phase = 'idle' | 'playing' | 'finished'

// ── Helpers ───────────────────────────────────────────────────
function buildGrid(target: GameItem, allItems: GameItem[]): CellState[] {
  const distractors = shuffleArray(allItems.filter((i) => i.id !== target.id)).slice(0, GRID_SIZE - 1)
  const cells: GameItem[] = shuffleArray([target, ...distractors])
  return cells.map((item) => ({ item, flash: null }))
}

// ── Component ─────────────────────────────────────────────────
export function AttentionGame() {
  const navigate = useNavigate()

  // Pull enough cultural items for the full grid
  const allItemsRef = useRef<GameItem[]>(
    getCulturalGameItems(undefined, undefined, 25) as GameItem[]
  )

  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [target, setTarget] = useState<GameItem | null>(null)
  const [cells, setCells] = useState<CellState[]>([])
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION)
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now())
  const [adaptiveOutput, setAdaptiveOutput] = useState<AdaptiveOutput | null>(null)
  const [savedSession, setSavedSession] = useState<GameSession | null>(null)
  const [locked, setLocked] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const roundRef = useRef(0)

  // ── Start a round ────────────────────────────────────────────
  const startRound = useCallback((roundNumber: number) => {
    const items = allItemsRef.current
    if (items.length < 2) return
    roundRef.current = roundNumber
    const newTarget = items[roundNumber % items.length]
    const grid = buildGrid(newTarget, items)
    setTarget(newTarget)
    setCells(grid)
    setTimeLeft(ROUND_DURATION)
    setRoundStartTime(Date.now())
    setLocked(false)
    setPhase('playing')
    speak(`Find the ${newTarget.name}`)
  }, [])

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          // Timeout counts as a miss
          setMistakes((m) => m + 1)
          const nextRound = roundRef.current + 1
          roundRef.current = nextRound
          setRound(nextRound)
          if (nextRound >= TOTAL_ROUNDS) {
            setPhase('finished')
          } else {
            setTimeout(() => startRound(nextRound), 800)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current!)
  }, [phase, startRound])

  // ── Handle cell tap ──────────────────────────────────────────
  const handleCellTap = useCallback(
    (cellIndex: number) => {
      if (phase !== 'playing' || locked || !target) return
      setLocked(true)
      clearInterval(timerRef.current!)

      const cell = cells[cellIndex]
      const isCorrect = cell.item.id === target.id
      const elapsed = Date.now() - roundStartTime
      const flashType: CellFlash = isCorrect ? 'correct' : 'wrong'

      // Flash feedback
      setCells((prev) =>
        prev.map((c, i) => (i === cellIndex ? { ...c, flash: flashType } : c))
      )
      flashTimeoutRef.current = setTimeout(() => {
        setCells((prev) => prev.map((c) => ({ ...c, flash: null })))
      }, 600)

      if (isCorrect) {
        setScore((s) => s + 1)
        setResponseTimes((rt) => [...rt, elapsed])
        speak('Well done!')
      } else {
        setMistakes((m) => m + 1)
        speak('Keep looking!')
      }

      const nextRound = roundRef.current + 1
      roundRef.current = nextRound
      setRound(nextRound)

      if (nextRound >= TOTAL_ROUNDS) {
        setTimeout(() => setPhase('finished'), 800)
      } else {
        setTimeout(() => startRound(nextRound), 900)
      }
    },
    [phase, locked, target, cells, roundStartTime, startRound]
  )

  // ── Finish: save session & analyze ──────────────────────────
  useEffect(() => {
    if (phase !== 'finished') return

    const totalAttempts = TOTAL_ROUNDS
    const finalScore = score  // captured at finish
    const accuracy = Math.round((finalScore / totalAttempts) * 100)
    const avgResponseTime =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 5000

    const profile = DEMO_ELDERLY_PROFILE
    const recentSessions = generateDemoSessions(profile.profileId)

    const output = adaptiveEngine.analyze({
      accuracy,
      responseTimeAvg: avgResponseTime,
      mistakes,
      attempts: totalAttempts,
      sessionDuration: totalAttempts * ROUND_DURATION,
      previousDifficulty: 2 as DifficultyLevel,
      gameType: 'attentionGame',
      recentSessions,
    })

    setAdaptiveOutput(output)

    const session: GameSession = {
      sessionId: generateId(),
      elderlyProfileId: profile.profileId,
      gameType: 'attentionGame',
      difficulty: 2,
      score: accuracy,
      accuracy,
      responseTimeAvg: avgResponseTime,
      mistakes,
      attempts: totalAttempts,
      sessionDuration: totalAttempts * ROUND_DURATION,
      timestamp: new Date(),
      synced: false,
      adaptiveOutput: output,
      offlineCreated: true,
    }
    setSavedSession(session)
    saveGameSessionLocally(session).catch(console.error)
    speak(
      `Great job! You found ${finalScore} out of ${totalAttempts} objects. ${output.explanation}`
    )
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current!)
      clearTimeout(flashTimeoutRef.current!)
    }
  }, [])

  // ── Reset helper ─────────────────────────────────────────────
  const resetGame = () => {
    roundRef.current = 0
    setRound(0)
    setScore(0)
    setMistakes(0)
    setResponseTimes([])
    setAdaptiveOutput(null)
    setSavedSession(null)
    setLocked(false)
    startRound(0)
  }

  // ── Visual helpers ───────────────────────────────────────────
  const timerPercent = (timeLeft / ROUND_DURATION) * 100
  const timerColour =
    timeLeft > 6 ? 'bg-[#70B77E]' : timeLeft > 3 ? 'bg-[#F4B860]' : 'bg-[#F28C8C]'
  const progressPercent = (Math.min(round, TOTAL_ROUNDS) / TOTAL_ROUNDS) * 100
  const trendIcon =
    adaptiveOutput?.trend === 'improving'
      ? '📈'
      : adaptiveOutput?.trend === 'declining'
      ? '📉'
      : '➡️'

  // ════════════════════════════════════════════════════════════
  // IDLE SCREEN
  // ════════════════════════════════════════════════════════════
  if (phase === 'idle') {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-6 gap-6">
        <Card className="w-full max-w-md text-center" padding="lg">
          <div className="text-6xl mb-4">👁️</div>
          <h1 className="text-3xl font-bold text-[#4F7CAC] mb-2">Attention Game</h1>
          <p className="text-lg text-gray-600 mb-6">
            Find the named object in the picture grid as fast as you can!
          </p>
          <ul className="text-left text-base text-gray-700 space-y-2 mb-6 bg-[#4F7CAC]/5 rounded-xl p-4">
            <li>🎯 <strong>10 rounds</strong> — find the correct emoji each time</li>
            <li>⏱️ <strong>10 seconds</strong> per round</li>
            <li>🌿 Images from Northeast India culture</li>
          </ul>
          <Button fullWidth size="xl" onClick={() => startRound(0)}>
            ▶ Start Game
          </Button>
          <Button
            fullWidth
            size="md"
            variant="ghost"
            className="mt-3"
            onClick={() => navigate('/elderly/games')}
          >
            ← Back to Games
          </Button>
        </Card>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // RESULTS SCREEN
  // ════════════════════════════════════════════════════════════
  if (phase === 'finished') {
    const accuracy = Math.round((score / TOTAL_ROUNDS) * 100)
    const starEmoji = accuracy >= 80 ? '🌟' : accuracy >= 50 ? '😊' : '💪'
    const headerText = accuracy >= 80 ? 'Excellent Work!' : accuracy >= 50 ? 'Well Done!' : 'Good Try!'

    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-6 gap-6">
        <Card className="w-full max-w-md text-center" padding="lg">
          <div className="text-6xl mb-3">{starEmoji}</div>
          <h2 className="text-3xl font-bold text-[#4F7CAC] mb-1">{headerText}</h2>
          <p className="text-gray-500 text-sm mb-6">Attention Game Complete</p>

          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#70B77E]/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-[#70B77E]">{score}/{TOTAL_ROUNDS}</div>
              <div className="text-xs text-gray-500 mt-1">Correct</div>
            </div>
            <div className="bg-[#4F7CAC]/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-[#4F7CAC]">{accuracy}%</div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>
            <div className="bg-[#F28C8C]/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-[#F28C8C]">{mistakes}</div>
              <div className="text-xs text-gray-500 mt-1">Missed</div>
            </div>
          </div>

          {/* Adaptive Feedback */}
          {adaptiveOutput && (
            <div className="bg-[#F4B860]/10 border border-[#F4B860]/30 rounded-xl p-4 mb-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{trendIcon}</span>
                <span className="font-semibold text-[#4F7CAC] text-base">Your Progress</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{adaptiveOutput.explanation}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-[#4F7CAC]/10 text-[#4F7CAC] px-2 py-1 rounded-full">
                  Next difficulty: Level {adaptiveOutput.nextDifficulty}
                </span>
                <span className="text-xs bg-[#70B77E]/10 text-[#70B77E] px-2 py-1 rounded-full">
                  Try: {adaptiveOutput.recommendedGame}
                </span>
              </div>
            </div>
          )}

          {savedSession && (
            <p className="text-xs text-gray-400 mb-4">✅ Session saved</p>
          )}

          <div className="flex flex-col gap-3">
            <Button fullWidth size="lg" onClick={resetGame}>
              🔄 Play Again
            </Button>
            <Button
              fullWidth
              size="md"
              variant="outline"
              onClick={() => navigate('/elderly/games')}
            >
              ← Back to Games
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // PLAYING SCREEN
  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col p-4 gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          className="text-[#4F7CAC] font-semibold min-h-[48px] px-2 flex items-center gap-1 text-base"
          onClick={() => navigate('/elderly/games')}
        >
          ← Games
        </button>
        <div className="flex items-center gap-2">
          <span className="bg-[#70B77E]/15 text-[#70B77E] font-bold text-base px-3 py-1 rounded-full">
            ✓ {score}
          </span>
          <span className="bg-[#F28C8C]/15 text-[#F28C8C] font-bold text-base px-3 py-1 rounded-full">
            ✗ {mistakes}
          </span>
        </div>
      </div>

      {/* Round progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Round {Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#4F7CAC] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Target prompt */}
      {target && (
        <div className="bg-white border-2 border-[#4F7CAC]/20 rounded-2xl shadow-sm py-3 px-4 flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Find the:</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl leading-none">{target.emoji}</span>
              <span className="text-2xl font-bold text-[#4F7CAC]">{target.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Timer bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Time</span>
          <span className={`font-bold ${timeLeft <= 3 ? 'text-[#F28C8C]' : 'text-gray-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${timerColour} h-3 rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* 5×5 Emoji Grid */}
      <div className="grid grid-cols-5 gap-2">
        {cells.map((cell, i) => {
          const flashClass =
            cell.flash === 'correct'
              ? 'bg-[#70B77E]/30 ring-4 ring-[#70B77E] scale-110'
              : cell.flash === 'wrong'
              ? 'bg-[#F28C8C]/30 ring-4 ring-[#F28C8C] scale-95'
              : 'bg-white hover:bg-[#4F7CAC]/5 active:scale-90'

          return (
            <button
              key={i}
              onClick={() => handleCellTap(i)}
              disabled={locked}
              aria-label={cell.item.name}
              className={`
                aspect-square rounded-xl flex items-center justify-center
                text-3xl border border-gray-200 shadow-sm
                transition-all duration-200 min-h-[52px]
                disabled:cursor-default
                ${flashClass}
              `}
            >
              {cell.item.emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}
