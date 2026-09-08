// ============================================================
// Memory Match Game — Complete Implementation
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Brain, Clock, Star, ArrowLeft, Volume2 } from 'lucide-react'
import { shuffleArray, generateId, formatDuration } from '@/lib/utils'
import { getCulturalGameItems } from '@/data/nerCulturalContent'
import { adaptiveEngine, getDefaultGameConfig } from '@/features/adaptiveEngine/AdaptiveCognitiveEngine'
import { saveGameSessionLocally } from '@/lib/indexedDB'
import { DEMO_ELDERLY_PROFILE, generateDemoSessions } from '@/data/demoData'
import { speak } from '@/services/voice/VoiceService'
import type { DifficultyLevel, GameType, GameSession } from '@/types/game.types'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────
interface MemoryCard {
  id: string
  pairId: string
  emoji: string
  name: string
  flipped: boolean
  matched: boolean
}

type GamePhase = 'intro' | 'playing' | 'complete'

// ── Default emoji items (fallback) ──────────────────────────
const DEFAULT_ITEMS = [
  { id: 'i1', emoji: '🍚', name: 'Rice' },
  { id: 'i2', emoji: '🐟', name: 'Fish' },
  { id: 'i3', emoji: '🍵', name: 'Tea' },
  { id: 'i4', emoji: '🐘', name: 'Elephant' },
  { id: 'i5', emoji: '🌊', name: 'River' },
  { id: 'i6', emoji: '🌾', name: 'Rice Field' },
  { id: 'i7', emoji: '🎋', name: 'Bamboo' },
  { id: 'i8', emoji: '🪔', name: 'Lamp' },
  { id: 'i9', emoji: '⛰️', name: 'Mountain' },
  { id: 'i10', emoji: '🎉', name: 'Bihu' },
  { id: 'i11', emoji: '👨‍🍳', name: 'Cooking' },
  { id: 'i12', emoji: '🧺', name: 'Basket' },
]

