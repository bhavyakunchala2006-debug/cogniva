// ============================================================
// Button component — Large, accessible, elderly-friendly
// ============================================================

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  icon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-500 shadow-btn active:scale-95',
    secondary: 'bg-secondary text-white hover:bg-secondary-500 shadow-btn active:scale-95',
    accent: 'bg-accent text-accent-foreground hover:opacity-90 shadow-btn active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5 active:scale-95',
    ghost: 'text-primary hover:bg-primary/10 active:scale-95',
    danger: 'bg-highlight text-white hover:opacity-90 active:scale-95',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-base min-h-[44px] rounded-xl gap-2',
    md: 'px-5 py-3 text-lg min-h-[48px] rounded-xl gap-2',
    lg: 'px-6 py-4 text-xl min-h-[56px] rounded-2xl gap-3',
    xl: 'px-8 py-5 text-2xl min-h-[64px] rounded-2xl gap-3',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
