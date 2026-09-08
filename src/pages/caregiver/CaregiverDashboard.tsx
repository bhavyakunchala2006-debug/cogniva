// ============================================================
// Caregiver Dashboard — Patient overview + AI insights
// ============================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import {
  Brain, Bell, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle2, Info, ChevronRight, User
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import {
  DEMO_ELDERLY_PROFILE, DEMO_WEEKLY_DATA, DEMO_ALERTS, DEMO_INSIGHTS
} from '@/data/demoData'
import { formatDate } from '@/lib/utils'

export function CaregiverDashboard() {
  const navigate = useNavigate()
  const profile = DEMO_ELDERLY_PROFILE
  const [alertsRead, setAlertsRead] = useState<Record<string, boolean>>({})

  const unreadAlerts = DEMO_ALERTS.filter((a) => !a.read && !alertsRead[a.alertId])

  const trendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-secondary" />
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-highlight-500" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const trendLabel = (trend: string) => {
    if (trend === 'improving') return <span className="text-secondary font-medium">↗ Improving</span>
    if (trend === 'declining') return <span className="text-highlight-500 font-medium">↘ Declining</span>
    return <span className="text-muted-foreground font-medium">→ Stable</span>
  }

  const alertSeverityConfig = {
    critical: { bg: 'bg-highlight/10 border-highlight/30', icon: <AlertTriangle className="w-5 h-5 text-highlight-500" /> },
    warning:  { bg: 'bg-accent/10 border-accent/30',     icon: <AlertTriangle className="w-5 h-5 text-accent-600" /> },
    info:     { bg: 'bg-primary/8 border-primary/20',    icon: <Info className="w-5 h-5 text-primary" /> },
  }

  return (
    <div className="px-4 lg:px-6 py-5 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Caregiver Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">{formatDate(new Date())}</p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/caregiver/patients')}>
          My Patients
        </Button>
      </div>

      {/* ── Unread Alerts ────────────────────────────────────── */}
      {unreadAlerts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-highlight-500" />
              Alerts ({unreadAlerts.length})
            </h2>
            <button
              onClick={() => navigate('/caregiver/alerts')}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {unreadAlerts.slice(0, 2).map((alert) => {
            const cfg = alertSeverityConfig[alert.severity]
            return (
              <div key={alert.alertId} className={`flex items-start gap-3 p-4 rounded-2xl border ${cfg.bg}`}>
                <div className="shrink-0 mt-0.5">{cfg.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-base">
                    {alert.elderlyName}
                  </p>
                  <p className="text-muted-foreground text-sm mt-0.5">{alert.message}</p>
                </div>
                <button
                  onClick={() => setAlertsRead((prev) => ({ ...prev, [alert.alertId]: true }))}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Dismiss"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Patient Overview Card ─────────────────────────────── */}
      <Card padding="lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">
            👴
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-muted-foreground">Age: {profile.ageRange} · {profile.region}, {profile.state}</p>
          </div>
          <button
            onClick={() => navigate('/caregiver/patients')}
            className="ml-auto text-primary hover:underline flex items-center gap-1 text-sm font-medium"
          >
            View profile <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cognitive overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Memory', trend: 'improving' as const },
            { label: 'Attention', trend: 'stable' as const },
            { label: 'Recognition', trend: 'improving' as const },
          ].map(({ label, trend }) => (
            <div key={label} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {trendIcon(trend)}
              </div>
              <p className="font-semibold text-foreground text-base">{label}</p>
              <p className="text-sm">{trendLabel(trend)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Cognitive Progress Chart ──────────────────────────── */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Cognitive Progress (7 Weeks)</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={DEMO_WEEKLY_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B6B6B' }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: '#6B6B6B' }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E8E0D0', fontSize: '13px' }}
              formatter={(value: any) => [`${value}%`, 'Score']}
            />
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            <Line type="monotone" dataKey="memory" stroke="#4F7CAC" strokeWidth={2.5} dot={{ r: 4 }} name="Memory" />
            <Line type="monotone" dataKey="attention" stroke="#70B77E" strokeWidth={2.5} dot={{ r: 4 }} name="Attention" />
            <Line type="monotone" dataKey="recognition" stroke="#F4B860" strokeWidth={2.5} dot={{ r: 4 }} name="Recognition" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* ── AI Insights ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          Actionable Insights
        </h2>
        <div className="space-y-3">
          {DEMO_INSIGHTS.map((insight) => (
            <Card key={insight.id} variant={insight.trend === 'improving' ? 'secondary' : 'default'} padding="md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-base">{insight.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{insight.description}</p>
                </div>
                <div className="ml-auto shrink-0">
                  {trendLabel(insight.trend)}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Medical disclaimer */}
        <div className="mt-4 bg-muted/50 rounded-xl p-3 border border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            ⚕️ These insights reflect cognitive activity performance, not medical diagnoses. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>

      {/* ── Reminder Adherence ────────────────────────────────── */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Reminder Adherence (This Week)</h2>
        <div className="space-y-3">
          {[
            { name: 'Morning Medicine', adherence: 86, type: '💊' },
            { name: 'Drink Water',      adherence: 100, type: '💧' },
            { name: 'Brain Activity',   adherence: 71,  type: '🧠' },
            { name: 'Evening Medicine', adherence: 57,  type: '💊' },
          ].map(({ name, adherence, type }) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-medium text-foreground">{type} {name}</span>
                <span className={`text-sm font-semibold ${adherence >= 80 ? 'text-secondary' : adherence >= 60 ? 'text-accent-600' : 'text-highlight-500'}`}>
                  {adherence}%
                </span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    adherence >= 80 ? 'bg-secondary' : adherence >= 60 ? 'bg-accent' : 'bg-highlight'
                  }`}
                  style={{ width: `${adherence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="h-4" />
    </div>
  )
}
