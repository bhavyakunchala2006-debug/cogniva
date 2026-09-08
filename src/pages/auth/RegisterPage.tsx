// ============================================================
// Register Page — with role selection
// ============================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Brain, Eye, EyeOff, User, Heart, Stethoscope } from 'lucide-react'
import type { UserRole } from '@/types/user.types'
import { cn } from '@/lib/utils'

interface RoleOption {
  value: UserRole
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const ROLES: RoleOption[] = [
  {
    value: 'elderly',
    label: 'Elderly User',
    description: 'Play games & get reminders',
    icon: <User className="w-6 h-6" />,
    color: 'border-primary/30 bg-primary/5 hover:border-primary',
  },
  {
    value: 'caregiver',
    label: 'Caregiver',
    description: 'Manage and monitor a loved one',
    icon: <Heart className="w-6 h-6" />,
    color: 'border-highlight/30 bg-highlight/5 hover:border-highlight',
  },
  {
    value: 'healthWorker',
    label: 'Health Worker',
    description: 'View patient summaries',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'border-secondary/30 bg-secondary/5 hover:border-secondary',
  },
]

export function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('elderly')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      await register(email, password, name, selectedRole)
      // Navigation handled by AuthContext
    } catch {
      // error shown from context
    } finally {
      setSubmitting(false)
    }
  }

  const displayError = error || localError

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Blob backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #70B77E, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4B860, transparent)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="w-16 h-16 mx-auto bg-primary rounded-[1.2rem] flex items-center justify-center shadow-btn mb-3">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Join Cogniva today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 border border-border/50 animate-slide-up">
          {/* Error */}
          {displayError && (
            <div className="bg-highlight/10 border border-highlight/30 text-highlight-600 rounded-xl p-3 mb-4 text-sm font-medium">
              {displayError}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-5">
            <p className="text-base font-medium text-foreground mb-3">I am a</p>
            <div className="space-y-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 text-left',
                    selectedRole === role.value
                      ? role.color + ' border-opacity-100'
                      : 'border-border/50 bg-muted/30 hover:bg-muted/50'
                  )}
                >
                  <div className={cn('shrink-0 text-primary', selectedRole === role.value && 'text-primary')}>
                    {role.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  {selectedRole === role.value && (
                    <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-base font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-border text-foreground bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-muted-foreground"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-base font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border text-foreground bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-muted-foreground"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-base font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-border text-foreground bg-white
                             focus:outline-none focus:ring-2 focus:ring-primary text-base pr-12 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} className="mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-base text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
