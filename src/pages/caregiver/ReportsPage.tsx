// ============================================================
// Caregiver Reports Page — Charts + detailed insights
// ============================================================

import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, Brain, Activity } from 'lucide-react'
import { DEMO_WEEKLY_DATA, generateDemoSessions, DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { aiService } from '@/services/ai/AIService'
import { Button } from '@/components/common/Button'

const SESSIONS = generateDemoSessions(DEMO_ELDERLY_PROFILE.profileId)

const GAME_TYPE_COUNTS = SESSIONS.reduce<Record<string, number>>((acc, s) => {
  acc[s.gameType] = (acc[s.gameType] || 0) + 1
  return acc
}, {})

const GAME_BAR_DATA = Object.entries(GAME_TYPE_COUNTS).map(([type, count]) => ({
  name: type.replace(/([A-Z])/g, ' $1').trim(),
  sessions: count,
}))

export function ReportsPage() {
  const [insight, setInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(false)

  const handleGenerateInsight = async () => {
    setLoadingInsight(true)
    try {
      const weeklyAccuracies = DEMO_WEEKLY_DATA.map((d) => d.memory)
      const result = await aiService.generateInsight({
        gameType: 'memoryMatch',
        weeklyAccuracies,
        trend: 'improving',
      })
      setInsight(result)
    } finally {
      setLoadingInsight(false)
    }
  }

  return (
    <div className="px-4 lg:px-6 py-5 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" /> Reports
        </h1>
        <p className="text-muted-foreground mt-0.5">Cognitive activity performance for {DEMO_ELDERLY_PROFILE.name}</p>
      </div>

      {/* Weekly trend */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Weekly Performance Trends
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={DEMO_WEEKLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any) => [`${v}%`, 'Accuracy']} contentStyle={{ borderRadius: '12px' }} />
            <Legend />
            <Line type="monotone" dataKey="memory"      stroke="#4F7CAC" strokeWidth={2.5} dot={{ r: 4 }} name="Memory" />
            <Line type="monotone" dataKey="attention"   stroke="#70B77E" strokeWidth={2.5} dot={{ r: 4 }} name="Attention" />
            <Line type="monotone" dataKey="recognition" stroke="#F4B860" strokeWidth={2.5} dot={{ r: 4 }} name="Recognition" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Session distribution */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" /> Sessions by Game Type
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={GAME_BAR_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '12px' }} />
            <Bar dataKey="sessions" fill="#4F7CAC" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Sessions', value: SESSIONS.length, icon: '🎮' },
          { label: 'Avg Accuracy',   value: `${Math.round(SESSIONS.reduce((s, x) => s + x.accuracy, 0) / SESSIONS.length)}%`, icon: '🎯' },
          { label: 'Avg Score',      value: Math.round(SESSIONS.reduce((s, x) => s + x.score, 0) / SESSIONS.length), icon: '⭐' },
          { label: 'Current Trend',  value: 'Improving', icon: '↗' },
        ].map(({ label, value, icon }) => (
          <Card key={label} padding="md" className="text-center">
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </Card>
        ))}
      </div>

      {/* AI Insight Generator */}
      <Card padding="lg" variant="primary">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          🤖 AI-Generated Insight
        </h2>
        {insight ? (
          <p className="text-foreground text-base leading-relaxed">{insight}</p>
        ) : (
          <p className="text-muted-foreground mb-4">Generate an AI-powered summary of recent cognitive activity performance.</p>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handleGenerateInsight}
          loading={loadingInsight}
          className="mt-3"
        >
          {insight ? 'Regenerate Insight' : 'Generate AI Insight'}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          ⚕️ Insights reflect cognitive activity performance — not medical diagnoses.
        </p>
      </Card>
    </div>
  )
}
