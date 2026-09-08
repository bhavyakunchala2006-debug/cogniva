// ============================================================
// RememberObjectsGame.tsx — Cognitive Memory Recall Game
// ============================================================

import React, { useState, useEffect } from 'react'
import { getCulturalGameItems, NERItem } from '@/data/nerCulturalContent'
import { shuffleArray, generateId } from '@/lib/utils'
import { adaptiveEngine } from '@/features/adaptiveEngine/AdaptiveCognitiveEngine'
import { saveGameSessionLocally } from '@/lib/indexedDB'
import { speak } from '@/services/voice/VoiceService'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { ArrowLeft, RefreshCw, Trophy, Eye, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { GameSession, SessionMetrics } from '@/types/game.types'

type GamePhase = 'intro' | 'study' | 'recall' | 'result'

export function RememberObjectsGame() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [studyItems, setStudyItems] = useState<NERItem[]>([])
  const [recallOptions, setRecallOptions] = useState<NERItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [timer, setTimer] = useState(5)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [completionTime, setCompletionTime] = useState<number>(0)
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null)

  const state = DEMO_ELDERLY_PROFILE.state || 'Assam'

  const startGame = () => {
    const pool = getCulturalGameItems(state)
    const shuffledPool = shuffleArray(pool)
    const targetItems = shuffledPool.slice(0, 4)
    const distractorItems = shuffledPool.slice(4, 8)

    setStudyItems(targetItems)
    const options = shuffleArray([...targetItems, ...distractorItems])
    setRecallOptions(options)
    setSelectedIds([])
    setTimer(5)
    setPhase('study')
    setStartTime(Date.now())

    speak('Look carefully and remember these 4 objects!')
  }

  useEffect(() => {
    if (phase !== 'study') return
    if (timer <= 0) {
      setPhase('recall')
      speak('Now tap the objects that you just saw!')
      return
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [phase, timer])

  const toggleSelect = (id: string) => {
    if (phase !== 'recall') return
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const submitRecall = async () => {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000)
    setCompletionTime(elapsedSec)

    const targetIds = studyItems.map((item) => item.id)
    let correctCount = 0
    selectedIds.forEach((id) => {
      if (targetIds.includes(id)) correctCount++
    })

    const totalTargets = targetIds.length
    const finalScore = Math.round((correctCount / totalTargets) * 100)
    setScore(finalScore)

    const mistakes = selectedIds.length - correctCount
    const metrics: SessionMetrics = {
      accuracy: finalScore,
      responseTimeAvg: (elapsedSec * 1000) / (selectedIds.length || 1),
      mistakes: Math.max(0, mistakes),
      attempts: selectedIds.length,
      sessionDuration: elapsedSec,
      previousDifficulty: 2,
      gameType: 'rememberObjects',
      recentSessions: [],
    }

    const analysis = adaptiveEngine.analyze(metrics)
    setAdaptiveResult(analysis)

    const session: GameSession = {
      sessionId: generateId(),
      elderlyProfileId: DEMO_ELDERLY_PROFILE.profileId,
      gameType: 'rememberObjects',
      timestamp: new Date(),
      score: finalScore,
      accuracy: finalScore,
      responseTimeAvg: (elapsedSec * 1000) / (selectedIds.length || 1),
      mistakes: Math.max(0, mistakes),
      attempts: selectedIds.length,
      sessionDuration: elapsedSec,
      difficulty: 2,
      synced: false,
      adaptiveOutput: analysis,
    }

    await saveGameSessionLocally(session)
    setPhase('result')
    speak(`Great job! You scored ${finalScore} percent!`)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-4 pt-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={() => navigate('/elderly/games')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> Exit Game
        </Button>
        <span className="font-bold text-teal-800 text-lg">Remember Objects</span>
        <div className="w-20" />
      </div>

      {phase === 'intro' && (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-4xl text-teal-700">
            <Eye className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Remember Objects</h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            You will see 4 items for 5 seconds. Remember them well, and then select them from a group!
          </p>
          <Button
            size="lg"
            onClick={startGame}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xl px-10 py-6 rounded-2xl shadow-lg"
          >
            Start Game
          </Button>
        </Card>
      )}

      {phase === 'study' && (
        <Card className="p-8 text-center bg-teal-50/70 border-teal-300 shadow-md space-y-6">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-inner border border-teal-200">
            <span className="text-lg font-bold text-teal-800">Memorize these items:</span>
            <span className="text-2xl font-black text-rose-600 animate-pulse">{timer}s</span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {studyItems.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white rounded-2xl border-2 border-teal-300 shadow-md flex flex-col items-center justify-center transform hover:scale-105 transition-all"
              >
                <span className="text-6xl mb-2">{item.emoji}</span>
                <span className="text-xl font-bold text-slate-800">{item.name}</span>
                <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full mt-1">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          <p className="text-slate-600 italic">Timer running... Keep these pictures in your mind!</p>
        </Card>
      )}

      {phase === 'recall' && (
        <Card className="p-6 bg-white border-teal-200 shadow-md space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-slate-800">Which objects did you see?</h3>
            <p className="text-slate-600">Tap the 4 items you remember seeing earlier:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recallOptions.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 ring-4 ring-teal-200 scale-105'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-5xl mb-2">{item.emoji}</span>
                  <span className="font-bold text-slate-800 text-base">{item.name}</span>
                </button>
              )
            })}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={submitRecall}
              disabled={selectedIds.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-lg"
            >
              Check Answers ({selectedIds.length} selected)
            </Button>
          </div>
        </Card>
      )}

      {phase === 'result' && (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-slate-800">Activity Complete!</h3>
            <p className="text-slate-600 text-lg">You scored {score}% accuracy in {completionTime} seconds</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-left">
            <h4 className="font-bold text-slate-700 text-sm">Correct Objects:</h4>
            <div className="flex flex-wrap gap-2">
              {studyItems.map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-bold flex items-center gap-1 text-sm"
                >
                  {item.emoji} {item.name}
                </span>
              ))}
            </div>
          </div>

          {adaptiveResult && (
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Adaptive AI Observation
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{adaptiveResult.explanation}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" onClick={startGame} className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2">
              <RefreshCw className="w-5 h-5" /> Play Again
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
