// ============================================================
// Caregiver Alerts Page
// ============================================================

import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { AlertTriangle, Info, CheckCircle2, Bell } from 'lucide-react'
import { DEMO_ALERTS } from '@/data/demoData'
import type { Alert } from '@/types/reminder.types'
import { cn } from '@/lib/utils'

export function AlertsPage() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleAlerts = DEMO_ALERTS.filter((a) => !dismissed.has(a.alertId))
  const severityConfig = {
    critical: { icon: <AlertTriangle className="w-5 h-5 text-highlight-500" />, bg: 'bg-highlight/10 border-highlight/30', label: 'Critical' },
    warning:  { icon: <AlertTriangle className="w-5 h-5 text-accent-600" />,     bg: 'bg-accent/10 border-accent/30',     label: 'Warning' },
    info:     { icon: <Info className="w-5 h-5 text-primary" />,                 bg: 'bg-primary/8 border-primary/20',    label: 'Info' },
  }

  const timeAgo = (date: Date) => {
    const ms = Date.now() - date.getTime()
    const h = Math.floor(ms / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div className="px-4 lg:px-6 py-5 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" /> Alerts
          </h1>
          <p className="text-muted-foreground mt-0.5">{visibleAlerts.length} alerts requiring attention</p>
        </div>
        {visibleAlerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(new Set(DEMO_ALERTS.map((a) => a.alertId)))}
          >
            Dismiss All
          </Button>
        )}
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">All Clear! 🟢</h2>
          <p className="text-muted-foreground text-lg">No alerts requiring your attention right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => {
            const cfg = severityConfig[alert.severity]
            return (
              <div key={alert.alertId} className={cn('rounded-2xl border p-4', cfg.bg)}>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{cfg.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        alert.severity === 'critical' ? 'bg-highlight/20 text-highlight-500' :
                        alert.severity === 'warning' ? 'bg-accent/20 text-accent-600' :
                        'bg-primary/15 text-primary'
                      )}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-foreground">{alert.elderlyName}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{alert.message}</p>
                  </div>
                  <button
                    onClick={() => setDismissed((prev) => new Set([...prev, alert.alertId]))}
                    className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-black/5"
                    aria-label="Dismiss alert"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
