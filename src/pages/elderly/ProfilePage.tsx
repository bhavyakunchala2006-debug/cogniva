// ============================================================
// ProfilePage.tsx — Elderly User Profile & Preferences Page
// ============================================================

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { User, LogOut, Globe, Volume2, Type, Shield, Heart, MapPin, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const [largeText, setLargeText] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const profile = DEMO_ELDERLY_PROFILE

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
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
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <User className="w-7 h-7 text-teal-600" />
          My Profile & Settings
        </h1>
        <div className="w-20" />
      </div>

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
            <MapPin className="w-4 h-4 text-teal-600" /> State: {profile.state} (NER)
          </p>
          <p className="text-slate-500 text-sm">Age group: 70-75 years | Native language: {profile.preferredLanguage}</p>
        </div>
      </Card>

      {/* Language Preferences */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Globe className="w-6 h-6 text-teal-600" />
          Preferred Language
        </h3>
        <p className="text-slate-600">Choose the language for games, voice, and prompts:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'Hindi (हिंदी)' },
            { code: 'as', label: 'Assamese (অসমীয়া)' },
            { code: 'mni', label: 'Manipuri (মৈতৈলোন্)' },
          ].map((lang) => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? 'primary' : 'outline'}
              size="lg"
              className={`h-14 font-semibold text-lg ${
                i18n.language === lang.code
                  ? 'bg-teal-600 text-white'
                  : 'border-slate-300 text-slate-700 hover:bg-teal-50'
              }`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Accessibility Controls */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Type className="w-6 h-6 text-teal-600" />
          Accessibility & Audio Settings
        </h3>

        <div className="space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-semibold text-slate-800">Large High-Contrast Text</p>
              <p className="text-slate-500 text-sm">Makes buttons and descriptions easier to read</p>
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
              <p className="text-lg font-semibold text-slate-800">Automatic Voice Reading</p>
              <p className="text-slate-500 text-sm">Reads question cards and reminders out loud</p>
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
              <p className="text-lg font-semibold text-slate-800">Sound Effects & Feedback</p>
              <p className="text-slate-500 text-sm">Plays encouraging sounds on task completion</p>
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
          Important Medical Notice
        </h4>
        <p className="text-sm leading-relaxed text-amber-800">
          Cogniva is designed for non-diagnostic cognitive engagement, memory exercise, and daily care routine support. It does not provide medical diagnoses or replace clinical evaluations by healthcare professionals.
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
          Sign Out of Cogniva
        </Button>
      </div>
    </div>
  )
}
