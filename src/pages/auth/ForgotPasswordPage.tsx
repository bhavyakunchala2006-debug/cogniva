// ============================================================
// Forgot Password Page
// ============================================================

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Brain, ArrowLeft, CheckCircle2 } from 'lucide-react'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Failed to send reset email. Please check the address.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4F7CAC, transparent)' }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-16 h-16 mx-auto bg-primary rounded-[1.2rem] flex items-center justify-center shadow-btn mb-3">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 border border-border/50 animate-slide-up">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Email Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Check your inbox for a password reset link.
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-highlight/10 border border-highlight/30 text-highlight-600 rounded-xl p-3 mb-4 text-sm font-medium">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-base font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-border text-foreground bg-white
                               focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
                  Send Reset Link
                </Button>
              </form>
              <Link to="/login" className="flex items-center justify-center gap-2 text-primary font-medium mt-5 hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
