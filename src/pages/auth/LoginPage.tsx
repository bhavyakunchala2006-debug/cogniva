// ============================================================
// Login Page
// ============================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Eye, EyeOff, Brain } from 'lucide-react'
import { isDemoMode } from '@/services/firebase/config'

export function LoginPage() {
  const { login, error, loading, clearError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSubmitting(true)
    try {
      await login(email, password)
      // Navigation handled by auth state change in AuthContext
    } catch {
      // error shown from context
    } finally {
      setSubmitting(false)
    }
  }

  // Demo quick-login buttons
  const handleDemoLogin = async (role: 'elderly' | 'caregiver' | 'healthWorker') => {
    const creds = {
      elderly: { email: 'elderly@demo.com', password: 'demo1234' },
      caregiver: { email: 'caregiver@demo.com', password: 'demo1234' },
      healthWorker: { email: 'health@demo.com', password: 'demo1234' },
    }
    const c = creds[role]
    setEmail(c.email)
    setPassword(c.password)
    clearError()
    setSubmitting(true)
    try {
      await login(c.email, c.password)
    } catch {
      //
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blob backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4F7CAC, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #70B77E, transparent)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-20 h-20 mx-auto bg-primary rounded-[1.5rem] flex items-center justify-center shadow-btn mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Cogniva</h1>
          <p className="text-muted-foreground mt-1">Connecting Minds, Supporting Lives</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-card p-6 border border-border/50 animate-slide-up">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Sign In</h2>

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <div className="bg-accent/15 border border-accent/30 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-foreground mb-1">🎭 Demo Mode</p>
              <p className="text-xs text-muted-foreground mb-3">No Firebase configured. Try these demo accounts:</p>
              <div className="grid grid-cols-3 gap-2">
                {(['elderly', 'caregiver', 'healthWorker'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    disabled={submitting}
                    className="text-xs bg-primary/10 text-primary rounded-xl py-2 px-1 font-medium hover:bg-primary/20 transition-colors capitalize"
                  >
                    {role === 'healthWorker' ? 'Health' : role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-highlight/10 border border-highlight/30 text-highlight-600 rounded-xl p-3 mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-border text-foreground bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-muted-foreground"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-base font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-border text-foreground bg-white
                             focus:outline-none focus:ring-2 focus:ring-primary text-base pr-12 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-primary text-sm font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-base text-muted-foreground mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Medical disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          Cogniva supports cognitive engagement. It is not a medical diagnostic tool.
        </p>
      </div>
    </div>
  )
}
