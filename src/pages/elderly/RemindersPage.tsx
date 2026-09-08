// ============================================================
// RemindersPage — Elderly user daily reminder management
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DEMO_REMINDERS } from '@/data/demoData'
import { speak } from '@/services/voice/VoiceService'
import { cn } from '@/lib/utils'
import type { Reminder } from '@/types/reminder.types'
import { ArrowLeft, CheckCircle2, Clock, SkipForward } from 'lucide-react'

// ── Extended local state per reminder ────────────────────────
type ReminderStatus = 'pending' | 'confirmed' | 'skipped'

interface ReminderState extends Reminder {
  status: ReminderStatus
  animating: boolean
}

// ── Helper: format 24h time to 12h AM/PM ─────────────────────
function formatTime(time: string): string {
  const [hourStr, min] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${min} ${ampm}`
}

// ── Helper: type to spoken label ─────────────────────────────
function typeLabel(type: string): string {
  switch (type) {
    case 'medicine': return 'Medicine'
    case 'hydration': return 'Water'
    case 'activity': return 'Activity'
    case 'meal': return 'Meal'
    case 'appointment': return 'Appointment'
    default: return type
  }
}

// ── Success flash overlay ─────────────────────────────────────
function SuccessFlash({ show }: { show: boolean }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500',
        show ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="bg-secondary/90 rounded-3xl px-10 py-8 flex flex-col items-center shadow-2xl">
        <span className="text-6xl mb-2">✅</span>
        <p className="text-white text-2xl font-bold">Done! Great job!</p>
      </div>
    </div>
  )
}

// ── All-done celebration screen ───────────────────────────────
function CelebrationScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    speak('All done for today! Great job! You completed all your reminders.')
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-fade-in">
      <div className="text-8xl mb-6 animate-bounce">🎉</div>
      <div className="w-24 h-24 rounded-full bg-secondary/15 border-4 border-secondary flex items-center justify-center mb-6">
        <CheckCircle2 className="w-14 h-14 text-secondary" />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-3">All done for today!</h1>
      <p className="text-2xl text-secondary font-semibold mb-2">Great job! 🌟</p>
      <p className="text-muted-foreground text-lg mb-10">
        You completed all your reminders. Keep up the wonderful routine!
      </p>
      <Button variant="primary" size="xl" onClick={onBack} fullWidth>
        Back to Home
      </Button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export function RemindersPage() {
  const navigate = useNavigate()

  const [reminders, setReminders] = useState<ReminderState[]>(() =>
    DEMO_REMINDERS.map((r) => ({ ...r, status: 'pending', animating: false }))
  )
  const [flashVisible, setFlashVisible] = useState(false)

  const total = reminders.length
  const completed = reminders.filter((r) => r.status === 'confirmed').length
  const skipped = reminders.filter((r) => r.status === 'skipped').length
  const allDone = completed + skipped === total && total > 0
  const allConfirmed = completed === total && total > 0

  // ── Speak greeting on mount ───────────────────────────────
  useEffect(() => {
    speak(`You have ${total} reminders today. ${completed} completed so far.`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle DONE ───────────────────────────────────────────
  const handleDone = (reminderId: string) => {
    const reminder = reminders.find((r) => r.reminderId === reminderId)
    if (!reminder || reminder.status !== 'pending') return

    // Animate card
    setReminders((prev) =>
      prev.map((r) =>
        r.reminderId === reminderId ? { ...r, animating: true } : r
      )
    )

    // Show global flash
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 1200)

    // Voice confirmation
    speak(`${reminder.title} marked as done. Well done!`)

    // Mark confirmed after short animation delay
    setTimeout(() => {
      setReminders((prev) =>
        prev.map((r) =>
          r.reminderId === reminderId
            ? { ...r, status: 'confirmed', animating: false }
            : r
        )
      )
    }, 400)
  }

  // ── Handle SKIP ───────────────────────────────────────────
  const handleSkip = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.reminderId === reminderId ? { ...r, status: 'skipped' } : r
      )
    )
  }

  // ── Celebration screen (all confirmed via DONE button) ────
  if (allConfirmed) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] px-4 py-6 max-w-lg mx-auto">
        <CelebrationScreen onBack={() => navigate('/elderly/home')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] px-4 py-6 max-w-lg mx-auto">
      <SuccessFlash show={flashVisible} />

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/elderly/home')}
          className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Today's Reminders</h1>
          <p className="text-muted-foreground text-base">Stay on track — you're doing great!</p>
        </div>
      </div>

      {/* ── Progress summary card ── */}
      <Card variant="secondary" padding="md" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-base">Completed today</p>
            <p className="text-4xl font-bold text-secondary">
              {completed}
              <span className="text-2xl text-muted-foreground font-medium"> / {total}</span>
            </p>
          </div>

          {/* Progress ring */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="#70B77E"
                strokeWidth="6"
                strokeDasharray={`${Math.round((completed / Math.max(total, 1)) * 175.9)} 175.9`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-secondary">
              {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 rounded-full bg-secondary/20 overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-700"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </Card>

      {/* ── All done (with skips) banner ── */}
      {allDone && !allConfirmed && (
        <Card variant="accent" padding="md" className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-foreground text-lg">All done for today!</p>
              <p className="text-muted-foreground text-sm">{skipped} reminder(s) were skipped</p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Reminders list ── */}
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const isDone = reminder.status === 'confirmed'
          const isSkipped = reminder.status === 'skipped'
          const isPending = reminder.status === 'pending'

          return (
            <Card
              key={reminder.reminderId}
              variant={isDone ? 'secondary' : isSkipped ? 'default' : 'elevated'}
              padding="lg"
              className={cn(
                'transition-all duration-500',
                reminder.animating && 'scale-[0.97] opacity-70',
                isDone && 'border-secondary/40',
                isSkipped && 'opacity-60'
              )}
            >
              {/* Reminder info row */}
              <div className="flex items-start gap-4 mb-4">
                {/* Icon badge */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0',
                    isDone
                      ? 'bg-secondary/20'
                      : isSkipped
                      ? 'bg-muted/30'
                      : 'bg-accent/20'
                  )}
                >
                  {isDone ? '✅' : isSkipped ? '⏭️' : (reminder.icon || '🔔')}
                </div>

                {/* Title + time + instructions */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3
                      className={cn(
                        'text-xl font-bold',
                        isDone
                          ? 'text-secondary line-through'
                          : isSkipped
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      )}
                    >
                      {reminder.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {typeLabel(reminder.type)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-lg font-semibold">{formatTime(reminder.time)}</span>
                  </div>

                  <p className="text-base text-foreground/80 leading-snug">
                    {reminder.instructions}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              {isDone && (
                <div className="flex items-center gap-2 text-secondary font-semibold text-lg mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  Completed! 🌟
                </div>
              )}
              {isSkipped && (
                <div className="flex items-center gap-2 text-muted-foreground font-medium text-base mb-1">
                  <SkipForward className="w-4 h-4" />
                  Skipped
                </div>
              )}

              {/* Action buttons — only for pending reminders */}
              {isPending && (
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1 min-h-[56px] text-xl font-bold"
                    onClick={() => handleDone(reminder.reminderId)}
                  >
                    DONE ✓
                  </Button>
                  <button
                    onClick={() => handleSkip(reminder.reminderId)}
                    className="px-5 py-3 rounded-2xl border-2 border-border text-muted-foreground font-medium text-base hover:bg-muted/10 transition-colors min-h-[56px] min-w-[80px]"
                  >
                    Skip
                  </button>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <div className="h-10" />
    </div>
  )
}
