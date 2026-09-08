// ============================================================
// Elderly Dashboard — Main home screen
// Simple, warm, friendly — understandable in 2-3 seconds
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import {
  Brain, Pill, Droplets, Mic2, Sun, Moon, Sunset,
  ChevronRight, Star, Clock
} from 'lucide-react'
import { getGreeting, formatDate } from '@/lib/utils'
import { DEMO_REMINDERS, DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import type { Reminder } from '@/types/reminder.types'
import { speak, isSpeechSupported } from '@/services/voice/VoiceService'

export function ElderlyDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
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

  const reminderIcon = (type: string) => {
    switch (type) {
      case 'medicine': return '💊'
      case 'hydration': return '💧'
      case 'activity': return '🧠'
      case 'meal': return '🍽️'
      case 'appointment': return '📅'
      default: return '⏰'
    }
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-5 animate-fade-in blob-bg min-h-full">

      {/* ── Greeting ─────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GreetingIcon className="w-6 h-6 text-accent" />
            <p className="text-muted-foreground font-medium">{today}</p>
          </div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            {greeting},<br />
            <span className="text-primary">{profile.greetingName || currentUser?.displayName?.split(' ')[0]}!</span>
            {' '}👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">How are you feeling today?</p>
        </div>
        {/* Avatar */}
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">👴</span>
        </div>
      </div>

      {/* ── Today's Brain Activity ───────────────────── */}
      <Card variant="primary" padding="lg" className="border-l-4 border-l-primary">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today's Brain Activity</p>
            <h2 className="text-2xl font-bold text-foreground">Memory Challenge</h2>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-base">5 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent" />
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
        >
          START TODAY'S GAME
        </Button>

        {isSpeechSupported.synthesis && (
          <button
            onClick={handleVoiceGreeting}
            className="w-full mt-3 flex items-center justify-center gap-2 text-primary font-medium text-base py-2 hover:bg-primary/5 rounded-xl transition-colors"
          >
            <Mic2 className="w-5 h-5" />
            Hear Instructions
          </button>
        )}
      </Card>

      {/* ── Quick Reminders Row ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-foreground">Today's Reminders</h2>
          <button
            onClick={() => navigate('/elderly/reminders')}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeReminders.slice(0, 2).map((reminder) => (
            <ReminderCard key={reminder.reminderId} reminder={reminder} />
          ))}

          {/* Talk to Cogniva — spans full if odd */}
          <div
            className="col-span-2"
            onClick={() => navigate('/elderly/voice')}
          >
            <Card
              clickable
              padding="md"
              className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mic2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg">Talk to Cogniva</p>
                  <p className="text-muted-foreground text-sm">"How can I help you today?"</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── My Progress ─────────────────────────────── */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-foreground">My Progress</h2>
          <span className="badge-success text-sm">This Week</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-primary">7</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-secondary">88%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-accent">↗</div>
            <div className="text-sm text-muted-foreground">Improving</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-secondary font-medium bg-secondary/10 rounded-xl p-2 text-center">
          🌟 Great job! Your memory is getting stronger every day!
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
      className={isDue ? 'border-accent/40 bg-accent/5' : ''}
      onClick={() => navigate('/elderly/reminders')}
    >
      <div className="text-3xl mb-2">{reminder.icon}</div>
      <p className="font-semibold text-foreground text-base leading-tight">{reminder.title}</p>
      <p className="text-muted-foreground text-sm mt-1">
        {reminder.time.padStart(5, '0')} {parseInt(reminder.time) < 12 ? 'AM' : 'PM'}
      </p>
      {isDue && (
        <span className="badge-warning text-xs mt-1 block">Due now</span>
      )}
    </Card>
  )
}
