// ============================================================
// Elderly Dashboard — Main home screen
// Simple, warm, friendly — understandable in 2-3 seconds
// Multilingual i18n & Voice support
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import {
  Brain, Mic2, Sun, Moon, Sunset,
  ChevronRight, Star, Clock
} from 'lucide-react'
import { getGreeting, formatDate } from '@/lib/utils'
import { DEMO_REMINDERS, DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import type { Reminder } from '@/types/reminder.types'
import { speak, isSpeechSupported } from '@/services/voice/VoiceService'
import { useTranslation } from 'react-i18next'

export function ElderlyDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const greeting = getGreeting()
  const today = formatDate(new Date())
  const profile = DEMO_ELDERLY_PROFILE

  // Today's reminders (first 3)
  const activeReminders = DEMO_REMINDERS.filter((r) => r.active).slice(0, 3)

  // Greeting icon
  const GreetingIcon = greeting === 'Good Morning' ? Sun
    : greeting === 'Good Afternoon' ? Sunset
    : Moon

  const handleVoiceGreeting = () => {
    const msg = `${greeting}, ${profile.name}! Welcome to Cogniva. Today is ${today}. You have ${activeReminders.length} reminders. Would you like to start your brain activity?`
    speak(msg)
  }

  const handleStartGame = () => navigate('/elderly/games/memoryMatch')

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-5 animate-fade-in blob-bg min-h-full">

      {/* ── Greeting ─────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GreetingIcon className="w-6 h-6 text-amber-500" />
            <p className="text-slate-500 font-medium">{today}</p>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 leading-tight">
            {greeting},<br />
            <span className="text-teal-600">{profile.greetingName || currentUser?.displayName?.split(' ')[0]}!</span>
            {' '}👋
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            {t('dashboard.howFeeling', { defaultValue: 'How are you feeling today?' })}
          </p>
        </div>
        {/* Avatar */}
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">👴</span>
        </div>
      </div>

      {/* ── Today's Brain Activity ───────────────────── */}
      <Card variant="primary" padding="lg" className="border-l-4 border-l-teal-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {t('dashboard.todayBrainActivity', { defaultValue: "Today's Brain Activity" })}
            </p>
            <h2 className="text-2xl font-bold text-slate-800">
              {t('dashboard.memoryChallenge', { defaultValue: 'Memory Challenge' })}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-base">5 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-base">Level 2</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleStartGame}
          icon={<Brain className="w-6 h-6" />}
          id="start-game-btn"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
        >
          {t('dashboard.startTodayGame', { defaultValue: "START TODAY'S GAME" })}
        </Button>

        {isSpeechSupported.synthesis && (
          <button
            onClick={handleVoiceGreeting}
            className="w-full mt-3 flex items-center justify-center gap-2 text-teal-700 font-medium text-base py-2 hover:bg-teal-50 rounded-xl transition-colors"
          >
            <Mic2 className="w-5 h-5" />
            {t('dashboard.hearInstructions', { defaultValue: 'Hear Instructions' })}
          </button>
        )}
      </Card>

      {/* ── Quick Reminders Row ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-800">
            {t('reminders.title', { defaultValue: "Today's Reminders" })}
          </h2>
          <button
            onClick={() => navigate('/elderly/reminders')}
            className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            {t('dashboard.seeAll', { defaultValue: 'See all' })} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeReminders.slice(0, 2).map((reminder) => (
            <ReminderCard key={reminder.reminderId} reminder={reminder} />
          ))}

          {/* Talk to Cogniva — spans full width */}
          <div
            className="col-span-2"
            onClick={() => navigate('/elderly/voice')}
          >
            <Card
              clickable
              padding="md"
              className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Mic2 className="w-6 h-6 text-teal-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-lg">
                    {t('voice.title', { defaultValue: 'Talk to Cogniva' })}
                  </p>
                  <p className="text-slate-500 text-sm">
                    "{t('voice.prompt', { defaultValue: 'How can I help you today?' })}"
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── My Progress ─────────────────────────────── */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-800">
            {t('dashboard.myProgress', { defaultValue: 'My Progress' })}
          </h2>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
            {t('dashboard.thisWeek', { defaultValue: 'This Week' })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-teal-600">7</div>
            <div className="text-sm text-slate-500">
              {t('dashboard.sessions', { defaultValue: 'Sessions' })}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-emerald-600">88%</div>
            <div className="text-sm text-slate-500">
              {t('dashboard.accuracy', { defaultValue: 'Accuracy' })}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-amber-500">↗</div>
            <div className="text-sm text-slate-500">
              {t('dashboard.improving', { defaultValue: 'Improving' })}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-800 font-medium bg-teal-50 rounded-xl p-2 text-center">
          🌟 {t('dashboard.encouragement', { defaultValue: 'Great job! Your memory is getting stronger every day!' })}
        </p>
      </Card>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  )
}

// ── Reminder mini-card ──────────────────────────────────────
function ReminderCard({ reminder }: { reminder: Reminder }) {
  const navigate = useNavigate()
  const now = new Date()
  const [hour, min] = reminder.time.split(':').map(Number)
  const reminderTime = new Date()
  reminderTime.setHours(hour, min, 0)
  const isDue = Math.abs(now.getTime() - reminderTime.getTime()) < 30 * 60 * 1000

  return (
    <Card
      clickable
      padding="sm"
      className={isDue ? 'border-amber-300 bg-amber-50' : ''}
      onClick={() => navigate('/elderly/reminders')}
    >
      <div className="text-3xl mb-2">{reminder.icon}</div>
      <p className="font-semibold text-slate-800 text-base leading-tight">{reminder.title}</p>
      <p className="text-slate-500 text-sm mt-1">
        {reminder.time.padStart(5, '0')} {parseInt(reminder.time) < 12 ? 'AM' : 'PM'}
      </p>
      {isDue && (
        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold mt-1 inline-block">
          Due now
        </span>
      )}
    </Card>
  )
}
