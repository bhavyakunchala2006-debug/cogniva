// ============================================================
// Caregiver Patients Page
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ChevronRight, Plus, Brain, Bell, Clock } from 'lucide-react'
import { DEMO_ELDERLY_PROFILE } from '@/data/demoData'
import { formatDate } from '@/lib/utils'

export function PatientsPage() {
  const navigate = useNavigate()
  const patients = [DEMO_ELDERLY_PROFILE]

  return (
    <div className="px-4 lg:px-6 py-5 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
          <p className="text-muted-foreground mt-0.5">{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-5 h-5" />}>
          Add Patient
        </Button>
      </div>

      <div className="space-y-4">
        {patients.map((patient) => (
          <Card
            key={patient.profileId}
            clickable
            padding="lg"
            onClick={() => navigate(`/caregiver/patients/${patient.profileId}`)}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                👴
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
                <p className="text-muted-foreground text-base">
                  Age {patient.ageRange} · {patient.region}, {patient.state}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Brain className="w-4 h-4 text-primary" />
                    <span>Memory ↗ 90%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Bell className="w-4 h-4 text-accent-600" />
                    <span>2 missed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Active today</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Patient Detail Page ───────────────────────────────────────────
export function PatientDetailPage() {
  const navigate = useNavigate()
  const patient = DEMO_ELDERLY_PROFILE

  return (
    <div className="px-4 lg:px-6 py-5 max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/caregiver/patients')}
        className="flex items-center gap-2 text-muted-foreground mb-5 hover:text-primary">
        ← Back to Patients
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">👴</div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">Age {patient.ageRange} · {patient.state}</p>
          <p className="text-muted-foreground text-sm">Language: {patient.preferredLanguage === 'en' ? 'English' : 'Hindi'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card padding="lg">
          <h2 className="text-xl font-semibold mb-3">Profile Details</h2>
          <div className="space-y-2 text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interests</span>
              <span className="text-foreground font-medium">{patient.interests.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred Time</span>
              <span className="text-foreground font-medium">{patient.preferredActivityTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Voice Enabled</span>
              <span className="text-foreground font-medium">{patient.accessibility.voiceEnabled ? '✓ Yes' : '✗ No'}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/caregiver/reports')}>
            View Progress
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/caregiver/alerts')}>
            View Alerts
          </Button>
        </div>
      </div>
    </div>
  )
}
