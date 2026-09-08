// ============================================================
// LanguageGame.tsx — Word & Naming Practice Game
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
import { ArrowLeft, BookOpen, Trophy, Sparkles, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { GameSession, SessionMetrics } from '@/types/game.types'

export function LanguageGame() {
  const navigate = useNavigate()
  const state = DEMO_ELDERLY_PROFILE.state || 'Assam'

  const [items] = useState<NERItem[]>(() => shuffleArray(getCulturalGameItems(state)).slice(0, 5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null)

  const currentItem = items[currentIndex]

  const options = React.useMemo(() => {
    if (!currentItem) return []
    const distractors = items
      .filter((i) => i.id !== currentItem.id)
      .map((i) => i.name)
    return shuffleArray([currentItem.name, ...distractors.slice(0, 3)])
  }, [currentItem, items])

  const handleSelect = (name: string) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(name)

    const isCorrect = name === currentItem.name
    if (isCorrect) {
      setScore((prev) => prev + 20)
      speak(`Correct! This is a ${currentItem.name}.`)
    } else {
      speak(`That is okay! This picture shows a ${currentItem.name}.`)
    }
  }

  const handleNext = async () => {
    setSelectedAnswer(null)
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      const finalScore = score + (selectedAnswer === currentItem.name ? 20 : 0)
      const mistakes = items.length - Math.round(finalScore / 20)

      const metrics: SessionMetrics = {
        accuracy: finalScore,
        responseTimeAvg: 2500,
        mistakes,
        attempts: items.length,
        sessionDuration: 50,
        previousDifficulty: 1,
        gameType: 'languageGame',
        recentSessions: [],
      }

      const analysis = adaptiveEngine.analyze(metrics)
      setAdaptiveResult(analysis)

      const session: GameSession = {
        sessionId: generateId(),
        elderlyProfileId: DEMO_ELDERLY_PROFILE.profileId,
        gameType: 'languageGame',
        timestamp: new Date(),
        score: finalScore,
        accuracy: finalScore,
        responseTimeAvg: 2500,
        mistakes,
        attempts: items.length,
        sessionDuration: 50,
        difficulty: 1,
        synced: false,
        adaptiveOutput: analysis,
      }

      await saveGameSessionLocally(session)
      setIsCompleted(true)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-4 pt-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={() => navigate('/elderly/games')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> Exit Game
        </Button>
        <span className="font-bold text-teal-800 text-lg">Language & Word Naming</span>
        <div className="w-20" />
      </div>

      {!isCompleted && currentItem ? (
        <Card className="p-8 bg-white border-teal-200 shadow-md text-center space-y-6">
          <div className="flex justify-between items-center text-sm font-bold text-teal-700 bg-teal-50 p-3 rounded-xl border border-teal-200">
            <span>Item {currentIndex + 1} of {items.length}</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-teal-600" /> Word Practice
            </span>
          </div>

          <div className="my-4">
            <span className="text-8xl block mb-4">{currentItem.emoji}</span>
            <p className="text-slate-600 text-xl font-medium">{currentItem.description}</p>
          </div>

          <h3 className="text-2xl font-bold text-slate-800">What is this picture called?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((optName, idx) => {
              const isSelected = selectedAnswer === optName
              const isCorrect = optName === currentItem.name

              let btnStyle = 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-teal-50'
              if (selectedAnswer !== null) {
                if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                else if (isSelected) btnStyle = 'border-rose-300 bg-rose-50 text-rose-800'
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelect(optName)}
                  className={`p-5 rounded-2xl border-2 text-xl font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{optName}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-8 py-4">
                {currentIndex + 1 < items.length ? 'Next Picture' : 'View Results'}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <Trophy className="w-12 h-12" />
          </div>

          <h3 className="text-3xl font-bold text-slate-800">Activity Completed!</h3>
          <p className="text-slate-600 text-lg">Score: {score}% accuracy</p>

          {adaptiveResult && (
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Adaptive Insights
              </div>
              <p className="text-slate-700 text-sm">{adaptiveResult.explanation}</p>
            </div>
          )}

          <Button size="lg" onClick={() => navigate('/elderly/games')} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8">
            Back to Cognitive Games
          </Button>
        </Card>
      )}
    </div>
  )
}