export function MemoryMatchGame() {
  const { gameType = 'memoryMatch' } = useParams()
  const navigate = useNavigate()
  const profile = DEMO_ELDERLY_PROFILE
  const recentSessions = generateDemoSessions(profile.profileId)

  const difficulty: DifficultyLevel = 2
  const config = getDefaultGameConfig(gameType as GameType, difficulty)

  // Number of pairs = numItems / 2
  const numPairs = Math.min(Math.floor(config.numItems / 2), 6)

  const [phase, setPhase] = useState<GamePhase>('intro')
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [processingFlip, setProcessingFlip] = useState(false)
  const [adaptiveOutput, setAdaptiveOutput] = useState<ReturnType<typeof adaptiveEngine.analyze> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Build card deck ──────────────────────────────────────
  const buildDeck = useCallback(() => {
    const culturalItems = getCulturalGameItems(profile.state, undefined, numPairs)
    const items = culturalItems.length >= numPairs
      ? culturalItems
      : DEFAULT_ITEMS.slice(0, numPairs)

    const pairs: MemoryCard[] = []
    items.forEach((item) => {
      const pairId = item.id
      pairs.push(
        { id: generateId(), pairId, emoji: item.emoji || '🧩', name: item.name, flipped: false, matched: false },
        { id: generateId(), pairId, emoji: item.emoji || '🧩', name: item.name, flipped: false, matched: false }
      )
    })
    return shuffleArray(pairs)
  }, [numPairs, profile.state])

  // ── Start game ───────────────────────────────────────────
  const startGame = () => {
    const deck = buildDeck()
    setCards(deck)
    setMoves(0)
    setMistakes(0)
    setMatchedCount(0)
    setFlippedIds([])
    setHintUsed(false)
    setElapsed(0)
    setPhase('playing')
    setStartTime(Date.now())
    speak('Let\'s play Memory Match! Find all the matching pairs. Take your time!')
  }

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, startTime])

  // ── Check win ─────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'playing' && matchedCount === numPairs && numPairs > 0) {
      setPhase('complete')
      recordSession()
    }
  }, [matchedCount, numPairs, phase])

  // ── Flip card ─────────────────────────────────────────────
  const handleFlip = (cardId: string) => {
    if (processingFlip) return
    if (flippedIds.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.flipped || card.matched) return

    const newFlipped = [...flippedIds, cardId]
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, flipped: true } : c))
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setProcessingFlip(true)
      setMoves((m) => m + 1)
      const [id1, id2] = newFlipped
      const c1 = cards.find((c) => c.id === id1)!
      const c2 = cards.find((c) => c.id === id2) ?? { ...card }

      // Check match after flip
      const updatedC2 = { ...card }
      const card1 = c1
      const card2same = c1.id === cardId ? updatedC2 : card

      setTimeout(() => {
        // re-read from state to get current flipped card
        setCards((prev) => {
          const flippedCards = prev.filter((c) => newFlipped.includes(c.id))
          if (flippedCards.length < 2) return prev
          const [fc1, fc2] = flippedCards
          if (fc1.pairId === fc2.pairId) {
            // Match!
            setMatchedCount((m) => m + 1)
            speak('Match! Well done!')
            setFlippedIds([])
            setProcessingFlip(false)
            return prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, matched: true } : c
            )
          } else {
            // No match
            setMistakes((m) => m + 1)
            setFlippedIds([])
            setProcessingFlip(false)
            return prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, flipped: false } : c
            )
          }
        })
      }, 900)
    }
  }

  // ── Hint ──────────────────────────────────────────────────
  const showHint = () => {
    if (hintUsed) return
    setHintUsed(true)
    // Briefly show all cards
    setCards((prev) => prev.map((c) => ({ ...c, flipped: true })))
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.matched ? c : { ...c, flipped: false }))
      )
    }, 1500)
  }

  // ── Record session ────────────────────────────────────────
  const recordSession = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = numPairs > 0 ? Math.round((matchedCount / numPairs) * 100) : 0
    const avgResponseTime = moves > 0 ? Math.round((duration * 1000) / moves) : 3000

    const session: GameSession = {
      sessionId: generateId(),
      elderlyProfileId: profile.profileId,
      gameType: 'memoryMatch',
      difficulty,
      score: Math.max(0, 100 - mistakes * 5 - (hintUsed ? 10 : 0)),
      accuracy,
      responseTimeAvg: avgResponseTime,
      mistakes,
      attempts: moves,
      sessionDuration: duration,
      timestamp: new Date(),
      synced: false,
    }

    // Run adaptive engine
    const adaptive = adaptiveEngine.analyze({
      accuracy,
      responseTimeAvg: avgResponseTime,
      mistakes,
      attempts: moves,
      sessionDuration: duration,
      previousDifficulty: difficulty,
      gameType: 'memoryMatch',
      recentSessions,
    })
    session.adaptiveOutput = adaptive
    setAdaptiveOutput(adaptive)

    await saveGameSessionLocally(session)
    speak(`Game complete! You matched ${matchedCount} pairs. ${adaptive.explanation}`)
  }

  // ── Grid columns based on numPairs ────────────────────────
  const gridCols = numPairs <= 4 ? 'grid-cols-4' : numPairs <= 6 ? 'grid-cols-4' : 'grid-cols-4'

  // ── INTRO SCREEN ─────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="px-4 py-5 max-w-lg mx-auto animate-fade-in">
        <button onClick={() => navigate('/elderly/games')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-primary">
          <ArrowLeft className="w-5 h-5" /> Back to Games
        </button>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center mb-5">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Memory Match</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Find all matching pairs of cards!
          </p>

          <Card padding="lg" className="text-left mb-6">
            <h3 className="font-semibold text-foreground text-xl mb-3">How to Play</h3>
            <div className="space-y-3">
              {[
                '👆 Tap any card to flip it over',
                '👀 Remember where each picture is',
                '🎯 Find its matching pair',
                '🎉 Match all pairs to win!',
              ].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{step.split(' ')[0]}</span>
                  <p className="text-foreground text-base">{step.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex gap-4 text-sm text-muted-foreground">
              <span>🃏 {numPairs * 2} cards</span>
              <span>⏱ ~5 minutes</span>
              <span>⭐ Level {difficulty}</span>
            </div>
          </Card>

          <div className="flex items-center gap-3 mb-3">
            <Button variant="primary" size="xl" fullWidth onClick={startGame} icon={<Brain className="w-6 h-6" />}>
              START GAME
            </Button>
          </div>
          <button
            onClick={() => speak('Tap any card to flip it over. Try to remember where each picture is. Then find its matching pair. Match all pairs to win!')}
            className="flex items-center justify-center gap-2 w-full text-primary py-2 font-medium"
          >
            <Volume2 className="w-5 h-5" /> Hear Instructions
          </button>
        </div>
      </div>
    )
  }

  // ── GAME SCREEN ──────────────────────────────────────────
  if (phase === 'playing') {
    return (
      <div className="px-3 py-4 max-w-lg mx-auto animate-fade-in">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/elderly/games')} className="text-muted-foreground p-2 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 shadow-sm border border-border/50">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-base font-bold text-foreground">{matchedCount}/{numPairs}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 shadow-sm border border-border/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-base font-mono text-foreground">{formatDuration(elapsed)}</span>
            </div>
            {mistakes > 0 && (
              <div className="flex items-center gap-1 bg-highlight/10 rounded-xl px-2 py-1.5">
                <span className="text-sm text-highlight-500 font-medium">{mistakes} ✗</span>
              </div>
            )}
          </div>

          {config.hintsAvailable && !hintUsed && (
            <button onClick={showHint} className="text-xs bg-accent/15 text-accent-600 px-3 py-2 rounded-xl font-medium hover:bg-accent/25">
              Hint 💡
            </button>
          )}
        </div>

        <p className="text-center text-muted-foreground mb-4 text-base font-medium">
          Match the pairs! Tap to flip a card.
        </p>

        {/* Card Grid */}
        <div className={cn('grid gap-3', gridCols)}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={card.flipped || card.matched || processingFlip}
              className={cn(
                'aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center text-3xl',
                'border-2 shadow-sm active:scale-95',
                card.matched
                  ? 'bg-secondary/15 border-secondary/40 scale-95'
                  : card.flipped
                  ? 'bg-white border-primary/40 shadow-md'
                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40',
              )}
              aria-label={card.flipped || card.matched ? card.name : 'Face-down card'}
            >
              {card.flipped || card.matched ? (
                <span className={cn('transition-all duration-200', card.matched && 'opacity-60')}>
                  {card.emoji}
                </span>
              ) : (
                <span className="text-2xl text-primary/40">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{matchedCount} of {numPairs} pairs</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${numPairs > 0 ? (matchedCount / numPairs) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── COMPLETE SCREEN ───────────────────────────────────────
  if (phase === 'complete') {
    const duration = elapsed
    const accuracy = numPairs > 0 ? Math.round((matchedCount / numPairs) * 100) : 0
    const score = Math.max(0, 100 - mistakes * 5 - (hintUsed ? 10 : 0))

    return (
      <div className="px-4 py-5 max-w-lg mx-auto animate-slide-up">
        {/* Celebration */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-gentle">🎉</div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Activity Complete!</h1>
          <p className="text-muted-foreground text-xl">
            {score >= 80 ? 'Amazing work!' : score >= 60 ? 'Good job!' : 'Keep trying!'}
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Score', value: `${score}`, emoji: '⭐', color: 'text-accent-600' },
            { label: 'Accuracy', value: `${accuracy}%`, emoji: '🎯', color: 'text-secondary' },
            { label: 'Pairs Found', value: `${matchedCount}/${numPairs}`, emoji: '🃏', color: 'text-primary' },
            { label: 'Time Taken', value: formatDuration(duration), emoji: '⏱', color: 'text-muted-foreground' },
          ].map(({ label, value, emoji, color }) => (
            <Card key={label} padding="md" className="text-center">
              <div className="text-3xl mb-1">{emoji}</div>
              <div className={cn('text-2xl font-bold', color)}>{value}</div>
              <div className="text-muted-foreground text-sm">{label}</div>
            </Card>
          ))}
        </div>

        {/* Adaptive engine insight */}
        {adaptiveOutput && (
          <Card variant="primary" padding="md" className="mb-5">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-1">Cogniva's Insight</p>
                <p className="text-base text-muted-foreground">{adaptiveOutput.explanation}</p>
                {adaptiveOutput.nextDifficulty !== difficulty && (
                  <span className="badge-info text-xs mt-2 inline-block">
                    Next level: {adaptiveOutput.nextDifficulty > difficulty ? '↑ Harder' : '↓ Easier'}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Next suggested */}
        {adaptiveOutput && (
          <Card padding="md" className="mb-5 border-secondary/30 bg-secondary/5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Next Suggested Activity</p>
            <p className="text-xl font-semibold text-foreground capitalize">
              {adaptiveOutput.recommendedGame.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </Card>
        )}

        <div className="space-y-3">
          <Button variant="primary" size="xl" fullWidth onClick={startGame} icon={<Brain className="w-6 h-6" />}>
            PLAY AGAIN
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => adaptiveOutput && navigate(`/elderly/games/${adaptiveOutput.recommendedGame}`)}
          >
            Try Next Activity
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={() => navigate('/elderly')}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return null
}
