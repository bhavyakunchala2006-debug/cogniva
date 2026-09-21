// ============================================================
// ProfilePage.tsx — Elderly User Profile & i18n Preferences Page
// Handles immediate language switching, persistence to localStorage,
// and synchronized Voice / AI locale updates.
// ============================================================

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { User, LogOut, Globe, Type, Shield, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setSpeechLocale, speak } from '@/services/voice/VoiceService'

export function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [largeText, setLargeText] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  const profile = DEMO_ELDERLY_PROFILE

  const changeLanguage = (langCode: string) => {
    // 1. Update i18next global language
    i18n.changeLanguage(langCode)

    // 2. Persist to localStorage as required by prompt
    localStorage.setItem('cogniva_language', langCode)

    // 3. Update voice STT / TTS service locale
    setSpeechLocale(langCode)

    // 4. Feedback confirmation
    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      as: 'Assamese (অসমীয়া)',
      mni: 'Manipuri (মৈতৈলোন্)',
    }
    const selectedName = langNames[langCode] || langCode
    const msg = `Language updated to ${selectedName}`
    setSaveSuccessMsg(msg)
    speak(msg)

    setTimeout(() => {
      setSaveSuccessMsg('')
    }, 3500)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/elderly')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> {t('common.back', { defaultValue: 'Back' })}
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <User className="w-7 h-7 text-teal-600" />
          {t('profile.title', { defaultValue: 'My Profile & Settings' })}
        </h1>
        <div className="w-20" />
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-3 animate-fade-in font-medium text-lg">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          {saveSuccessMsg}
        </div>
      )}

      {/* User Info Card */}
      <Card className="p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-teal-600 text-white flex items-center justify-center text-4xl shadow-md font-bold">
          {currentUser?.displayName?.[0]?.toUpperCase() || 'P'}
        </div>
        <div className="text-center md:text-left space-y-1 flex-1">
          <h2 className="text-2xl font-bold text-slate-800">
            {currentUser?.displayName || profile.name}
          </h2>
          <p className="text-slate-600 font-medium flex items-center justify-center md:justify-start gap-1">
            <MapPin className="w-4 h-4 text-teal-600" /> {t('profile.state', { defaultValue: 'State' })}: {profile.state} (NER)
          </p>
          <p className="text-slate-500 text-sm">
            {t('profile.ageGroup', { defaultValue: 'Age group: 70-75 years' })} | {t('profile.nativeLang', { defaultValue: 'Native language' })}: {profile.preferredLanguage}
          </p>
        </div>
      </Card>

      {/* Language Preferences */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Globe className="w-6 h-6 text-teal-600" />
          {t('profile.languageTitle', { defaultValue: 'Preferred Language' })}
        </h3>
        <p className="text-slate-600">
          {t('profile.languageDesc', { defaultValue: 'Choose the language for games, voice assistant, and application screens:' })}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'Hindi (हिंदी)' },
            { code: 'as', label: 'Assamese (অসমীয়া)' },
            { code: 'mni', label: 'Manipuri (মৈতৈলোন্)' },
          ].map((lang) => {
            const isSelected = i18n.language === lang.code
            return (
              <Button
                key={lang.code}
                variant={isSelected ? 'primary' : 'outline'}
                size="lg"
                className={`h-16 font-semibold text-lg flex items-center justify-center ${
                  isSelected
                    ? 'bg-teal-600 text-white ring-4 ring-teal-200 shadow-md'
                    : 'border-slate-300 text-slate-700 hover:bg-teal-50'
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Accessibility Controls */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Type className="w-6 h-6 text-teal-600" />
          {t('profile.accessibilityTitle', { defaultValue: 'Accessibility & Audio Settings' })}
        </h3>

        <div className="space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {t('profile.largeText', { defaultValue: 'Large High-Contrast Text' })}
              </p>
              <p className="text-slate-500 text-sm">
                {t('profile.largeTextDesc', { defaultValue: 'Makes buttons and descriptions easier to read' })}
              </p>
            </div>
            <input
              type="checkbox"
              checked={largeText}
              onChange={(e) => setLargeText(e.target.checked)}
              className="w-7 h-7 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {t('profile.autoVoice', { defaultValue: 'Automatic Voice Reading' })}
              </p>
              <p className="text-slate-500 text-sm">
                {t('profile.autoVoiceDesc', { defaultValue: 'Reads question cards and reminders out loud' })}
              </p>
            </div>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="w-7 h-7 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {t('profile.soundEffects', { defaultValue: 'Sound Effects & Feedback' })}
              </p>
              <p className="text-slate-500 text-sm">
                {t('profile.soundEffectsDesc', { defaultValue: 'Plays encouraging sounds on task completion' })}
              </p>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-7 h-7 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="p-6 bg-amber-50/60 border-amber-200 text-amber-900 shadow-sm space-y-2">
        <h4 className="font-bold flex items-center gap-2 text-lg text-amber-800">
          <Shield className="w-5 h-5 text-amber-600" />
          {t('profile.disclaimerTitle', { defaultValue: 'Important Medical Notice' })}
        </h4>
        <p className="text-sm leading-relaxed text-amber-800">
          {t('profile.disclaimerBody', {
            defaultValue: 'Cogniva is designed for non-diagnostic cognitive engagement, memory exercise, and daily care routine support. It does not provide medical diagnoses or replace clinical evaluations by healthcare professionals.'
          })}
        </p>
      </Card>

      {/* Sign Out Button */}
      <div className="pt-4 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleLogout}
          className="w-full sm:w-auto px-8 h-14 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 font-bold text-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-6 h-6" />
          {t('profile.signOut', { defaultValue: 'Sign Out of Cogniva' })}
        </Button>
      </div>
    </div>
  )
}
