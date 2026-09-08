// ============================================================
// LoadingSpinner — Friendly loading indicator
// ============================================================

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', message, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-8', className)}>
      {/* Cogniva-branded spinner */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-4 border-primary/20 border-t-primary animate-spin',
            sizeClasses[size]
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">🧠</span>
        </div>
      </div>
      {message && (
        <p className="text-body text-muted-foreground font-medium text-center">{message}</p>
      )}
    </div>
  )
}

// Full-page loading screen
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center blob-bg">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-3xl flex items-center justify-center shadow-btn">
          <span className="text-4xl">🧠</span>
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Cogniva</h1>
        <LoadingSpinner size="md" message={message} />
      </div>
    </div>
  )
}
