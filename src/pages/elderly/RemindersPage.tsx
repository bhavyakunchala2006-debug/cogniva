// ============================================================
// RemindersPage.tsx — Elderly Reminder Management Page
// Multilingual i18n & Voice Confirmation Support
// ============================================================

import React, { useState } from 'react'
import { DEMO_REMINDERS } from '@/data/demoData'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { speak } from '@/services/voice/VoiceService'
import { CheckCircle2, Clock, Bell, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function RemindersPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [reminders, setReminders] = useState<any[]>(DEMO_REMINDERS)

  const handleConfirm = (id: string, title: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.reminderId === id ? { ...r, status: 'confirmed' as const } : r))
    )
    speak(`Thank you for confirming your ${title}! Great job!`)
  }

  const completedCount = reminders.filter((r) => r.status === 'confirmed').length
  const totalCount = reminders.length

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={() => navigate('/elderly')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> {t('common.back', { defaultValue: 'Back' })}
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Bell className="w-7 h-7 text-amber-500" />
          {t('reminders.title', { defaultValue: "Today's Reminders" })}
        </h1>
        <div className="w-20" />
      </div>

      {/* Overview Banner */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-teal-50 border-amber-200 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            {completedCount === totalCount
              ? t('reminders.allDone', { defaultValue: 'All done for today! 🎉' })
              : `${completedCount} of ${totalCount} ${t('reminders.doneCount', { defaultValue: 'Reminders Done' })}`}
          </h2>
          <p className="text-slate-600 text-sm">
            {t('reminders.subtitle', { defaultValue: 'Cogniva keeps your daily routine and medicines on track' })}
          </p>
        </div>
        <div className="text-3xl font-black text-teal-700 bg-white px-4 py-2 rounded-2xl shadow-sm border border-teal-200">
          {completedCount}/{totalCount}
        </div>
      </Card>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((r) => {
          const isDone = r.status === 'confirmed'
          return (
            <Card
              key={r.reminderId}
              className={`p-6 transition-all border-2 ${
                isDone ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {r.type === 'medicine' ? '💊' : r.type === 'hydration' ? '💧' : '🧠'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{r.title}</h3>
                    <p className="text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4 text-teal-600" /> {r.scheduledTime || r.time}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">{r.instructions}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                  {isDone ? (
                    <span className="px-6 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-2xl flex items-center gap-2 text-lg border border-emerald-300">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" /> {t('reminders.completed', { defaultValue: 'Completed' })}
                    </span>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => handleConfirm(r.reminderId, r.title)}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-md gap-2"
                    >
                      <CheckCircle2 className="w-6 h-6" /> {t('reminders.doneBtn', { defaultValue: 'DONE ✓' })}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
