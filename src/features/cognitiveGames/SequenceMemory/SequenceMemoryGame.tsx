// ============================================================
// SequenceMemoryGame.tsx — Pattern & Order Memory Game
// ============================================================

import React, { useState } from 'react'
import { getCulturalGameItems, NERItem } from '@/data/nerCulturalContent'
import { shuffleArray, generateId } from '@/lib/utils'
import { adaptiveEngine } from '@/features/adaptiveEngine/AdaptiveCognitiveEngine'
import { saveGameSessionLocally } from '@/lib/indexedDB'
import { speak } from '@/services/voice/VoiceService'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { ArrowLeft, RefreshCw, Trophy, Sparkles, Repeat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { GameSession, SessionMetrics } from '@/types/game.types'

type Phase = 'intro' | 'playback' | 'user_input' | 'result'

export function SequenceMemoryGame() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('intro')
  const [sequence, setSequence] = useState<NERItem[]>([])
  const [userSequence, setUserSequence] = useState<string[]>([])
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
  const [pool, setPool] = useState<NERItem[]>([])
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null)

  const state = DEMO_ELDERLY_PROFILE.state || 'Assam'

  const startGame = () => {
    const culturalItems = getCulturalGameItems(state).slice(0, 6)
    setPool(culturalItems)
    setRound(1)
    setScore(0)
    setStartTime(Date.now())
    startRound(1, culturalItems)
  }

  const startRound = (roundNum: number, itemsPool: NERItem[]) => {
    const seqLength = roundNum + 2
    const newSeq: NERItem[] = []
    for (let i = 0; i < seqLength; i++) {
      const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)]
      newSeq.push(randomItem)
    }

    setSequence(newSeq)
    setUserSequence([])
    setActiveItemIndex(null)
    setPhase('playback')

    speak(`Watch the sequence of ${seqLength} items!`)
    playSequenceAnimation(newSeq)
  }

  const playSequenceAnimation = async (seq: NERItem[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setActiveItemIndex(i)
      speak(seq[i].name)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActiveItemIndex(null)
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPhase('user_input')
    speak('Your turn! Tap the items in the same order.')
  }

  const handleUserTap = (item: NERItem) => {
    if (phase !== 'user_input') return

    const expectedIndex = userSequence.length
    const expectedItem = sequence[expectedIndex]

    if (item.id === expectedItem.id) {
      const nextUserSeq = [...userSequence, item.id]
      setUserSequence(nextUserSeq)

      if (nextUserSeq.length === sequence.length) {
        const newScore = score + 25
        setScore(newScore)

        if (round >= 3) {
          finishGame(newScore)
        } else {
          speak('Correct! Moving to next round.')
          const nextRound = round + 1
          setRound(nextRound)
          setTimeout(() => startRound(nextRound, pool), 1200)
        }
      }
    } else {
      speak('Oops, that was not the next item. Let us see how you did!')
      finishGame(score)
    }
  }

  const finishGame = async (finalScore: number) => {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000)
    const normScore = Math.min(finalScore, 100)

    const metrics: SessionMetrics = {
      accuracy: normScore,
      responseTimeAvg: 2000,
      mistakes: 1,
      attempts: round * 3,
      sessionDuration: elapsedSec,
      previousDifficulty: 2,
      gameType: 'sequenceMemory',
      recentSessions: [],
    }

    const analysis = adaptiveEngine.analyze(metrics)
    setAdaptiveResult(analysis)

    const session: GameSession = {
      sessionId: generateId(),
      elderlyProfileId: DEMO_ELDERLY_PROFILE.profileId,
      gameType: 'sequenceMemory',
      timestamp: new Date(),
      score: normScore,
      accuracy: normScore,
      responseTimeAvg: 2000,
      mistakes: 1,
      attempts: round * 3,
      sessionDuration: elapsedSec,
      difficulty: 2,
      synced: false,
      adaptiveOutput: analysis,
    }

    await saveGameSessionLocally(session)
    setPhase('result')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-4 pt-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={() => navigate('/elderly/games')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> Exit Game
        </Button>
        <span className="font-bold text-teal-800 text-lg">Sequence Memory</span>
        <div className="w-20" />
      </div>

      {phase === 'intro' && (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-4xl text-teal-700">
            <Repeat className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Sequence Memory</h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            Watch the flashing items in order, then tap them back in the exact same sequence!
          </p>
          <Button
            size="lg"
            onClick={startGame}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xl px-10 py-6 rounded-2xl shadow-lg"
          >
            Start Sequence Game
          </Button>
        </Card>
      )}

      {(phase === 'playback' || phase === 'user_input') && (
        <Card className="p-6 bg-white border-teal-200 shadow-md space-y-6 text-center">
          <div className="flex justify-between items-center bg-teal-50 p-3 rounded-xl border border-teal-200 font-bold">
            <span className="text-teal-800 text-lg">Round {round} of 3</span>
            <span className="text-amber-600 text-lg">Score: {score}</span>
          </div>

          <p className="text-xl font-bold text-slate-800">
            {phase === 'playback'
              ? 'Watch closely! Remembering sequence...'
              : `Tap sequence item ${userSequence.length + 1} of ${sequence.length}`}
          </p>

          <div className="grid grid-cols-3 gap-4 my-6">
            {pool.map((item) => {
              const activeIndexInSeq = activeItemIndex !== null ? sequence[activeItemIndex]?.id === item.id : false

              return (
                <button
                  key={item.id}
                  disabled={phase === 'playback'}
                  onClick={() => handleUserTap(item)}
                  className={`p-6 rounded-2xl border-3 transition-all flex flex-col items-center justify-center transform active:scale-95 ${
                    activeIndexInSeq
                      ? 'bg-amber-300 border-amber-500 ring-8 ring-amber-200 scale-110 shadow-2xl'
                      : 'bg-slate-50 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                  }`}
                >
                  <span className="text-5xl mb-2">{item.emoji}</span>
                  <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                </button>
              )
            })}
          </div>

          {phase === 'user_input' && (
            <p className="text-slate-500 text-sm italic">
              Tap the items in the order they flashed above.
            </p>
          )}
        </Card>
      )}

      {phase === 'result' && (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <Trophy className="w-12 h-12" />
          </div>

          <h3 className="text-3xl font-bold text-slate-800">Round Completed!</h3>
          <p className="text-slate-600 text-lg">Final Score: {score} Points</p>

          {adaptiveResult && (
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Adaptive Insights
              </div>
              <p className="text-slate-700 text-sm">{adaptiveResult.explanation}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" onClick={startGame} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
              <RefreshCw className="w-5 h-5 mr-2" /> Try Again
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/elderly/games')}>
              Return to Games
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
