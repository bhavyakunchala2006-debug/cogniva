// ============================================================
// Card component — Cogniva card system
// ============================================================

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export function Card({
  variant = 'default',
  padding = 'md',
  clickable = false,
  className,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-border/50',
    primary: 'bg-primary/5 border border-primary/20',
    secondary: 'bg-secondary/5 border border-secondary/20',
    accent: 'bg-accent/10 border border-accent/30',
    elevated: 'bg-white border border-border/50 shadow-card-hover',
  }

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'rounded-2xl shadow-card',
        variantClasses[variant],
        paddingClasses[padding],
        clickable && 'cursor-pointer transition-all duration-200 active:scale-[0.98] hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Sub-components
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-card-title font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}
