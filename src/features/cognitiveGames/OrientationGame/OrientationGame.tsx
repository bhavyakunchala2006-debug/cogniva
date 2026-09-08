// ============================================================
// OrientationGame.tsx — Reality & Time Orientation Exercise
// ============================================================

import React, { useState } from 'react'
import { adaptiveEngine } from '@/features/adaptiveEngine/AdaptiveCognitiveEngine'
import { saveGameSessionLocally } from '@/lib/indexedDB'
import { generateId } from '@/lib/utils'
import { speak } from '@/services/voice/VoiceService'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { ArrowLeft, Sun, Trophy, Sparkles, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { GameSession, SessionMetrics } from '@/types/game.types'

interface Question {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function OrientationGame() {
  const navigate = useNavigate()
  const today = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const currentDay = days[today.getDay()]
  const currentMonth = months[today.getMonth()]

  const questions: Question[] = [
    {
      id: 1,
      prompt: 'What day of the week is it today?',
      options: [currentDay, days[(today.getDay() + 2) % 7], days[(today.getDay() + 4) % 7]],
      correctIndex: 0,
      explanation: `Today is indeed ${currentDay}.`,
    },
    {
      id: 2,
      prompt: 'What month of the year are we currently in?',
      options: [currentMonth, months[(today.getMonth() + 3) % 12], months[(today.getMonth() + 6) % 12]],
      correctIndex: 0,
      explanation: `We are currently in ${currentMonth}.`,
    },
    {
      id: 3,
      prompt: 'Which region of India is known for Assam Tea and Kaziranga?',
      options: ['North Eastern Region', 'Southern Region', 'Western Desert'],
      correctIndex: 0,
      explanation: 'The North Eastern Region (NER) is famous for tea gardens and wild fauna!',
    },
    {
      id: 4,
      prompt: 'What time of day is it right now?',
      options: [
        today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening',
        today.getHours() < 12 ? 'Evening' : 'Morning',
        'Midnight',
      ],
      correctIndex: 0,
      explanation: 'That fits our current daylight clock!',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null)

  const currentQ = questions[currentIndex]

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null) return
    setSelectedOption(optionIndex)

    const isCorrect = optionIndex === currentQ.correctIndex
    if (isCorrect) {
      setScore((prev) => prev + 25)
      setFeedback(`Wonderful! ${currentQ.explanation}`)
      speak(`Wonderful! ${currentQ.explanation}`)
    } else {
      setFeedback(`Thank you for trying! ${currentQ.explanation}`)
      speak(`Thank you for trying! ${currentQ.explanation}`)
    }
  }

  const handleNext = async () => {
    setSelectedOption(null)
    setFeedback(null)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 25 : 0)
      const mistakes = questions.length - Math.round(finalScore / 25)

      const metrics: SessionMetrics = {
        accuracy: finalScore,
        responseTimeAvg: 3000,
        mistakes,
        attempts: questions.length,
        sessionDuration: 45,
        previousDifficulty: 1,
        gameType: 'orientationGame',
        recentSessions: [],
      }

      const analysis = adaptiveEngine.analyze(metrics)
      setAdaptiveResult(analysis)

      const session: GameSession = {
        sessionId: generateId(),
        elderlyProfileId: DEMO_ELDERLY_PROFILE.profileId,
        gameType: 'orientationGame',
        timestamp: new Date(),
        score: finalScore,
        accuracy: finalScore,
        responseTimeAvg: 3000,
        mistakes,
        attempts: questions.length,
        sessionDuration: 45,
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
        <span className="font-bold text-teal-800 text-lg">Daily Orientation Check</span>
        <div className="w-20" />
      </div>

      {!isCompleted ? (
        <Card className="p-8 bg-white border-teal-200 shadow-md space-y-6">
          <div className="flex justify-between items-center text-sm font-bold text-teal-700 bg-teal-50 p-3 rounded-xl border border-teal-200">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Sun className="w-4 h-4 text-amber-500" /> Gentle Exercise
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
            {currentQ.prompt}
          </h2>

          <div className="space-y-4 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = idx === currentQ.correctIndex

              let btnStyle = 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-teal-50'
              if (selectedOption !== null) {
                if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                else if (isSelected) btnStyle = 'border-rose-300 bg-rose-50 text-rose-800'
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-5 rounded-2xl border-2 text-xl text-left transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 font-medium text-lg">
              {feedback}
            </div>
          )}

          {selectedOption !== null && (
            <div className="flex justify-center pt-2">
              <Button size="lg" onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-8 py-4">
                {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Activity'}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Trophy className="w-12 h-12" />
          </div>

          <h3 className="text-3xl font-bold text-slate-800">Activity Completed!</h3>
          <p className="text-slate-600 text-lg">You scored {score}% accuracy</p>

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
