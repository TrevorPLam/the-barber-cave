// src/components/Card.tsx - Simple props-based card component
import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  className?: string
  onClick?: () => void
}

/**
 * Simple props-based card component for flexible layouts
 *
 * @example
 * ```tsx
 * <Card variant="elevated" interactive onClick={handleClick}>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Card content goes here</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */
export function Card({
  children,
  header,
  footer,
  variant = 'default',
  size = 'md',
  interactive = false,
  className = '',
  onClick
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-200'
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-gray-300'
  }
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  const interactiveClasses = interactive ? 'hover:shadow-md cursor-pointer' : ''

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        interactiveClasses,
        className
      )}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      } : undefined}
    >
      {header && <div className="mb-4">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  )
}

// Compound component parts for backward compatibility
Card.Header = function CardHeader({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

Card.Body = function CardBody({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`flex-1 ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>
}
