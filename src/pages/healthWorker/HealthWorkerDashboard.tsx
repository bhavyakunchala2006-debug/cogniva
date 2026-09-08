// ============================================================
// Health Worker Dashboard
// ============================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { DEMO_ELDERLY_PROFILE, DEMO_WEEKLY_DATA } from '@/data/demoData'
import { ClipboardList, Brain, CheckCircle2, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function HealthWorkerDashboard() {
  const navigate = useNavigate()
  const [observation, setObservation] = useState('')
  const [savedObs, setSavedObs] = useState(false)
  const profile = DEMO_ELDERLY_PROFILE

  const handleSaveObservation = () => {
    if (!observation.trim()) return
    setSavedObs(true)
    setTimeout(() => setSavedObs(false), 3000)
    setObservation('')
  }

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-8 h-8 text-secondary" /> Health Worker Dashboard
        </h1>
        <p className="text-muted-foreground mt-0.5">{formatDate(new Date())}</p>
        <div className="mt-2 bg-secondary/10 border border-secondary/20 rounded-xl p-3">
          <p className="text-sm text-secondary font-medium">
            🔒 You have read-only access to authorized patient summaries. Clinical decisions must be made by qualified medical professionals.
          </p>
        </div>
      </div>

      {/* Patient Summary */}
      <Card padding="lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-3xl">👴</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-muted-foreground">Age {profile.ageRange} · {profile.region}</p>
          </div>
          <span className="ml-auto badge-success">Authorized</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions (7d)', value: '7', color: 'text-primary' },
            { label: 'Avg Accuracy',  value: '88%', color: 'text-secondary' },
            { label: 'Adherence',     value: '81%', color: 'text-accent-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cognitive Trend */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" /> Cognitive Activity Trends
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DEMO_WEEKLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => [`${v}%`, 'Accuracy']} contentStyle={{ borderRadius: '12px' }} />
            <Legend />
            <Line type="monotone" dataKey="memory"    stroke="#4F7CAC" strokeWidth={2} dot={{ r: 3 }} name="Memory" />
            <Line type="monotone" dataKey="attention" stroke="#70B77E" strokeWidth={2} dot={{ r: 3 }} name="Attention" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          ⚕️ These scores reflect cognitive activity participation — not clinical assessments.
        </p>
      </Card>

      {/* Reminder Adherence */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-4">Reminder Adherence</h2>
        <div className="space-y-3">
          {[
            { name: '💊 Morning Medicine', rate: 86 },
            { name: '💧 Hydration',         rate: 100 },
            { name: '🧠 Brain Activity',    rate: 71 },
            { name: '💊 Evening Medicine',  rate: 57 },
          ].map(({ name, rate }) => (
            <div key={name}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-foreground">{name}</span>
                <span className={rate >= 80 ? 'text-secondary font-semibold' : rate >= 60 ? 'text-accent-600 font-semibold' : 'text-highlight-500 font-semibold'}>
                  {rate}%
                </span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${rate >= 80 ? 'bg-secondary' : rate >= 60 ? 'bg-accent' : 'bg-highlight'}`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Observation */}
      <Card padding="lg" variant="secondary">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-secondary" /> Add Observation
        </h2>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Add a clinical observation or note about this patient's cognitive activity engagement..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border text-foreground bg-white
                     focus:outline-none focus:ring-2 focus:ring-secondary text-base resize-none"
        />
        {savedObs && (
          <div className="flex items-center gap-2 text-secondary font-medium mt-2">
            <CheckCircle2 className="w-5 h-5" /> Observation saved successfully
          </div>
        )}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleSaveObservation}
          disabled={!observation.trim()}
          className="mt-3"
        >
          Save Observation
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Observations are stored securely and accessible to authorized caregivers.
        </p>
      </Card>
    </div>
  )
}

// ── Health Worker Patients Page ────────────────────────────
export function HWPatientsPage() {
  const navigate = useNavigate()
  const patients = [DEMO_ELDERLY_PROFILE]

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-6">My Patients</h1>
      <div className="space-y-3">
        {patients.map((p) => (
          <Card key={p.profileId} clickable padding="md"
            onClick={() => navigate('/health-worker')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">👴</div>
              <div>
                <p className="text-xl font-semibold text-foreground">{p.name}</p>
                <p className="text-muted-foreground">{p.region} · {p.ageRange}</p>
                <span className="badge-success text-xs mt-1 inline-block">Authorized</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
