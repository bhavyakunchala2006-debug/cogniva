// ============================================================
// Splash / Landing Screen
// ============================================================

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function SplashPage() {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (currentUser) {
          // Route based on role
          switch (currentUser.role) {
            case 'elderly':
              navigate('/elderly', { replace: true })
              break
            case 'caregiver':
              navigate('/caregiver', { replace: true })
              break
            case 'healthWorker':
              navigate('/health-worker', { replace: true })
              break
            default:
              navigate('/login', { replace: true })
          }
        } else {
          navigate('/login', { replace: true })
        }
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [currentUser, loading, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Organic blob backgrounds */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #4F7CAC 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #70B77E 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #F4B860 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 animate-fade-in">
        {/* Logo */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 mx-auto bg-primary rounded-[2rem] flex items-center justify-center shadow-btn animate-float">
            {/* Brain + connection icon concept */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Brain outline */}
              <path d="M32 8C22 8 14 16 14 26C14 32 17 37 22 40V52H42V40C47 37 50 32 50 26C50 16 42 8 32 8Z" fill="white" fillOpacity="0.9"/>
              {/* Connection nodes */}
              <circle cx="26" cy="26" r="4" fill="#4F7CAC" fillOpacity="0.7"/>
              <circle cx="38" cy="26" r="4" fill="#70B77E" fillOpacity="0.7"/>
              <circle cx="32" cy="20" r="3" fill="#F4B860" fillOpacity="0.8"/>
              {/* Connection lines */}
              <line x1="26" y1="26" x2="32" y2="20" stroke="white" strokeWidth="1.5"/>
              <line x1="38" y1="26" x2="32" y2="20" stroke="white" strokeWidth="1.5"/>
              <line x1="26" y1="26" x2="38" y2="26" stroke="white" strokeWidth="1.5"/>
              {/* Heart at bottom */}
              <path d="M28 46C28 46 22 42 22 38C22 36 24 35 26 36C28 37 28 38 28 38C28 38 28 37 30 36C32 35 34 36 34 38C34 42 28 46 28 46Z" fill="#F28C8C" fillOpacity="0.9"/>
            </svg>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-28 h-28 mx-auto rounded-[2rem] bg-primary/20 blur-xl" />
        </div>

        {/* App name */}
        <h1
          className="font-bold text-foreground tracking-tight mb-2 animate-slide-up"
          style={{ fontSize: '3rem', letterSpacing: '-0.02em', animationDelay: '0.2s' }}
        >
          Cogniva
        </h1>

        {/* Tagline */}
        <p
          className="text-xl text-muted-foreground font-medium mb-12 animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          Connecting Minds, Supporting Lives
        </p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">
          Supporting elderly wellbeing in Northeast India
        </p>
      </div>
    </div>
  )
}
