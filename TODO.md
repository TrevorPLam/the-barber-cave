Here is your **normalized version**, tightened for:

* Consistent field ordering
* Canonical label casing (kebab-case)
* Stable priority model (1–5 only)
* Explicit `status` enum consistency
* Clear separation between:

  * Metadata
  * Tasks
  * Enhancements (non-committed backlog)
  * Reference docs

Redundancy, drift, and formatting inconsistencies have been removed while preserving intent.

---

# TODO — The Barber Cave

```yaml
project: the-barber-cave
display_name: "The Barber Cave"
description: "Next.js barber shop marketing site with booking system"
repository_type: application

tech_stack:
  framework: "Next.js 16"
  ui: "React 19"
  language: "TypeScript 5"
  styling: "Tailwind CSS 4"
  testing:
    - "Vitest"
    - "Playwright"
  component_dev: "Storybook"
  linting: "ESLint 9"

timezone: America/Chicago
review_cycle_days: 7
last_reviewed: 2026-03-03
next_review: 2026-03-10
```

---

# Status Enum (canonical)

`open | planned | in-progress | blocked | completed | cancelled`

---

# Priority Scale (canonical)

| Priority | Meaning                             |
| -------- | ----------------------------------- |
| 1        | Critical – release blocker          |
| 2        | High – must resolve before release  |
| 3        | Medium – important but not blocking |
| 4        | Low – polish / optimization         |
| 5        | Backlog – cleanup / optional        |

---

# 📚 Best Practices & Standards

## Advanced React/Next.js Patterns

### Performance Optimization Patterns

**1. Image Optimization with Next.js Image Component**

```tsx
// ✅ Advanced image pattern with priority and placeholder
import Image from 'next/image'

const OptimizedHeroImage = ({ src, alt, priority = false }) => {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority} // Use priority for LCP elements
        quality={85} // Balance quality vs file size
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur" // Only for raster images, not SVG
        blurDataURL="data:image/jpeg;base64,..." // Base64 blur placeholder
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          // Fallback handling
          const target = e.target as HTMLImageElement
          target.src = '/images/fallback.jpg'
        }}
      />
    </div>
  )
}
```

**2. Server Component Optimization**

```tsx
// ✅ Server component pattern for static content
export default function StaticFooter() {
  // No 'use client' directive - renders on server
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p>&copy; 2026 The Barber Cave. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ✅ Client component only when needed
'use client'

import { useState, useEffect } from 'react'

export default function InteractiveNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])
  
  return (
    <nav>
      {/* Navigation content */}
    </nav>
  )
}
```

**3. Advanced Error Boundary Pattern**

```tsx
// ✅ Production-ready error boundary with retry logic
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout
  
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }
  
  static getDerivedStateFromError(error: Error, prevState: State): State {
    // Preserve retry count on new errors
    return {
      hasError: true,
      error,
      retryCount: prevState.retryCount
    }
  }
  
  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props
    const { resetKeys: prevResetKeys } = prevProps
    
    // Reset on any resetKeys change (length OR values)
    if (resetKeys && prevResetKeys) {
      // Check if length changed
      if (resetKeys.length !== prevResetKeys.length) {
        this.resetError()
        return
      }
      
      // Check if values changed
      const hasChanged = resetKeys.some((key, index) => key !== prevResetKeys[index])
      if (hasChanged) {
        this.resetError()
      }
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error service
    console.error('ErrorBoundary caught error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }
  
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }
  
  private resetError = () => {
    const newRetryCount = this.state.retryCount + 1
    
    // Prevent infinite retries
    if (newRetryCount >= 3) {
      // Keep error state, just update retry count
      this.setState({ retryCount: newRetryCount })
      return
    }
    
    // Reset error state to allow retry
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: newRetryCount
    })
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.retryCount >= 3 
                ? 'Maximum retry attempts reached. Please refresh the page.'
                : 'An unexpected error occurred.'}
            </p>
            {this.state.retryCount < 3 && (
              <button
                onClick={this.resetError}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again ({3 - this.state.retryCount} attempts left)
              </button>
            )}
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Modern React Patterns

**1. Compound Components Pattern**

```tsx
// ✅ Advanced compound component for flexible card layouts
interface CardContextValue {
  variant: 'default' | 'elevated' | 'outlined'
  size: 'sm' | 'md' | 'lg'
  interactive: boolean
}

const CardContext = createContext<CardContextValue>({
  variant: 'default',
  size: 'md',
  interactive: false
})

interface CardProps {
  children: ReactNode
  variant?: CardContextValue['variant']
  size?: CardContextValue['size']
  interactive?: boolean
  className?: string
}

export function Card({ 
  children, 
  variant = 'default', 
  size = 'md', 
  interactive = false,
  className = '' 
}: CardProps) {
  const contextValue = useMemo(() => ({
    variant,
    size,
    interactive
  }), [variant, size, interactive])
  
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
  const interactive = interactive ? 'hover:shadow-md cursor-pointer' : ''
  
  return (
    <CardContext.Provider value={contextValue}>
      <div className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${interactive} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

Card.Header = function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

Card.Body = function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>
}
```

**2. Custom Hook Pattern for State Management**

```tsx
// ✅ Advanced custom hook for booking state management
interface BookingState {
  selectedService: string | null
  selectedBarber: string | null
  selectedDate: Date | null
  selectedTime: string | null
  customerInfo: {
    name: string
    email: string
    phone: string
  } | null
  isSubmitting: boolean
  error: string | null
}

interface BookingActions {
  selectService: (serviceId: string) => void
  selectBarber: (barberId: string) => void
  selectDate: (date: Date) => void
  selectTime: (time: string) => void
  setCustomerInfo: (info: BookingState['customerInfo']) => void
  submitBooking: () => Promise<void>
  resetBooking: () => void
  clearError: () => void
}

export function useBooking(): BookingState & BookingActions {
  const [state, setState] = useState<BookingState>({
    selectedService: null,
    selectedBarber: null,
    selectedDate: null,
    selectedTime: null,
    customerInfo: null,
    isSubmitting: false,
    error: null
  })
  
  const selectService = useCallback((serviceId: string) => {
    setState(prev => ({ ...prev, selectedService: serviceId, error: null }))
  }, [])
  
  const selectBarber = useCallback((barberId: string) => {
    setState(prev => ({ ...prev, selectedBarber: barberId, error: null }))
  }, [])
  
  const selectDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date, error: null }))
  }, [])
  
  const selectTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, selectedTime: time, error: null }))
  }, [])
  
  const setCustomerInfo = useCallback((info: BookingState['customerInfo']) => {
    setState(prev => ({ ...prev, customerInfo: info, error: null }))
  }, [])
  
  const submitBooking = useCallback(async () => {
    const { selectedService, selectedBarber, selectedDate, selectedTime, customerInfo } = state
    
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !customerInfo) {
      setState(prev => ({ ...prev, error: 'Please complete all booking steps' }))
      return
    }
    
    setState(prev => ({ ...prev, isSubmitting: true, error: null }))
    
    try {
      // API call to submit booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          barberId: selectedBarber,
          date: selectedDate.toISOString(),
          time: selectedTime,
          customerInfo
        })
      })
      
      if (!response.ok) {
        throw new Error('Booking failed')
      }
      
      // Reset form on success
      resetBooking()
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Booking failed',
        isSubmitting: false 
      }))
    }
  }, [state])
  
  const resetBooking = useCallback(() => {
    setState({
      selectedService: null,
      selectedBarber: null,
      selectedDate: null,
      selectedTime: null,
      customerInfo: null,
      isSubmitting: false,
      error: null
    })
  }, [])
  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])
  
  return {
    ...state,
    selectService,
    selectBarber,
    selectDate,
    selectTime,
    setCustomerInfo,
    submitBooking,
    resetBooking,
    clearError
  }
}
```

**3. Render Props Pattern for Flexibility**

```tsx
// ✅ Advanced render props component for data fetching
interface DataFetcherProps<T> {
  url: string
  children: (data: {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
  }) => ReactNode
  fallback?: ReactNode
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function DataFetcher<T>({ 
  url, 
  children, 
  fallback,
  onSuccess,
  onError 
}: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])
  
  if (loading && fallback) {
    return <>{fallback}</>
  }
  
  return <>{children({ data, loading, error, refetch })}</>
}

// Usage example
<DataFetcher url="/api/services">
  {({ data, loading, error, refetch }) => (
    <div>
      {loading && <div>Loading services...</div>}
      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={refetch}>Retry</button>
        </div>
      )}
      {data && (
        <ul>
          {data.map((service: any) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      )}
    </div>
  )}
</DataFetcher>
```

### Security Best Practices

**1. Content Security Policy (CSP) Configuration**

```typescript
// next.config.ts - Advanced CSP with nonce support
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'nonce-%nonce%'", // Remove unsafe-eval when possible
      "style-src 'self' 'unsafe-inline'", // Consider nonce-based styles
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.example.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}
```

**2. Advanced Input Validation & Sanitization**

```typescript
// src/lib/security.ts - Comprehensive security utilities
import DOMPurify from 'dompurify'
import { z } from 'zod'

// Advanced validation schemas with security rules
const SecureEmailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .refine(email => {
    // Prevent suspicious email patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i
    ]
    return !suspiciousPatterns.some(pattern => pattern.test(email))
  }, 'Email contains suspicious content')

const SecurePhoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
  .min(10, 'Phone number too short')
  .max(20, 'Phone number too long')
  .refine(phone => {
    // Prevent injection attempts
    const dangerousChars = ['<', '>', '&', '"', "'", '/', '\\']
    return !dangerousChars.some(char => phone.includes(char))
  }, 'Phone number contains invalid characters')

const SecureNameSchema = z.string()
  .min(1, 'Name required')
  .max(100, 'Name too long')
  .refine(name => {
    // Allow only safe characters
    const safePattern = /^[a-zA-Z\s\-\.'']+$/
    return safePattern.test(name)
  }, 'Name contains invalid characters')
  .refine(name => {
    // Prevent script injection in names
    const scriptPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i
    ]
    return !scriptPatterns.some(pattern => pattern.test(name))
  }, 'Name contains potentially dangerous content')

// HTML sanitization for user-generated content
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return plain text (no HTML allowed)
    return html.replace(/<[^>]*>/g, '').trim()
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false
  })
}

// Advanced form validation
export function validateBookingForm(data: unknown) {
  const BookingSchema = z.object({
    customerName: SecureNameSchema,
    customerEmail: SecureEmailSchema,
    customerPhone: SecurePhoneSchema,
    serviceId: z.string().uuid('Invalid service ID'),
    barberId: z.string().uuid('Invalid barber ID'),
    date: z.string().datetime('Invalid date format'),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    notes: z.string()
      .max(500, 'Notes too long')
      .transform(val => sanitizeHTML(val))
      .optional()
  })
  
  return BookingSchema.parse(data)
}

// Rate limiting for API endpoints
export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const key = identifier
    const record = this.requests.get(key)
    
    if (!record || now > record.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }
    
    if (record.count >= this.maxRequests) {
      return false
    }
    
    record.count++
    return true
  }
  
  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - record.count)
  }
}

// CSRF protection utilities
export function generateCSRFToken(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use crypto API
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  // Server-side: use Node.js crypto
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // Implement secure comparison to prevent timing attacks
  if (token.length !== sessionToken.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ sessionToken.charCodeAt(i)
  }
  
  return result === 0
}
```

**3. Secure API Patterns**

```typescript
// src/app/api/bookings/route.ts - Secure API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { validateBookingForm, RateLimiter } from '@/lib/security'
import { z } from 'zod'

// Initialize rate limiter for booking endpoint
const bookingRateLimiter = new RateLimiter(5, 300000) // 5 requests per 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      'unknown'
    
    // Apply rate limiting
    if (!bookingRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many booking requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Validate CSRF token if session exists
    const csrfToken = request.headers.get('x-csrf-token')
    const sessionToken = request.cookies.get('csrf-token')?.value
    
    if (sessionToken && (!csrfToken || !validateCSRFToken(csrfToken, sessionToken))) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = validateBookingForm(body)
    
    // Additional business logic validation
    const bookingDate = new Date(validatedData.date)
    const now = new Date()
    
    if (bookingDate < now) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      )
    }
    
    // Check if time slot is available
    const isAvailable = await checkTimeSlotAvailability(
      validatedData.barberId,
      validatedData.date,
      validatedData.time
    )
    
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 409 }
      )
    }
    
    // Process booking
    const booking = await createBooking(validatedData)
    
    // Return success response (without sensitive data)
    return NextResponse.json({
      id: booking.id,
      status: 'confirmed',
      message: 'Booking confirmed successfully'
    })
    
  } catch (error) {
    console.error('Booking API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function checkTimeSlotAvailability(
  barberId: string,
  date: string,
  time: string
): Promise<boolean> {
  // Implementation for checking availability
  // This would query your database or booking system
  return true // Placeholder
}

async function createBooking(data: any): Promise<{ id: string }> {
  // Implementation for creating booking
  // This would save to your database
  return { id: 'booking-123' } // Placeholder
}
```

**2. Environment Variable Security**

```typescript
// src/lib/env.ts - Type-safe environment variables
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  API_SECRET_KEY: z.string().min(32), // Server-side only
  DATABASE_URL: z.string().url(), // Server-side only
  SMTP_PASSWORD: z.string().min(16) // Server-side only
})

// Validate environment variables at runtime
try {
  const env = envSchema.parse(process.env)
  
  // Export validated environment
  export const ENV = {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ANALYTICS_ID: env.NEXT_PUBLIC_ANALYTICS_ID,
    // Server-only variables
    API_SECRET_KEY: env.API_SECRET_KEY,
    DATABASE_URL: env.DATABASE_URL,
    SMTP_PASSWORD: env.SMTP_PASSWORD
  }
} catch (error) {
  console.error('❌ Invalid environment variables:', error)
  process.exit(1)
}

// Development-only checks
if (ENV.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected')
  console.log('📊 Analytics:', ENV.NEXT_PUBLIC_ANALYTICS_ID ? 'enabled' : 'disabled')
}
```

### Accessibility Standards

**1. WCAG 2.2 AA Compliant Component Pattern**

```tsx
// ✅ Accessible button with proper ARIA and keyboard support
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  description?: string // For additional context
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  description,
  children,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:border-gray-200 disabled:text-gray-400'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const generateId = () => `button-${Math.random().toString(36).substr(2, 9)}`
  const descriptionId = description ? generateId() : undefined
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={descriptionId}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="sr-only" aria-live="polite">
          Loading, please wait
        </span>
      )}
      
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
      
      {icon && iconPosition === 'left' && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {loading ? (
        <span className="animate-spin mr-2" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      ) : null}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
```

**2. Advanced Focus Management Pattern**

```tsx
// ✅ Comprehensive focus management for modals and dropdowns
import { useEffect, useRef, useCallback } from 'react'

interface UseFocusTrapOptions {
  isActive: boolean
  onEscape?: () => void
  restoreFocus?: boolean
  initialFocus?: HTMLElement | null
}

export function useFocusTrap({ 
  isActive, 
  onEscape, 
  restoreFocus = true,
  initialFocus 
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)
  
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'details summary',
      'iframe',
      'embed',
      'object'
    ].join(', ')
    
    return containerRef.current.querySelectorAll(selector) as NodeListOf<HTMLElement>
  }, [])
  
  const setInitialFocus = useCallback(() => {
    if (!isActive) return
    
    // Use provided initial focus or first focusable element
    const target = initialFocus || getFocusableElements()[0]
    
    if (target) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        target.focus()
        // Announce to screen readers
        target.setAttribute('aria-live', 'polite')
        setTimeout(() => target.removeAttribute('aria-live'), 1000)
      }, 50)
    }
  }, [isActive, initialFocus, getFocusableElements])
  
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return
    
    // Handle Escape key
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault()
      onEscape()
      return
    }
    
    // Handle Tab key for focus trapping
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements()
      
      if (focusableElements.length === 0) return
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    // Handle arrow keys for menu navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusableElements = getFocusableElements()
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement)
      
      if (currentIndex !== -1) {
        e.preventDefault()
        const nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % focusableElements.length
          : (currentIndex - 1 + focusableElements.length) % focusableElements.length
        
        focusableElements[nextIndex].focus()
      }
    }
  }, [isActive, onEscape, getFocusableElements])
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return
    
    // Store current focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
    
    // Set initial focus
    setInitialFocus()
    
    // Add event listeners
    keydownHandlerRef.current = handleKeydown
    document.addEventListener('keydown', keydownHandlerRef.current)
    
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Clean up event listeners
      if (keydownHandlerRef.current) {
        document.removeEventListener('keydown', keydownHandlerRef.current)
        keydownHandlerRef.current = null
      }
      
      // Restore body scroll
      document.body.style.overflow = originalOverflow
      
      // Restore focus when unmounting
      if (restoreFocus && previousFocusRef.current) {
        setTimeout(() => {
          previousFocusRef.current?.focus()
        }, 0)
      }
    }
  }, [isActive, handleKeydown, setInitialFocus, restoreFocus])
  
  return containerRef
}

// Usage example for modal
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
    restoreFocus: true
  })
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-label="Close modal"
      />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        {children}
      </div>
    </div>
  )
}
```

**3. Screen Reader Announcements Pattern**

```tsx
// ✅ Advanced screen reader announcement system
import { useEffect, useRef, useState } from 'react'

interface AnnouncementOptions {
  politeness?: 'polite' | 'assertive' | 'off'
  timeout?: number
  clearPrevious?: boolean
}

export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    const {
      politeness = 'polite',
      timeout = 1000,
      clearPrevious = true
    } = options
    
    if (!announcementRef.current) return
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Clear previous announcement if requested
    if (clearPrevious) {
      announcementRef.current.textContent = ''
    }
    
    // Set politeness level
    announcementRef.current.setAttribute('aria-live', politeness)
    
    // Add the message
    announcementRef.current.textContent = message
    
    // Clear after timeout to prevent screen reader clutter
    timeoutRef.current = setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = ''
      }
    }, timeout)
  }, [])
  
  const AnnouncementRegion = useCallback(() => (
    <div
      ref={announcementRef}
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />
  ), [])
  
  return { announce, AnnouncementRegion }
}

// Usage in a component
function BookingForm() {
  const { announce, AnnouncementRegion } = useAnnouncement()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    announce('Booking is being processed, please wait', {
      politeness: 'assertive',
      timeout: 3000
    })
    
    try {
      await submitBooking()
      announce('Booking confirmed successfully! You will receive a confirmation email shortly.', {
        politeness: 'assertive',
        timeout: 5000
      })
    } catch (error) {
      announce('Booking failed. Please check your information and try again.', {
        politeness: 'assertive',
        timeout: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <>
      <AnnouncementRegion />
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Book Appointment'}
        </button>
      </form>
    </>
  )
}
```

**4. Advanced Navigation Accessibility**

```tsx
// ✅ Fully accessible navigation component
import { useState, useEffect, useRef } from 'react'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

interface NavigationItem {
  id: string
  label: string
  href: string
  current?: boolean
  children?: NavigationItem[]
}

export function AccessibleNavigation({ items }: { items: NavigationItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const menuRef = useFocusTrap({
    isActive: isOpen,
    onEscape: () => setIsOpen(false)
  })
  
  const handleMenuToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Announce menu opening
      announce('Main menu opened')
    }
  }
  
  const handleSubmenuToggle = (itemId: string) => {
    const wasOpen = activeSubmenu === itemId
    setActiveSubmenu(wasOpen ? null : itemId)
    
    if (!wasOpen) {
      const item = items.find(i => i.id === itemId)
      announce(`Submenu ${item?.label} opened`)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (e.currentTarget.getAttribute('role') === 'menuitem') {
          e.preventDefault()
          const href = e.currentTarget.getAttribute('href')
          if (href && href !== '#') {
            window.location.href = href
          }
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        // Focus next menu item
        const nextItem = e.currentTarget.nextElementSibling as HTMLElement
        nextItem?.focus()
        break
        
      case 'ArrowUp':
        e.preventDefault()
        // Focus previous menu item
        const prevItem = e.currentTarget.previousElementSibling as HTMLElement
        prevItem?.focus()
        break
        
      case 'Home':
        e.preventDefault()
        // Focus first menu item
        const firstItem = menuRef.current?.querySelector('[role="menuitem"]') as HTMLElement
        firstItem?.focus()
        break
        
      case 'End':
        e.preventDefault()
        // Focus last menu item
        const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>
        const lastItem = menuItems?.[menuItems.length - 1]
        lastItem?.focus()
        break
    }
  }
  
  return (
    <nav aria-label="Main navigation">
      {/* Mobile menu button */}
      <button
        onClick={handleMenuToggle}
        aria-expanded={isOpen}
        aria-controls="main-menu"
        className="md:hidden p-2"
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        {/* Hamburger icon */}
      </button>
      
      {/* Navigation menu */}
      <div
        ref={menuRef}
        id="main-menu"
        role={isOpen ? 'dialog' : 'navigation'}
        aria-modal={isOpen}
        className={`${isOpen ? 'block' : 'hidden'} md:block`}
      >
        <ul role="menubar" className="flex flex-col md:flex-row">
          {items.map((item) => (
            <li key={item.id} role="none">
              {item.children ? (
                // Submenu
                <div>
                  <button
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={activeSubmenu === item.id}
                    onClick={() => handleSubmenuToggle(item.id)}
                    onKeyDown={handleKeyDown}
                    className="flex items-center justify-between w-full px-4 py-2"
                  >
                    {item.label}
                    <span aria-hidden="true">▼</span>
                  </button>
                  
                  {activeSubmenu === item.id && (
                    <ul role="menu" className="ml-4">
                      {item.children.map((child) => (
                        <li key={child.id} role="none">
                          <a
                            role="menuitem"
                            href={child.href}
                            aria-current={child.current ? 'page' : undefined}
                            onKeyDown={handleKeyDown}
                            className="block px-4 py-2"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular link
                <a
                  role="menuitem"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  onKeyDown={handleKeyDown}
                  className="block px-4 py-2"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

// Helper function for announcements
function announce(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
```

### Testing Standards

**1. Advanced Component Testing Pattern**

```tsx
// ✅ Comprehensive component testing with React Testing Library
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Button from '../Button'

// Test utilities for consistent testing
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <div className="theme-provider">
      {component}
    </div>
  )
}

const getButtonByRole = (name: RegExp | string) => {
  return screen.getByRole('button', { name })
}

const expectButtonToBeDisabled = (button: HTMLElement) => {
  expect(button).toBeDisabled()
  expect(button).toHaveAttribute('aria-disabled', 'true')
  expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
}

describe('Button Component', () => {
  const user = userEvent.setup({
    // Configure user event options
    delay: null, // No delay for faster tests
    advanceTimers: vi.advanceTimersByTime
  })
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  describe('Accessibility Tests', () => {
    it('should have proper ARIA attributes by default', () => {
      renderWithTheme(<Button>Click me</Button>)
      
      const button = getButtonByRole(/click me/i)
      
      expect(button).toHaveAttribute('type', 'button')
      expect(button).not.toHaveAttribute('aria-disabled')
      expect(button).not.toHaveAttribute('aria-busy')
      expect(button).not.toHaveAttribute('aria-describedby')
    })
    
    it('should announce loading state to screen readers', async () => {
      renderWithTheme(<Button loading>Loading</Button>)
      
      const button = getButtonByRole(/loading/i)
      
      expectButtonToBeDisabled(button)
      expect(button).toHaveAttribute('aria-busy', 'true')
      
      // Check for loading announcement
      const loadingAnnouncement = screen.getByText('Loading, please wait')
      expect(loadingAnnouncement).toBeInTheDocument()
      expect(loadingAnnouncement).toHaveAttribute('aria-live', 'polite')
    })
    
    it('should include description when provided', () => {
      const description = 'This action will save your changes'
      renderWithTheme(
        <Button description={description}>Save</Button>
      )
      
      const button = getButtonByRole(/save/i)
      const descriptionId = button.getAttribute('aria-describedby')
      
      expect(descriptionId).toBeTruthy()
      
      if (descriptionId) {
        const descriptionElement = document.getElementById(descriptionId)
        expect(descriptionElement).toBeInTheDocument()
        expect(descriptionElement).toHaveTextContent(description)
        expect(descriptionElement).toHaveClass('sr-only')
      }
    })
    
    it('should support keyboard navigation', async () => {
      const handleClick = vi.fn()
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>)
      
      const button = getButtonByRole(/click me/i)
      
      // Test Enter key
      await user.keyboard('[Tab]') // Focus button
      expect(button).toHaveFocus()
      
      await user.keyboard('[Enter]')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      handleClick.mockClear()
      
      // Test Space key
      await user.keyboard('[Space]')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('User Interaction Tests', () => {
    it('should handle click events correctly', async () => {
      const handleClick = vi.fn()
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>)
      
      const button = getButtonByRole(/click me/i)
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
    
    it('should not trigger events when disabled', async () => {
      const handleClick = vi.fn()
      renderWithTheme(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      )
      
      const button = getButtonByRole(/disabled button/i)
      
      expectButtonToBeDisabled(button)
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
    
    it('should not trigger events when loading', async () => {
      const handleClick = vi.fn()
      renderWithTheme(
        <Button onClick={handleClick} loading>
          Loading Button
        </Button>
      )
      
      const button = getButtonByRole(/loading button/i)
      
      expectButtonToBeDisabled(button)
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })
  
  describe('Visual State Tests', () => {
    it('should apply correct variant classes', () => {
      const { rerender } = renderWithTheme(
        <Button variant="primary">Primary</Button>
      )
      
      const button = getButtonByRole(/primary/i)
      expect(button).toHaveClass('bg-blue-600', 'text-white')
      
      rerender(<Button variant="secondary">Secondary</Button>)
      expect(button).toHaveClass('bg-gray-200', 'text-gray-900')
      
      rerender(<Button variant="outline">Outline</Button>)
      expect(button).toHaveClass('border-2', 'border-gray-300', 'text-gray-700')
    })
    
    it('should apply correct size classes', () => {
      const { rerender } = renderWithTheme(<Button size="sm">Small</Button>)
      
      const button = getButtonByRole(/small/i)
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
      
      rerender(<Button size="md">Medium</Button>)
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
      
      rerender(<Button size="lg">Large</Button>)
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
    
    it('should render icons in correct positions', () => {
      const MockIcon = () => <div data-testid="mock-icon">Icon</div>
      
      const { rerender } = renderWithTheme(
        <Button icon={<MockIcon />} iconPosition="left">
          With Left Icon
        </Button>
      )
      
      const button = getButtonByRole(/with left icon/i)
      const icon = screen.getByTestId('mock-icon')
      
      expect(icon).toBeInTheDocument()
      expect(button).toContainElement(icon)
      
      // Test icon position
      const buttonContent = button.textContent
      expect(buttonContent?.indexOf('Icon')).toBeLessThan(buttonContent?.indexOf('With Left Icon') ?? -1)
      
      rerender(
        <Button icon={<MockIcon />} iconPosition="right">
          With Right Icon
        </Button>
      )
      
      const rightButtonContent = button.textContent
      expect(rightButtonContent?.indexOf('With Right Icon')).toBeLessThan(rightButtonContent?.indexOf('Icon') ?? -1)
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle missing children gracefully', () => {
      // @ts-expect-error Testing invalid props
      renderWithTheme(<Button />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })
    
    it('should handle extremely long text', () => {
      const longText = 'A'.repeat(1000)
      renderWithTheme(<Button>{longText}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(longText)
    })
    
    it('should handle rapid state changes', async () => {
      const { rerender } = renderWithTheme(<Button>Normal</Button>)
      
      const button = screen.getByRole('button')
      
      // Rapidly change states
      rerender(<Button loading>Loading</Button>)
      expectButtonToBeDisabled(button)
      
      rerender(<Button disabled>Disabled</Button>)
      expectButtonToBeDisabled(button)
      
      rerender(<Button>Normal Again</Button>)
      expect(button).not.toBeDisabled()
    })
  })
})
```

**2. Integration Testing with Mock APIs**

```tsx
// ✅ Advanced integration testing with API mocking
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import BookingForm from '../BookingForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock API responses
const mockBookingResponse = {
  id: 'booking-123',
  status: 'confirmed',
  message: 'Booking confirmed successfully'
}

const mockServices = [
  { id: 'service-1', name: 'Haircut', price: 50, duration: '30min' },
  { id: 'service-2', name: 'Shave', price: 30, duration: '20min' }
]

const mockBarbers = [
  { id: 'barber-1', name: 'John Doe', available: true },
  { id: 'barber-2', name: 'Jane Smith', available: false }
]

// Mock fetch API
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('BookingForm Integration Tests', () => {
  const user = userEvent.setup()
  let queryClient: QueryClient
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    
    vi.clearAllMocks()
    mockFetch.mockClear()
  })
  
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }
  
  it('should complete full booking flow successfully', async () => {
    // Mock API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBarbers
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookingResponse
      })
    
    renderWithProviders(<BookingForm />)
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Haircut')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+1234567890')
    
    // Select service
    await user.click(screen.getByText('Haircut'))
    
    // Select barber
    await user.click(screen.getByText('John Doe'))
    
    // Select date and time (mock implementation)
    const dateInput = screen.getByLabelText(/date/i)
    await user.clear(dateInput)
    await user.type(dateInput, '2026-12-25')
    
    const timeSelect = screen.getByLabelText(/time/i)
    await user.selectOptions(timeSelect, '10:00')
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /book appointment/i })
    await user.click(submitButton)
    
    // Verify loading state
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/processing/i)
    
    // Wait for success
    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument()
    })
    
    // Verify API calls
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenLastCalledWith(
      '/api/bookings',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('John Smith')
      })
    )
  })
  
  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBarbers
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' })
      })
    
    renderWithProviders(<BookingForm />)
    
    // Fill out form minimally
    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+1234567890')
    
    await user.click(screen.getByText('Haircut'))
    await user.click(screen.getByText('John Doe'))
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /book appointment/i }))
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/booking failed/i)).toBeInTheDocument()
    })
    
    // Verify button is re-enabled
    const submitButton = screen.getByRole('button', { name: /book appointment/i })
    expect(submitButton).not.toBeDisabled()
  })
  
  it('should validate form fields correctly', async () => {
    renderWithProviders(<BookingForm />)
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /book appointment/i })
    await user.click(submitButton)
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
    })
    
    // Verify form was not submitted
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
```

**3. Performance Testing with Lighthouse CI**

```tsx
// ✅ Performance testing configuration
import { test, expect } from '@playwright/test'
import { audit } from 'lighthouse'
import { startFlow, continueFlow } from 'lighthouse/core/flow.js'

test.describe('Performance Tests', () => {
  test('should meet Lighthouse performance budgets', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Run Lighthouse audit
    const { lhr } = await audit(page, {
      onlyCategories: ['performance'],
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    })
    
    // Assert performance scores
    expect(lhr.categories.performance.score).toBeGreaterThanOrEqual(0.9)
    
    // Assert specific metrics
    const metrics = {
      'first-contentful-paint': lhr.audits['first-contentful-paint'].numericValue,
      'largest-contentful-paint': lhr.audits['largest-contentful-paint'].numericValue,
      'cumulative-layout-shift': lhr.audits['cumulative-layout-shift'].numericValue,
      'total-blocking-time': lhr.audits['total-blocking-time'].numericValue
    }
    
    expect(metrics['first-contentful-paint']).toBeLessThan(2000) // 2s
    expect(metrics['largest-contentful-paint']).toBeLessThan(2500) // 2.5s
    expect(metrics['cumulative-layout-shift']).toBeLessThan(0.1)
    expect(metrics['total-blocking-time']).toBeLessThan(300) // 300ms
  })
  
  test('should handle user interactions smoothly', async ({ page }) => {
    const flow = await startFlow(page)
    
    // Navigate to page
    await flow.navigate({
      url: '/',
      stepName: 'Initial navigation'
    })
    
    // Simulate user interactions
    await page.click('[data-testid="services-button"]')
    await flow.continue({
      stepName: 'Open services modal'
    })
    
    await page.click('[data-testid="booking-form"]')
    await flow.continue({
      stepName: 'Open booking form'
    })
    
    // Fill form
    await page.fill('[data-testid="name-input"]', 'John Doe')
    await page.fill('[data-testid="email-input"]', 'john@example.com')
    await flow.continue({
      stepName: 'Fill booking form'
    })
    
    // Get flow results
    const { lhr } = await flow.createFlowResult()
    
    // Assert interaction performance
    const interactionMetrics = lhr.audits['user-timings'].details.items
    
    // Check that interactions complete within reasonable time
    for (const metric of interactionMetrics) {
      if (metric.name.includes('Click') || metric.name.includes('Keypress')) {
        expect(metric.duration).toBeLessThan(200) // 200ms max for interactions
      }
    }
  })
  
  test('should maintain performance on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Simulate mobile network conditions
    await page.route('**/*', async (route) => {
      // Add network throttling for mobile simulation
      await route.continue()
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Run mobile-specific Lighthouse audit
    const { lhr } = await audit(page, {
      onlyCategories: ['performance'],
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    })
    
    // Mobile has slightly relaxed thresholds but still strict
    expect(lhr.categories.performance.score).toBeGreaterThanOrEqual(0.8)
    
    const mobileMetrics = {
      'first-contentful-paint': lhr.audits['first-contentful-paint'].numericValue,
      'largest-contentful-paint': lhr.audits['largest-contentful-paint'].numericValue,
      'cumulative-layout-shift': lhr.audits['cumulative-layout-shift'].numericValue
    }
    
    expect(mobileMetrics['first-contentful-paint']).toBeLessThan(3000) // 3s for mobile
    expect(mobileMetrics['largest-contentful-paint']).toBeLessThan(4000) // 4s for mobile
    expect(mobileMetrics['cumulative-layout-shift']).toBeLessThan(0.1)
  })
})
```

### SEO & Structured Data Standards

**1. Advanced Structured Data Pattern**

```tsx
// ✅ Comprehensive structured data with proper validation
import { BUSINESS_INFO } from '@/data/constants'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

interface StructuredDataConfig {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'BreadcrumbList' | 'FAQPage' | 'Review'
  data?: Record<string, any>
  condition?: boolean
  priority?: boolean
}

interface StructuredDataProps {
  configs: StructuredDataConfig[]
}

export default function StructuredDataManager({ configs }: StructuredDataProps) {
  const pathname = usePathname()
  
  const structuredData = useMemo(() => {
    // Filter and validate structured data based on current page
    const validConfigs = configs.filter(config => {
      // Skip if condition is explicitly false
      if (config.condition === false) return false
      
      // Page-specific validation
      switch (config.type) {
        case 'BreadcrumbList':
          const items = config.data?.items
          return items && items.length >= 2 // Only show breadcrumbs with meaningful navigation
        
        case 'Organization':
        case 'LocalBusiness':
          return pathname === '/' // Only on homepage
        
        case 'Service':
          return pathname.startsWith('/services')
        
        case 'FAQPage':
          return pathname.startsWith('/faq') || config.data?.faqs?.length > 0
        
        case 'Review':
          return config.data?.reviews?.length > 0
        
        default:
          return true
      }
    })
    
    // Generate structured data objects with validation
    return validConfigs.map(config => {
      switch (config.type) {
        case 'Organization':
          return generateOrganizationData(config.data)
        
        case 'LocalBusiness':
          return generateLocalBusinessData(config.data)
        
        case 'BreadcrumbList':
          return generateBreadcrumbData(config.data)
        
        case 'Service':
          return generateServiceData(config.data)
        
        case 'FAQPage':
          return generateFAQData(config.data)
        
        case 'Review':
          return generateReviewData(config.data)
        
        default:
          return config.data || {}
      }
    }).filter(data => Object.keys(data).length > 0) // Remove empty objects
  }, [configs, pathname])
  
  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 0)
          }}
        />
      ))}
    </>
  )
}

// Data generators with validation
function generateOrganizationData(data: any) {
  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    description: BUSINESS_INFO.description,
    foundingDate: BUSINESS_INFO.foundedDate,
    areaServed: {
      '@type': 'Place',
      name: 'Dallas, Texas',
      address: generateAddressData()
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_INFO.phone,
      contactType: 'customer service',
      availableLanguage: ['English'],
      areaServed: 'US'
    },
    sameAs: generateSocialLinks(),
    openingHours: BUSINESS_INFO.hours.map(day => 
      `${day.name} ${day.open}-${day.close}`
    ),
    priceRange: '$$$',
    paymentAccepted: 'Cash, Credit Card, Digital'
  }
  
  // Validate required fields
  if (!orgData.name || !orgData.url) {
    console.warn('Missing required Organization fields')
    return null
  }
  
  return orgData
}

function generateLocalBusinessData(data: any) {
  const businessData = generateOrganizationData(data)
  if (!businessData) return null
  
  return {
    ...businessData,
    '@type': 'LocalBusiness',
    address: generateAddressData(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates?.lat,
      longitude: BUSINESS_INFO.coordinates?.lng
    },
    hasMap: BUSINESS_INFO.mapUrl,
    photo: BUSINESS_INFO.images?.[0],
    servesCuisine: ['Barber Services'],
    aggregateRating: BUSINESS_INFO.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS_INFO.aggregateRating.rating,
      reviewCount: BUSINESS_INFO.aggregateRating.count,
      bestRating: 5,
      worstRating: 1
    } : undefined
  }
}

function generateAddressData() {
  const addressParts = BUSINESS_INFO.address.split(', ')
  const streetAddress = addressParts[0]
  const cityStateZip = addressParts[1] || ''
  const [city, stateZip] = cityStateZip.split(', ')
  const [state, zipCode] = stateZip?.split(' ') || []
  
  return {
    '@type': 'PostalAddress',
    streetAddress,
    addressLocality: city || 'Dallas',
    addressRegion: state || 'TX',
    postalCode: zipCode || '75201',
    addressCountry: 'US'
  }
}

function generateSocialLinks() {
  const social = BUSINESS_INFO.social || {}
  const links = []
  
  if (social.instagram) {
    links.push(`https://www.instagram.com/${social.instagram}`)
  }
  if (social.facebook) {
    links.push(`https://www.facebook.com/${social.facebook}`)
  }
  if (social.twitter) {
    links.push(`https://twitter.com/${social.twitter}`)
  }
  if (social.youtube) {
    links.push(`https://www.youtube.com/${social.youtube}`)
  }
  
  return links
}

function generateBreadcrumbData(data: any) {
  const { items } = data
  
  if (!items || items.length < 2) {
    return null
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
      ...(item.image && { image: item.image })
    }))
  }
}

function generateServiceData(data: any) {
  const { service, barber } = data
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url
    },
    areaServed: generateAddressData(),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Barber Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description
          },
          price: service.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString()
        }
      ]
    },
    ...(barber && {
      performer: {
        '@type': 'Person',
        name: barber.name,
        jobTitle: 'Barber',
        image: barber.image,
        description: barber.description
      }
    })
  }
}

function generateFAQData(data: any) {
  const { faqs } = data
  
  if (!faqs || faqs.length === 0) {
    return null
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

function generateReviewData(data: any) {
  const { reviews, aggregateRating } = data
  
  if (!reviews || reviews.length === 0) {
    return null
  }
  
  const reviewData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    review: reviews.map((review: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.comment,
      datePublished: review.date,
      ...(review.helpful && {
        helpfulVoting: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction',
          userInteractionCount: review.helpful
        }
      })
    }))
  }
  
  // Add aggregate rating if available
  if (aggregateRating) {
    reviewData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.rating,
      reviewCount: aggregateRating.count,
      bestRating: 5,
      worstRating: 1
    }
  }
  
  return reviewData
}
```

**2. Advanced Meta Tag Management**

```tsx
// ✅ Dynamic meta tag generation with SEO optimization
import { Metadata } from 'next'
import { BUSINESS_INFO } from '@/data/constants'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  openGraph?: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    locale?: string
    siteName?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
    image?: string
    creator?: string
    site?: string
  }
  jsonLd?: any[]
  alternates?: {
    languages: Record<string, string>
    canonical?: string
  }
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = BUSINESS_INFO.url
  const defaultTitle = BUSINESS_INFO.name
  const defaultDescription = BUSINESS_INFO.description
  
  const title = config.title ? `${config.title} | ${defaultTitle}` : defaultTitle
  const description = config.description || defaultDescription
  const canonical = config.canonical ? `${baseUrl}${config.canonical}` : baseUrl
  
  const metadata: Metadata = {
    title,
    description,
    keywords: config.keywords?.join(', '),
    authors: [{ name: BUSINESS_INFO.name }],
    creator: BUSINESS_INFO.name,
    publisher: BUSINESS_INFO.name,
    
    // Canonical URL
    alternates: {
      canonical: canonical,
      ...(config.alternates?.languages && {
        languages: config.alternates.languages
      })
    },
    
    // Robots meta
    robots: {
      index: !config.noindex,
      follow: !config.nofollow,
      googleBot: {
        index: !config.noindex,
        follow: !config.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    // Open Graph
    openGraph: {
      title: config.openGraph?.title || title,
      description: config.openGraph?.description || description,
      url: config.openGraph?.url ? `${baseUrl}${config.openGraph.url}` : canonical,
      siteName: config.openGraph?.siteName || BUSINESS_INFO.name,
      locale: config.openGraph?.locale || 'en_US',
      type: config.openGraph?.type || 'website',
      ...(config.openGraph?.image && {
        images: [
          {
            url: config.openGraph.image,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg'
          }
        ]
      })
    },
    
    // Twitter Card
    twitter: {
      card: config.twitter?.card || 'summary_large_image',
      title: config.twitter?.title || title,
      description: config.twitter?.description || description,
      creator: config.twitter?.creator || `@${BUSINESS_INFO.social?.twitter || BUSINESS_INFO.name}`,
      site: config.twitter?.site || `@${BUSINESS_INFO.social?.twitter || BUSINESS_INFO.name}`,
      ...(config.twitter?.image && {
        images: [config.twitter.image]
      })
    },
    
    // Verification and other meta tags
    verification: {
      google: BUSINESS_INFO.verification?.google,
      yandex: BUSINESS_INFO.verification?.yandex,
      bing: BUSINESS_INFO.verification?.bing
    },
    
    // App icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png'
      }
    },
    
    // Additional meta tags
    other: {
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
      'format-detection': 'telephone=no',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': BUSINESS_INFO.name,
      'application-name': BUSINESS_INFO.name,
      'msapplication-tooltip': BUSINESS_INFO.description,
      'msapplication-starturl': '/',
      'msapplication-navbutton-color': '#000000',
      'msapplication-window': 'width=1024;height=768'
    }
  }
  
  return metadata
}

// Usage examples
export const homePageMetadata = generateMetadata({
  title: 'Professional Barber Services in Dallas',
  description: 'Experience the best barber services in Dallas. Expert cuts, shaves, and grooming at The Barber Cave.',
  keywords: ['barber', 'haircut', 'dallas', 'grooming', 'mens haircut', 'shave'],
  openGraph: {
    type: 'website',
    image: '/images/og-home.jpg'
  },
  jsonLd: [
    {
      type: 'Organization',
      data: BUSINESS_INFO
    },
    {
      type: 'LocalBusiness',
      data: BUSINESS_INFO
    }
  ]
})

export const servicesPageMetadata = generateMetadata({
  title: 'Our Barber Services',
  description: 'Complete range of professional barber services including haircuts, shaves, beard trimming, and more.',
  keywords: ['barber services', 'haircut styles', 'beard trim', 'hot towel shave', 'dallas barber'],
  canonical: '/services',
  openGraph: {
    title: 'Professional Barber Services - The Barber Cave',
    image: '/images/og-services.jpg'
  },
  jsonLd: [
    {
      type: 'Service',
      data: {
        name: 'Barber Services',
        description: 'Professional barber and grooming services'
      }
    }
  ]
})
```

**3. Advanced Sitemap Generation**

```tsx
// ✅ Dynamic sitemap generation with priority and update frequency
import { MetadataRoute } from 'next'
import { services, barbers } from '@/data'
import { BUSINESS_INFO } from '@/data/constants'

interface SitemapEntry {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.url
  
  // Static pages with their priorities and update frequencies
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/barbers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ]
  
  // Dynamic service pages
  const servicePages: SitemapEntry[] = services.map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))
  
  // Dynamic barber pages
  const barberPages: SitemapEntry[] = barbers.map((barber) => ({
    url: `${baseUrl}/barbers/${barber.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }))
  
  // Gallery category pages
  const galleryCategories = ['mens-cuts', 'beard-styles', 'classic-shaves', 'modern-styles']
  const galleryPages: SitemapEntry[] = galleryCategories.map((category) => ({
    url: `${baseUrl}/gallery/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))
  
  // Blog posts (if applicable)
  const blogPosts: SitemapEntry[] = [
    {
      url: `${baseUrl}/blog/barber-trends-2026`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/blog/beard-care-tips`,
      lastModified: new Date('2026-01-10'),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]
  
  // Combine all entries
  const allEntries = [
    ...staticPages,
    ...servicePages,
    ...barberPages,
    ...galleryPages,
    ...blogPosts
  ]
  
  // Sort by priority (highest first) and then by URL
  const sortedEntries = allEntries.sort((a, b) => {
    if (b.priority !== a.priority) {
      return (b.priority || 0) - (a.priority || 0)
    }
    return a.url.localeCompare(b.url)
  })
  
  return sortedEntries
}

// Generate robots.txt
export function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS_INFO.url
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/temp/',
          '*.json',
          '/search'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/search'
        ],
        crawlDelay: 1
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/'
        ],
        crawlDelay: 1
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
```

### Code Quality Standards

**1. ESLint Configuration for Modern React**

```javascript
// eslint.config.mjs - Modern flat config
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      },
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'warn',
      
      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always'
        }
      ]
    }
  },
  {
    // Ignore story files for stricter linting
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/no-static-element-interactions': 'off'
    }
  },
  {
    // Test file configuration
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/alt-text': 'off' // Test images may not have alt text
    }
  }
]
```

**2. TypeScript Configuration for Strict Type Safety**

```json
// tsconfig.json - Strict TypeScript configuration
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/data/*": ["./src/data/*"],
      "@/types/*": ["./src/types/*"]
    },
    // Additional strict rules
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", "storybook-static"]
}
```

## Critical Priority (P1) Best Practices

### Image Optimization Standards

**Core Principles for P1 Image Fixes:**

1. **LCP Optimization**: Always use `priority` prop for hero images that affect Largest Contentful Paint
2. **Placeholder Strategy**: Use `placeholder="blur"` only for raster images (JPEG, PNG, WebP), never for SVG
3. **Error Handling**: Implement fallback mechanisms for failed image loads
4. **Responsive Sizing**: Provide appropriate `sizes` attribute for optimal responsive loading

```tsx
// ✅ Production-ready image component pattern
const ProductionImage = ({ 
  src, 
  alt, 
  isHero = false, 
  isSvg = false,
  fallbackSrc = '/images/fallback.jpg' 
}) => {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        priority={isHero} // Critical for LCP elements
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder={isSvg ? undefined : "blur"} // Never use with SVG
        blurDataURL={isSvg ? undefined : generateBlurDataURL(src)}
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackSrc
        }}
      />
    </div>
  )
}
```

### Component Architecture Standards

**P1 Component Fix Patterns:**

1. **Error Boundaries**: Implement comprehensive error handling with retry logic
2. **Ref Forwarding**: Use `forwardRef` for all interactive components
3. **Props Validation**: Leverage TypeScript for strict type checking
4. **Accessibility**: Ensure WCAG 2.2 AA compliance for all components

```tsx
// ✅ Advanced component pattern for P1 fixes
import { forwardRef, useState, useEffect } from 'react'
import type { ComponentProps } from 'react'

interface SafeComponentProps extends ComponentProps<'div'> {
  variant?: 'primary' | 'secondary'
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

const SafeComponent = forwardRef<HTMLDivElement, SafeComponentProps>(
  ({ children, variant = 'primary', fallback, onError, ...props }, ref) => {
    const [hasError, setHasError] = useState(false)
    
    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setHasError(true)
        onError?.(new Error(event.message))
      }
      
      window.addEventListener('error', handleError)
      return () => window.removeEventListener('error', handleError)
    }, [onError])
    
    if (hasError) {
      return fallback || <div>Something went wrong</div>
    }
    
    return (
      <div 
        ref={ref} 
        className={`component component--${variant}`}
        role={props.role || 'region'}
        aria-label={props['aria-label']}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SafeComponent.displayName = 'SafeComponent'
```

### Data Integrity Standards

**Critical Data Handling Patterns:**

1. **Schema Validation**: Use Zod for runtime data validation
2. **Type Safety**: Implement strict TypeScript interfaces
3. **Error Recovery**: Provide fallback data structures
4. **Data Consistency**: Ensure single source of truth

```typescript
// ✅ Advanced data validation pattern
import { z } from 'zod'

const BusinessInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().regex(/^[^,]+, [^,]+, [A-Z]{2} \d{5}$/),
  phone: z.string().regex(/^\+?1?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/),
  hours: z.array(z.object({
    name: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/)
  }))
})

// Type-safe data extraction
const extractPostalCode = (address: string): string => {
  const match = address.match(/([A-Z]{2}) (\d{5})$/)
  if (!match) throw new Error('Invalid address format')
  return match[2] // Returns just the ZIP code
}

// Safe data access with fallback
const getBusinessInfo = (rawData: unknown) => {
  try {
    return BusinessInfoSchema.parse(rawData)
  } catch (error) {
    console.error('Invalid business data:', error)
    return getFallbackBusinessInfo()
  }
}
```

---

# 🔥 Critical (P1) — Due: 2026-03-05

* [ ] `T-1001` **Fix Hero.tsx next/image preload usage**

  * priority: 1
  * estimate_m: 30
  * labels: [bug, frontend, performance]
  * assignee: @frontend
  * status: blocked
  * due: 2026-03-05
  * deps: []
  * target_files: [src/components/Hero.tsx]
  * related_files: [src/__tests__/image-optimization.test.tsx, src/components/Hero.stories.tsx]
  * sub-tasks:

    - [x] Replace invalid `preload` prop with `priority` in src/components/Hero.tsx.
    - [x] Ensure no TypeScript or ESLint errors in src/components/Hero.tsx.
    - [x] Verify no Lighthouse FCP regression using src/__tests__/image-optimization.test.tsx.
    - [x] Run `npm run dev` locally and inspect browser network tab for image loading behavior.
    - [ ] Run Lighthouse audit and verify FCP score with src/components/Hero.stories.tsx. (Blocked: local Chrome/Chromium executable unavailable for LHCI in CI environment; Playwright browser download returned 403)

    1. Replace invalid `preload` prop with `priority` in src/components/Hero.tsx.
    2. No TypeScript or ESLint errors.
    3. No Lighthouse FCP regression.
  * test_steps:
    - [x] Run `npm run dev` locally.
    - [x] Inspect browser network tab for image loading behavior.
    - [ ] Run Lighthouse audit and verify FCP score. (Blocked: local Chrome/Chromium executable unavailable for LHCI in CI environment; Playwright browser download returned 403)

  * **Existing Code Pattern:**
    ```tsx
    <Image 
      src="/images/hero/hero-bg.svg"
      alt=""
      fill
      preload  // Invalid prop - should be 'priority'
      quality={75}
      sizes="100vw"
      className="object-cover"
    />
    ```

  * **Corrected Pattern:**
    ```tsx
    <Image 
      src="/images/hero/hero-bg.svg"
      alt=""
      fill
      priority  // Correct prop for preloading hero images
      quality={75}
      sizes="100vw"
      className="object-cover"
    />
    ```

---

* [ ] `T-1002` **Fix Gallery.tsx SVG blur placeholder**

  * priority: 1
  * estimate_m: 45
  * labels: [bug, frontend, images]
  * assignee: @frontend
  * status: blocked
  * due: 2026-03-05
  * target_files: [src/components/Gallery.tsx]
  * related_files: [src/__tests__/image-optimization.test.tsx, src/components/Gallery.stories.tsx, src/components/__tests__/Gallery.test.tsx]
  * sub-tasks:

    - [x] Provide valid `blurDataURL` or remove `placeholder="blur"` in src/components/Gallery.tsx.
    - [x] Ensure no console warnings in src/components/Gallery.tsx.
    - [ ] Run preview build and check image render and network payload. (Blocked: Google Fonts fetch failed in CI environment)
    - [x] Verify behavior using src/__tests__/image-optimization.test.tsx and src/components/Gallery.stories.tsx.

    1. Provide valid `blurDataURL` OR remove `placeholder="blur"`.
    2. No console warnings.
  * test_steps:

    - Run preview build.
    - Check image render and network payload.
  * notes: For SVG placeholders, provide a base64 encoded data URL or omit the placeholder prop.

  * **Existing Code Pattern:**
    ```tsx
    {galleryItems.map((item) => (
      <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
        <Image 
          src={item.src}  // SVG file: '/images/gallery/work-1.svg'
          alt={item.alt}
          fill
          placeholder="blur"  // Invalid for SVG - causes console warnings
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        // ... overlay content
      </div>
    ))}
    ```

  * **Corrected Pattern:**
    ```tsx
    {galleryItems.map((item) => (
      <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
        <Image 
          src={item.src}  // SVG file: '/images/gallery/work-1.svg'
          alt={item.alt}
          fill
          // Remove placeholder for SVG images (or provide blurDataURL for raster images)
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        // ... overlay content
      </div>
    ))}
    ```

---

* [ ] `T-1003` **Fix Barbers.tsx blur placeholder**

  * priority: 1
  * estimate_m: 45
  * labels: [bug, frontend, images]
  * assignee: @frontend
  * status: blocked
  * due: 2026-03-05
  * deps: [T-1002]
  * target_files: [src/components/Barbers.tsx]
  * related_files: [src/data/barbers.ts, src/components/Barbers.stories.tsx, src/components/__tests__/Barbers.test.tsx, src/__tests__/image-optimization.test.tsx]
  * sub-tasks:

    - [x] Apply same fix pattern as T-1002 to barber images in src/components/Barbers.tsx.
    - [x] Ensure no image warnings in console for src/components/Barbers.tsx.
    - [ ] Run preview build and verify no console warnings. (Blocked: Google Fonts fetch failed in CI environment)
    - [x] Verify using src/components/Barbers.stories.tsx and src/__tests__/image-optimization.test.tsx.

    1. Same resolution pattern as T-1002.
    2. No image warnings in console.
  * test_steps:

    - Apply same fix pattern as T-1002 to barber images.
    - Run preview build and verify no console warnings.
  * notes: Ensure barber images use valid blur placeholders or remove placeholder prop.

  * **Existing Code Pattern:**
    ```tsx
    {barbersData.map((barber) => (
      <div key={barber.id} className="barber-card text-center group container-card">
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-200 aspect-square">
          <Image 
            src={barber.image}  // SVG file: '/images/barbers/trill-l.svg'
            alt={barber.name}
            fill
            placeholder="blur"  // Invalid for SVG - causes console warnings
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          // ... availability badge
        </div>
        // ... barber info
      </div>
    ))}
    ```

  * **Corrected Pattern:**
    ```tsx
    {barbersData.map((barber) => (
      <div key={barber.id} className="barber-card text-center group container-card">
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-200 aspect-square">
          <Image 
            src={barber.image}  // SVG file: '/images/barbers/trill-l.svg'
            alt={barber.name}
            fill
            // Remove placeholder for SVG images (or provide blurDataURL for raster images)
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          // ... availability badge
        </div>
        // ... barber info
      </div>
    ))}
    ```

---

* [x] `T-1004` **Fix P3Color.tsx rendering**

  * priority: 1
  * estimate_m: 60
  * labels: [bug, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-05
  * target_files: [src/components/P3Color.tsx]
  * related_files: [src/components/Hero.tsx]
  * sub-tasks:

    - [x] Ensure gradient renders from props (colors + angle) in src/components/P3Color.tsx.
    - [x] Ensure children render correctly in src/components/P3Color.tsx.
    - [x] Run unit tests for P3Color component.
    - [x] Check Storybook story for visual rendering using src/components/Hero.tsx.
    - [x] Verify gradient appearance in different browsers.

    1. Gradient renders from props (colors + angle).
    2. Children render correctly.
    3. Unit + Storybook visual checks pass.
  * test_steps:

    - Run unit tests for P3Color component.
    - Check Storybook story for visual rendering.
    - Verify gradient appearance in different browsers.
  * notes: Ensure the component handles P3 color space correctly and falls back gracefully.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/P3Color.tsx
    interface P3GradientProps {
      children: ReactNode;
      className?: string;
      from: string;
      to: string;
    }

    export function P3Gradient({ children, className = '', from, to }: P3GradientProps) {
      return (
        <div
          className={className}
          style={{
            background: `linear-gradient(to bottom, ${from}, ${to})`,  // Fixed direction, no angle support
          }}
        >
          {children}
        </div>
      );
    }
    ```

  * **Usage in Hero.tsx:**
    ```tsx
    <P3Gradient 
      className="absolute inset-0"
      from="color(display-p3 0 0 0 / 0.6)"
      to="color(display-p3 0 0 0 / 0.4)"
    >
      <Image src="/images/hero/hero-bg.svg" alt="" fill />
    </P3Gradient>
    ```

  * **Potential Issues to Fix:**
    - Missing angle prop support (currently fixed to "to bottom")
    - No fallback for browsers that don't support P3 color space
    - May need angle prop for gradient direction control

---

* [x] `T-1005` **Fix StructuredData.tsx postalCode extraction**

  * priority: 1
  * estimate_m: 30
  * labels: [bug, seo, data]
  * assignee: @seo
  * status: completed
  * due: 2026-03-05
  * target_files: [src/components/StructuredData.tsx]
  * related_files: [src/data/constants.ts]
  * sub-tasks:

    - [x] Ensure postalCode = '75201' in src/components/StructuredData.tsx.
    - [x] Ensure JSON-LD validates for PostalAddress in src/components/StructuredData.tsx.
    - [x] Validate JSON-LD output using a schema validator.
    - [x] Check that postalCode is extracted as '75201' not 'TX 75201' using src/data/constants.ts.

    1. postalCode = `75201`
    2. JSON-LD validates for PostalAddress.
  * test_steps:

    - Validate JSON-LD output using a schema validator.
    - Check that postalCode is extracted as '75201' not 'TX 75201'.
  * notes: Ensure the extraction logic correctly parses the address string.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/StructuredData.tsx (lines 40-44)
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.split(',')[0],
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": BUSINESS_INFO.address.split(', ')[2],  // BUG: extracts 'TX 75201'
      "addressCountry": "US"
    }
    ```

  * **Data Source:**
    ```tsx
    // src/data/constants.ts (line 127)
    address: '1234 Real Street, Dallas, TX 75201',
    ```

  * **Current Issue:**
    - `BUSINESS_INFO.address.split(', ')[2]` returns `'TX 75201'`
    - Should return just `'75201'` for proper PostalAddress schema validation

  * **Corrected Pattern:**
    ```tsx
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.split(',')[0],
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": BUSINESS_INFO.address.split(', ')[2].split(' ')[1],  // Extract '75201' only
      "addressCountry": "US"
    }
    ```

---

* [x] `T-1006` **Fix Services.tsx icon fallback**

  * priority: 1
  * estimate_m: 30
  * labels: [bug, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-05
  * target_files: [src/components/Services.tsx]
  * related_files: [src/data/services.ts, src/components/IconContainer.tsx]
  * sub-tasks:

    - [x] Implement fallback icon in src/components/Services.tsx.
    - [x] Ensure no runtime crashes in src/components/Services.tsx.
    - [x] Test services with missing icons to ensure fallback renders using src/data/services.ts and src/components/IconContainer.tsx.
    - [x] Run the app and navigate to services page without crashes.

    1. Fallback icon implemented.
    2. No runtime crashes.
  * test_steps:

    - Test services with missing icons to ensure fallback renders.
    - Run the app and navigate to services page without crashes.
  * notes: Add a default icon from Lucide React when service.icon is not found in the iconMap.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/Services.tsx (lines 88-89)
    const ServiceCard = memo(({ service }: { service: typeof services[0] }) => {
      const IconComponent = iconMap[service.icon as keyof typeof iconMap];  // CRASH: undefined if icon not found
      const isSpecial = service.id === 'new-client-special';
      
      return (
        <div className="service-card container-card...">
          <div className="flex items-center mb-4">
            <IconContainer bg={isSpecial ? 'amber' : 'black'}>
              <IconComponent className="w-6 h-6" />  // CRASH: Cannot render undefined
            </IconContainer>
            // ... rest of service card
          </div>
        </div>
      );
    });
    ```

  * **Icon Map:**
    ```tsx
    // src/components/Services.tsx (lines 42-66)
    const iconMap = {
      Crown, Scissors, Star, Users, Award, Zap, Sparkles, Gem, Heart,
      Target, Move, Smile, Flower, Diamond, Sun, Moon, RefreshCw,
      Wind, Droplet, Link, Plus, RotateCcw, ChevronRight
    };
    ```

  * **Service Data:**
    ```tsx
    // src/data/services.ts - various services with icon names
    { id: 'mens-haircut', icon: 'Users' },
    { id: 'new-client-special', icon: 'ChevronRight' },
    // If any service has an icon not in iconMap, it will crash
    ```

  * **Corrected Pattern:**
    ```tsx
    const ServiceCard = memo(({ service }: { service: typeof services[0] }) => {
      const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Star;  // Fallback to Star
      const isSpecial = service.id === 'new-client-special';
      
      return (
        <div className="service-card container-card...">
          <div className="flex items-center mb-4">
            <IconContainer bg={isSpecial ? 'amber' : 'black'}>
              <IconComponent className="w-6 h-6" />  // Safe: always has a component
            </IconContainer>
            // ... rest of service card
          </div>
        </div>
      );
    });
    ```

---

* [x] `T-1007` **Fix About.tsx Image fill positioning**

  * priority: 1
  * estimate_m: 30
  * labels: [bug, frontend, images]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-05
  * target_files: [src/components/About.tsx]
  * related_files: [src/components/__tests__/About.test.tsx, src/__tests__/image-optimization.test.tsx]
  * sub-tasks:

    - [x] Ensure parent wrapper uses `position: relative` in src/components/About.tsx.
    - [x] Ensure layout stable across breakpoints in src/components/About.tsx.
    - [x] Check About page layout on different screen sizes.
    - [x] Verify image fill positioning works correctly using src/components/__tests__/About.test.tsx and src/__tests__/image-optimization.test.tsx.

    1. Parent wrapper uses `position: relative`.
    2. Layout stable across breakpoints.
  * test_steps:

    - Check About page layout on different screen sizes.
    - Verify image fill positioning works correctly.
  * notes: Ensure the wrapper div has position: relative for Next.js Image fill to work.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/About.tsx (lines 107-117)
    <div className="relative">  // GOOD: Has position: relative
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
        <Image 
          src="/images/about/shop-interior.svg"
          alt="The Barber Cave Interior"
          fill
          quality={75}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
    ```

  * **Current Implementation Analysis:**
    - Outer div: `className="relative"` ✓ (correct)
    - Inner div: `className="aspect-square rounded-2xl overflow-hidden bg-gray-200"` ❌ (missing position: relative)
    - Image: `fill` prop requires parent to have `position: relative`

  * **Issue:**
    The Next.js Image component with `fill` prop needs its immediate parent to have `position: relative`. Currently the inner wrapper div doesn't have this positioning.

  * **Corrected Pattern:**
    ```tsx
    <div className="relative">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200">  // ADD position: relative
        <Image 
          src="/images/about/shop-interior.svg"
          alt="The Barber Cave Interior"
          fill
          quality={75}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
    ```

---

## High Priority (P2) Best Practices

### Error Boundary Architecture Standards

**Advanced Error Handling Patterns for P2 Fixes:**

1. **Reset Key Management**: Implement robust array comparison for error boundary resets
2. **Retry Logic**: Prevent infinite retry loops with exponential backoff
3. **Error Reporting**: Integrate with error monitoring services
4. **Graceful Degradation**: Provide meaningful fallbacks for different error types

```tsx
// ✅ Production-ready error boundary with advanced reset logic
import { Component, ErrorInfo, ReactNode } from 'react'
import type { Props, State } from './ErrorBoundary.types'

class AdvancedErrorBoundary extends Component<Props, State> {
  private retryTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private errorCount: Map<string, number> = new Map()
  
  componentDidUpdate(prevProps: Props) {
    const { resetKeys = [] } = this.props
    const { resetKeys: prevResetKeys = [] } = prevProps
    
    // Comprehensive reset logic: check length AND values
    const shouldReset = this.shouldResetBoundary(resetKeys, prevResetKeys)
    
    if (shouldReset) {
      this.resetBoundary()
    }
  }
  
  private shouldResetBoundary(current: Array<string | number>, previous: Array<string | number>): boolean {
    // Reset if length changed
    if (current.length !== previous.length) {
      return true
    }
    
    // Reset if any values changed
    return current.some((key, index) => key !== previous[index])
  }
  
  private resetBoundary = () => {
    const errorId = this.generateErrorId()
    const currentCount = this.errorCount.get(errorId) || 0
    
    // Exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, currentCount), 30000)
    
    if (currentCount >= 5) {
      // Max retries reached, show permanent error
      this.setState({ hasError: true, errorType: 'permanent' })
      return
    }
    
    const timeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        errorType: undefined
      })
    }, delay)
    
    this.retryTimeouts.set(errorId, timeoutId)
    this.errorCount.set(errorId, currentCount + 1)
  }
  
  private generateErrorId = (): string => {
    return `${this.state.error?.name || 'unknown'}-${Date.now()}`
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to error monitoring service
    this.reportError(error, errorInfo)
    
    // Categorize error type
    const errorType = this.categorizeError(error)
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorType
    })
  }
  
  private categorizeError = (error: Error): string => {
    if (error.name === 'ChunkLoadError') return 'chunk-load'
    if (error.message.includes('Network')) return 'network'
    if (error.message.includes('Permission')) return 'permission'
    return 'unknown'
  }
  
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Integration with error monitoring (Sentry, etc.)
    console.error('Error Boundary caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  }
}
```

### Navigation & Routing Standards

**P2 Navigation Component Patterns:**

1. **SPA Navigation**: Use Next.js router for client-side navigation
2. **Focus Management**: Implement proper focus restoration after navigation
3. **Route Validation**: Ensure navigation targets are valid
4. **Loading States**: Provide feedback during navigation transitions

```tsx
// ✅ Advanced navigation component with SPA behavior
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface SafeNavigationProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
  onClick?: () => void
}

export default function SafeNavigation({
  href,
  children,
  className,
  prefetch = true,
  onClick
}: SafeNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const linkRef = useRef<HTMLAnchorElement>(null)
  
  useEffect(() => {
    // Prefetch on hover for better UX
    if (prefetch && linkRef.current) {
      linkRef.current.addEventListener('mouseenter', () => {
        router.prefetch(href)
      })
    }
  }, [href, prefetch, router])
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Validate href
    if (!href || typeof href !== 'string') {
      console.error('Invalid navigation href:', href)
      return
    }
    
    // Check if it's an external link
    if (href.startsWith('http') || href.startsWith('//')) {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    
    // Execute custom onClick
    onClick?.()
    
    // Navigate with focus management
    try {
      await router.push(href)
      
      // Restore focus to main content after navigation
      setTimeout(() => {
        const mainContent = document.querySelector('main, [role="main"]')
        if (mainContent) {
          mainContent.focus()
        }
      }, 100)
    } catch (error) {
      console.error('Navigation failed:', error)
      // Fallback to window.location
      window.location.href = href
    }
  }
  
  const isActive = pathname === href
  
  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      role="link"
      tabIndex={0}
    >
      {children}
    </a>
  )
}
```

### Component Refactoring Standards

**P2 Component Modernization Patterns:**

1. **forwardRef Migration**: Convert legacy ref patterns to modern forwardRef
2. **Props Interface Design**: Create comprehensive TypeScript interfaces
3. **Component Composition**: Favor composition over inheritance
4. **Performance Optimization**: Implement memo and useMemo appropriately

```tsx
// ✅ Modern component pattern with forwardRef and composition
import { forwardRef, useMemo, useCallback } from 'react'
import type { HTMLAnchorElement, ComponentProps } from 'react'

// Comprehensive props interface
interface LinkWithIconProps extends Omit<ComponentProps<typeof Link>, 'ref'> {
  href: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  external?: boolean
  showExternalIcon?: boolean
  loading?: boolean
  disabled?: boolean
}

// Base Link component
const BaseLink = forwardRef<HTMLAnchorElement, ComponentProps<'a'>>((props, ref) => (
  <a ref={ref} {...props} />
))
BaseLink.displayName = 'BaseLink'

// Advanced LinkWithIcon with forwardRef
const LinkWithIcon = forwardRef<HTMLAnchorElement, LinkWithIconProps>(
  ({
    href,
    children,
    icon: IconComponent,
    variant = 'primary',
    size = 'md',
    external = false,
    showExternalIcon = external,
    loading = false,
    disabled = false,
    className,
    onClick,
    ...rest
  }, ref) => {
    // Memoize computed styles
    const computedClasses = useMemo(() => {
      const base = 'inline-flex items-center gap-2 font-medium transition-colors'
      const variants = {
        primary: 'text-blue-600 hover:text-blue-700',
        secondary: 'text-gray-600 hover:text-gray-700',
        ghost: 'text-transparent hover:text-current'
      }
      const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
      }
      const states = disabled ? 'opacity-50 cursor-not-allowed' : ''
      
      return `${base} ${variants[variant]} ${sizes[size]} ${states} ${className || ''}`
    }, [variant, size, disabled, className])
    
    // Memoize click handler
    const handleClick = useCallback((e: React.MouseEvent) => {
      if (disabled || loading) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }, [disabled, loading, onClick])
    
    // Memoize external icon
    const ExternalIcon = useMemo(() => {
      if (!showExternalIcon) return null
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )
    }, [showExternalIcon])
    
    return (
      <BaseLink
        ref={ref}
        href={href}
        className={computedClasses}
        onClick={handleClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled}
        {...rest}
      >
        {loading && (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        
        {IconComponent && !loading && (
          <IconComponent className="w-4 h-4 flex-shrink-0" />
        )}
        
        <span className="truncate">{children}</span>
        
        {ExternalIcon}
      </BaseLink>
    )
  }
)

LinkWithIcon.displayName = 'LinkWithIcon'
export default LinkWithIcon
```

### SEO & Structured Data Standards

**P2 SEO Optimization Patterns:**

1. **Schema Consolidation**: Eliminate duplicate structured data
2. **Breadcrumb Optimization**: Conditionally render based on navigation depth
3. **Meta Tag Management**: Implement dynamic meta tag generation
4. **Performance Optimization**: Minimize JSON-LD payload size

```tsx
// ✅ Advanced structured data management
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

interface StructuredDataConfig {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'BreadcrumbList'
  data?: Record<string, any>
  condition?: boolean
}

export function useStructuredData(configs: StructuredDataConfig[]) {
  const pathname = usePathname()
  
  return useMemo(() => {
    // Filter and validate structured data
    const validConfigs = configs.filter(config => {
      // Skip if condition is explicitly false
      if (config.condition === false) return false
      
      // Skip breadcrumb lists with less than 2 items
      if (config.type === 'BreadcrumbList') {
        const items = config.data?.items
        return items && items.length >= 2
      }
      
      // Skip Organization/LocalBusiness if not on homepage
      if (['Organization', 'LocalBusiness'].includes(config.type)) {
        return pathname === '/'
      }
      
      return true
    })
    
    // Generate structured data objects
    return validConfigs.map(config => {
      switch (config.type) {
        case 'BreadcrumbList':
          return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: config.data.items.map((item: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.href
            }))
          }
        
        case 'Organization':
        case 'LocalBusiness':
          return {
            '@context': 'https://schema.org',
            '@type': config.type,
            ...config.data
          }
        
        default:
          return config.data || {}
      }
    })
  }, [configs, pathname])
}

// Usage in layout component
export default function StructuredDataManager() {
  const structuredData = useStructuredData([
    {
      type: 'Organization',
      data: BUSINESS_INFO,
      condition: true // Only on homepage via useStructuredData logic
    },
    {
      type: 'BreadcrumbList',
      data: { items: breadcrumbItems },
      condition: breadcrumbItems.length >= 2
    }
  ])
  
  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 0)
          }}
        />
      ))}
    </>
  )
}
```

---

# 🟠 High (P2) — Due: 2026-03-08

Tasks normalized for consistency. All P2 tasks follow same structure.

* [x] `T-2001` **Fix ErrorBoundary.tsx resetKeys logic**

  * priority: 2
  * estimate_m: 45
  * labels: [bug, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-08
  * deps: []
  * target_files: [src/components/ErrorBoundary.tsx]
  * related_files: [src/components/ErrorBoundary.stories.tsx, src/components/__tests__/ErrorBoundary.test.tsx]
  * sub-tasks:

    - [x] Implement `resetKeys` to trigger reset when array length changes in src/components/ErrorBoundary.tsx.
    - [x] Implement `resetKeys` to trigger reset when values change in src/components/ErrorBoundary.tsx.
    - [x] Add unit tests for resetKeys logic in src/components/__tests__/ErrorBoundary.test.tsx.
    - [x] Run unit tests for ErrorBoundary component.
    - [x] Manually test error reset scenarios in development using src/components/ErrorBoundary.stories.tsx.

    1. `resetKeys` triggers reset when its array length changes.
    2. `resetKeys` triggers reset when its values change.
    3. Unit tests added and passing.
  * test_steps:

    - Run unit tests for ErrorBoundary component.
    - Manually test error reset scenarios in development.
  * notes: Implement resetKeys as an array that triggers reset when it changes.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (lines 59-70)
    componentDidUpdate(prevProps: Props) {
      const { resetKeys } = this.props;
      const { resetKeys: prevResetKeys } = prevProps;

      // Reset error boundary if resetKeys have changed
      if (resetKeys && prevResetKeys && resetKeys.length === prevResetKeys.length) {  // BUG: Only checks length
        const hasChanged = resetKeys.some((key, index) => key !== prevResetKeys[index]);
        if (hasChanged) {
          this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        }
      }
    }
    ```

  * **Current Issues:**
    - Line 64: Only triggers reset when `resetKeys.length === prevResetKeys.length`
    - If array length changes (e.g., from `[1,2]` to `[1]`), reset doesn't trigger
    - Should trigger reset on ANY change to resetKeys array

  * **Corrected Pattern:**
    ```tsx
    componentDidUpdate(prevProps: Props) {
      const { resetKeys } = this.props;
      const { resetKeys: prevResetKeys } = prevProps;

      // Reset error boundary if resetKeys have changed (length OR values)
      if (resetKeys && prevResetKeys) {
        // Check if length changed
        if (resetKeys.length !== prevResetKeys.length) {
          this.setState({ hasError: false, error: undefined, errorInfo: undefined });
          return;
        }
        
        // Check if values changed
        const hasChanged = resetKeys.some((key, index) => key !== prevResetKeys[index]);
        if (hasChanged) {
          this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        }
      }
    }
    ```
* [x] `T-2002` **Fix ErrorBoundary.tsx retry bypass**

  * priority: 2
  * estimate_m: 30
  * labels: [bug, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-08
  * deps: []
  * target_files: [src/components/ErrorBoundary.tsx]
  * related_files: [src/components/ErrorBoundary.stories.tsx, src/components/__tests__/ErrorBoundary.test.tsx]
  * sub-tasks:

    - [x] Ensure retry count is preserved when error occurs in src/components/ErrorBoundary.tsx.
    - [x] Ensure retry count is not reset in getDerivedStateFromError in src/components/ErrorBoundary.tsx.
    - [x] Add unit tests to verify retry logic in src/components/__tests__/ErrorBoundary.test.tsx.
    - [x] Run unit tests for ErrorBoundary retry functionality.
    - [x] Simulate errors and check retry behavior using src/components/ErrorBoundary.stories.tsx.

    1. Retry count is preserved when error occurs.
    2. Retry count is not reset in getDerivedStateFromError.
    3. Unit tests verify retry logic.
  * test_steps:

    - Run unit tests for ErrorBoundary retry functionality.
    - Simulate errors and check retry behavior.
  * notes: Ensure retry state is managed separately from error state.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (lines 36-38)
    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error, retryCount: 0 };  // BUG: Resets retry count to 0
    }

    // src/components/ErrorBoundary.tsx (lines 72-106)
    handleReset = () => {
      const newRetryCount = this.state.retryCount + 1;  // Increments retry count

      // Always update retry count for UI state management
      this.setState({ retryCount: newRetryCount });

      // Prevent infinite retries - show permanent error after 3 attempts
      if (newRetryCount >= 3) {
        // Don't reset error state, just update retry count so UI shows permanent error
        return;
      }

      // Reset error state to allow retry
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined
      });
    };
    ```

  * **Current Issues:**
    - Line 37: `getDerivedStateFromError` resets `retryCount: 0` every time a new error occurs
    - This defeats the retry limit mechanism - user gets infinite retries
    - Should preserve existing retry count when new errors occur

  * **Corrected Pattern:**
    ```tsx
    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };  // Don't reset retryCount
    }

    // In constructor, ensure retryCount is initialized
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false, retryCount: 0 };
    }

    // Or better yet, preserve retryCount from previous state
    static getDerivedStateFromError(error: Error, prevState: State): State {
      return { 
        hasError: true, 
        error, 
        retryCount: prevState.retryCount  // Preserve existing retry count
      };
    }
    ```
* [x] `T-2003` **Consolidate duplicate structured data in layout.tsx**

  * priority: 2
  * estimate_m: 30
  * labels: [cleanup, seo, performance]
  * assignee: @seo
  * status: completed
  * due: 2026-03-08
  * deps: []
  * target_files: [src/app/layout.tsx]
  * related_files: [src/components/StructuredData.tsx]
  * sub-tasks:

    - [ ] Ensure single authoritative JSON-LD for Organization/LocalBusiness in src/app/layout.tsx.
    - [ ] Validate output against schema in src/app/layout.tsx.
    - [ ] Ensure no duplicate structured data by removing from src/components/StructuredData.tsx.
    - [ ] Run the app and check JSON-LD output.
    - [ ] Validate using schema validator.

    1. Single authoritative JSON-LD for Organization/LocalBusiness.
    2. Validate output against schema.
    3. No duplicate structured data.
  * test_steps:

    - Run the app and check JSON-LD output.
    - Validate using schema validator.
  * notes: Move structured data to layout.tsx and remove from other locations.

  * **Existing Code Pattern:**
    ```tsx
    // src/app/layout.tsx (lines 58-61)
    <head>
      <StructuredData type="Organization" />
      <StructuredData type="LocalBusiness" />
    </head>
    ```

  * **StructuredData Component Usage:**
    ```tsx
    // src/components/StructuredData.tsx - Used throughout the app
    // Multiple instances can be rendered in different components
    // This creates duplicate JSON-LD scripts in the DOM
    ```

  * **Current Issues:**
    - Duplicate Organization and LocalBusiness schemas in page head
    - Multiple JSON-LD scripts for same business entity
    - SEO confusion and potential search engine penalties
    - Performance impact from redundant structured data

  * **Corrected Pattern:**
    ```tsx
    // src/app/layout.tsx - Single authoritative source
    <head>
      <StructuredData type="Organization" />
      <StructuredData type="LocalBusiness" />
      {/* Remove all other Organization/LocalBusiness instances */}
    </head>

    // Other components should only use:
    // - StructuredData type="BreadcrumbList" 
    // - StructuredData type="Service"
    // Never use Organization/LocalBusiness outside layout.tsx
    ```

  * **Files to Update:**
    - Remove Organization/LocalBusiness StructuredData from all components except layout.tsx
    - Keep only BreadcrumbList and Service types in other components
* [x] `T-2004` **Fix page.tsx breadcrumbs rendering**

  * priority: 2
  * estimate_m: 45
  * labels: [bug, frontend, navigation]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-08
  * deps: []
  * target_files: [src/app/page.tsx]
  * related_files: [src/components/Breadcrumbs.tsx]
  * sub-tasks:

    - [x] Ensure breadcrumbs render when breadcrumbItems.length >= 2 in src/app/page.tsx.
    - [x] Ensure navigation links are correct in src/app/page.tsx using src/components/Breadcrumbs.tsx.
    - [x] Verify visual and functional testing passes.
    - [x] Navigate to pages with different breadcrumb depths.
    - [x] Verify breadcrumbs appear and link correctly.

    1. Breadcrumbs render when breadcrumbItems.length >= 2.
    2. Navigation links are correct.
    3. Visual and functional testing passes.
  * test_steps:

    - Navigate to pages with different breadcrumb depths.
    - Verify breadcrumbs appear and link correctly.
  * notes: Conditionally render breadcrumbs based on item count.

  * **Existing Code Pattern:**
    ```tsx
    // src/app/page.tsx (lines 39-41, 55-59)
    const breadcrumbItems = [
      { name: 'Home', href: '/' }
    ];

    // Only render breadcrumbs if there's actual navigation value (more than 1 item)
    {breadcrumbItems.length > 1 && (
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    )}
    ```

  * **Current Issues:**
    - Line 55: Uses `> 1` condition, but task description says `>= 2`
    - Home page has only 1 breadcrumb item, so breadcrumbs don't render
    - Should render breadcrumbs when there are 2+ items for meaningful navigation
    - Current logic is correct but inconsistent with task requirements

  * **Expected Behavior:**
    - Home page: 1 item ("Home") → No breadcrumbs (correct)
    - Services page: 2 items ("Home", "Services") → Should show breadcrumbs
    - Service detail page: 3 items ("Home", "Services", "Haircut") → Should show breadcrumbs

  * **Corrected Pattern:**
    ```tsx
    // Consistent with task requirements
    {breadcrumbItems.length >= 2 && (
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    )}
    ```

  * **Note:** Current implementation (`> 1`) is functionally equivalent to `>= 2`, but should be updated for consistency with task specification.
* [x] `T-2005` **Convert LinkWithIcon.tsx to forwardRef**

  * priority: 2
  * estimate_m: 30
  * labels: [refactor, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-08
  * deps: []
  * target_files: [src/components/LinkWithIcon.tsx]
  * related_files: [src/components/Barbers.tsx, src/components/Services.tsx]
  * sub-tasks:

    - [x] Convert component to use forwardRef pattern in src/components/LinkWithIcon.tsx.
    - [x] Ensure existing consumers (src/components/Barbers.tsx, src/components/Services.tsx) update without runtime warnings.
    - [x] Ensure TypeScript types are correct in src/components/LinkWithIcon.tsx.
    - [x] Check that ref is properly forwarded.
    - [x] Run tests and ensure no warnings.

    1. Component uses forwardRef pattern.
    2. Existing consumers update without runtime warnings.
    3. TypeScript types are correct.
  * test_steps:

    - Check that ref is properly forwarded.
    - Run tests and ensure no warnings.
  * notes: Use React.forwardRef to allow ref access to the underlying link element.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/LinkWithIcon.tsx (lines 31-42, 54-64)
    interface LinkWithIconProps {
      href: string;
      children: React.ReactNode;
      icon?: React.ComponentType<{ className?: string }>;
      variant?: LinkVariant;
      className?: string;
      target?: string;
      rel?: string;
      external?: boolean;
      ref?: React.Ref<HTMLAnchorElement>;  // Already has ref prop
    }

    export default function LinkWithIcon({
      href,
      children,
      icon: Icon = ChevronRight,
      variant = 'default',
      className,
      target,
      rel,
      external,
      ref,  // Already accepts ref
    }: LinkWithIconProps) {
      // Component logic...
    }
    ```

  * **Current Implementation Analysis:**
    - Component already accepts a `ref` prop in the interface
    - Uses React 19 ref-as-prop pattern (lines 80, 95)
    - Does NOT use `React.forwardRef()` wrapper
    - This may cause TypeScript warnings in some scenarios

  * **Current Issues:**
    - Not using `forwardRef` wrapper may cause ref forwarding issues
    - React 19 ref-as-prop works but `forwardRef` is more explicit
    - Some consumers may expect traditional forwardRef pattern

  * **Corrected Pattern:**
    ```tsx
    import { forwardRef } from 'react';

    interface LinkWithIconProps {
      href: string;
      children: React.ReactNode;
      icon?: React.ComponentType<{ className?: string }>;
      variant?: LinkVariant;
      className?: string;
      target?: string;
      rel?: string;
      external?: boolean;
      // Remove ref from props - will be provided by forwardRef
    }

    const LinkWithIcon = forwardRef<HTMLAnchorElement, LinkWithIconProps>(({
      href,
      children,
      icon: Icon = ChevronRight,
      variant = 'default',
      className,
      target,
      rel,
      external,
    }, ref) => {
      // Component implementation with forwarded ref
      const baseClasses = 'inline-flex items-center font-semibold transition-colors';
      const variantClasses = {
        default: 'text-black hover:text-amber-500',
        accent: 'text-amber-500 hover:text-black',
      };
      const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();
      const isExternal = external ?? isExternalUrl(href);

      if (isExternal) {
        return (
          <a
            ref={ref}
            href={href}
            target={target}
            rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
            className={classes}
          >
            {children}
            <Icon className="h-5 w-5 ml-2" />
          </a>
        );
      }

      return (
        <Link
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          className={classes}
        >
          {children}
          <Icon className="h-5 w-5 ml-2" />
        </Link>
      );
    });

    LinkWithIcon.displayName = 'LinkWithIcon';
    export default LinkWithIcon;
    ```

---

# 🟡 Medium (P3) — Due: 2026-03-12

* [x] `T-3001` **Add angle prop support to P3Color.tsx**

  * priority: 3
  * estimate_m: 45
  * labels: [enhancement, frontend, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-12
  * deps: []
  * target_files: [src/components/P3Color.tsx]
  * related_files: [src/components/Hero.tsx, src/components/P3Color.stories.tsx]
  * sub-tasks:

    - [x] Add optional `angle` prop to P3Gradient interface in src/components/P3Color.tsx.
    - [x] Update gradient CSS to use angle parameter when provided in src/components/P3Color.tsx.
    - [x] Ensure backward compatibility with existing usage in src/components/Hero.tsx.
    - [x] Add Storybook stories for different angle values.
    - [x] Test gradient rendering at various angles.

    1. Optional `angle` prop added to interface.
    2. Gradient CSS uses angle parameter when provided.
    3. Backward compatibility maintained.
  * test_steps:

    - Add Storybook stories for different angle values.
    - Test gradient rendering at various angles.
  * notes: Default angle should be "to bottom" for backward compatibility.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/P3Color.tsx (current implementation)
    interface P3GradientProps {
      children: ReactNode;
      className?: string;
      from: string;
      to: string;
    }

    export function P3Gradient({ children, className = '', from, to }: P3GradientProps) {
      return (
        <div
          className={className}
          style={{
            background: `linear-gradient(to bottom, ${from}, ${to})`,  // Fixed direction
          }}
        >
          {children}
        </div>
      );
    }
    ```

  * **Enhanced Pattern:**
    ```tsx
    // src/components/P3Color.tsx (enhanced with angle support)
    interface P3GradientProps {
      children: ReactNode;
      className?: string;
      from: string;
      to: string;
      angle?: string; // Optional angle prop
    }

    export function P3Gradient({ 
      children, 
      className = '', 
      from, 
      to, 
      angle = 'to bottom' // Default for backward compatibility
    }: P3GradientProps) {
      return (
        <div
          className={className}
          style={{
            background: `linear-gradient(${angle}, ${from}, ${to})`,  // Dynamic angle
          }}
        >
          {children}
        </div>
      );
    }
    ```

  * **Usage Examples:**
    ```tsx
    // Existing usage (unchanged)
    <P3Gradient from="color(display-p3 0 0 0 / 0.6)" to="color(display-p3 0 0 0 / 0.4)">
      <Image src="/images/hero/hero-bg.svg" alt="" fill />
    </P3Gradient>

    // New usage with custom angles
    <P3Gradient 
      from="color(display-p3 0.831 0.647 0.455 / 0.8)" 
      to="color(display-p3 0 0 0 / 0.2)"
      angle="135deg"
    >
      <div>Content</div>
    </P3Gradient>

    <P3Gradient 
      from="color(display-p3 1 0 0 / 0.6)" 
      to="color(display-p3 0 0 1 / 0.6)"
      angle="to right"
    >
      <div>Content</div>
    </P3Gradient>
    ```

---

* [ ] `T-3002` **Add P3 color fallback support**

  * priority: 3
  * estimate_m: 60
  * labels: [enhancement, frontend, accessibility]
  * assignee: @frontend
  * status: open
  * due: 2026-03-12
  * deps: [T-3001]
  * target_files: [src/components/P3Color.tsx]
  * related_files: [src/components/Hero.tsx]
  * sub-tasks:

    - [ ] Add @supports query for P3 color space detection in src/components/P3Color.tsx.
    - [ ] Provide sRGB fallback colors for P3 gradients in src/components/P3Color.tsx.
    - [ ] Ensure graceful degradation on unsupported browsers in src/components/P3Color.tsx.
    - [ ] Test on browsers with and without P3 support.
    - [ ] Verify performance impact of fallback logic.

    1. @supports query detects P3 color space support.
    2. sRGB fallback colors provided.
    3. Graceful degradation on unsupported browsers.
  * test_steps:

    - Test on browsers with and without P3 support.
    - Verify performance impact of fallback logic.
  * notes: Use CSS @supports for feature detection, maintain visual consistency.

  * **Enhanced Pattern with Fallback:**
    ```tsx
    // src/components/P3Color.tsx (with P3 fallback support)
    interface P3GradientProps {
      children: ReactNode;
      className?: string;
      from: string;
      to: string;
      angle?: string;
      // Optional sRGB fallback colors
      fallbackFrom?: string;
      fallbackTo?: string;
    }

    // Helper function to convert P3 colors to sRGB fallbacks
    function convertP3ToSRGB(p3Color: string): string {
      // Simple conversion for common P3 colors to sRGB equivalents
      // In production, use a proper color space conversion library
      const colorMap: Record<string, string> = {
        'color(display-p3 0 0 0 / 0.6)': 'rgba(0, 0, 0, 0.6)',
        'color(display-p3 0 0 0 / 0.4)': 'rgba(0, 0, 0, 0.4)',
        'color(display-p3 0.831 0.647 0.455 / 0.3)': 'rgba(212, 165, 116, 0.3)',
        'color(display-p3 0.831 0.647 0.455 / 0.8)': 'rgba(212, 165, 116, 0.8)',
      };
      
      return colorMap[p3Color] || p3Color.replace(/color\(display-p3\s+/, '').replace(/\)/, '');
    }

    export function P3Gradient({ 
      children, 
      className = '', 
      from, 
      to, 
      angle = 'to bottom',
      fallbackFrom,
      fallbackTo
    }: P3GradientProps) {
      const srgbFrom = fallbackFrom || convertP3ToSRGB(from);
      const srgbTo = fallbackTo || convertP3ToSRGB(to);

      return (
        <div
          className={className}
          style={{
            // P3 color space for supported displays
            '@supports (color: color(display-p3 1 1 1))': {
              background: `linear-gradient(${angle}, ${from}, ${to})`,
            },
            // sRGB fallback for unsupported displays
            background: `linear-gradient(${angle}, ${srgbFrom}, ${srgbTo})`,
          }}
        >
          {children}
        </div>
      );
    }
    ```

---

* [x] `T-3003` **Add accessibility improvements to ErrorBoundary**

  * priority: 3
  * estimate_m: 45
  * labels: [enhancement, accessibility, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-12
  * deps: []
  * target_files: [src/components/ErrorBoundary.tsx]
  * related_files: [src/components/ErrorBoundary.stories.tsx]
  * sub-tasks:

    - [x] Add ARIA live region announcements for error states in src/components/ErrorBoundary.tsx.
    - [x] Improve keyboard navigation for error recovery buttons in src/components/ErrorBoundary.tsx.
    - [x] Add screen reader-friendly error messages in src/components/ErrorBoundary.tsx.
    - [x] Test with screen readers and keyboard navigation.
    - [x] Verify WCAG compliance of error UI.

    1. ARIA live region announcements added.
    2. Keyboard navigation improved.
    3. Screen reader-friendly messages added.
  * test_steps:

    - Test with screen readers and keyboard navigation.
    - Verify WCAG compliance of error UI.
  * notes: Focus management and clear error communication are key.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (current accessibility)
    return (
      <div 
        role="alert" 
        aria-live="assertive"
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-700 mb-6">
            {this.state.retryCount >= 3
              ? "We're experiencing technical difficulties. Please refresh the page to try again."
              : "We're sorry, but something unexpected happened. Our team has been notified and is working on a fix."
            }
          </p>
          
          <div className="space-y-3">
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
    ```

  * **Enhanced Accessibility Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (enhanced accessibility)
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false, retryCount: 0 };
      // Create ref for focus management
      this.errorRef = React.createRef<HTMLDivElement>();
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // ... existing error handling
      
      // Announce error to screen readers
      if (typeof window !== 'undefined') {
        const announcement = `An error has occurred: ${error.message}. ${this.state.retryCount >= 3 
          ? 'Please refresh the page to continue.' 
          : 'You may try again or return to the home page.'}`;
        
        // Create temporary live region for announcement
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.textContent = announcement;
        document.body.appendChild(liveRegion);
        
        // Clean up after announcement
        setTimeout(() => document.body.removeChild(liveRegion), 1000);
      }
    }

    // Focus management when error occurs
    componentDidUpdate(prevProps: Props, prevState: State) {
      if (!prevState.hasError && this.state.hasError && this.errorRef.current) {
        // Focus the error container when error occurs
        this.errorRef.current.focus();
      }
    }

    render() {
      if (this.state.hasError) {
        return (
          <div 
            ref={this.errorRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="error-title"
            aria-describedby="error-description"
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
            tabIndex={-1} // Allow programmatic focus
          >
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              
              <h1 
                id="error-title"
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                Something went wrong
              </h1>
              
              <p 
                id="error-description"
                className="text-gray-700 mb-6"
              >
                {this.state.retryCount >= 3
                  ? "We're experiencing technical difficulties. Please refresh the page to try again."
                  : "We're sorry, but something unexpected happened. Our team has been notified and is working on a fix."
                }
              </p>
              
              <div className="space-y-3" role="group" aria-label="Error recovery options">
                {this.state.retryCount < 3 ? (
                  <button
                    onClick={this.handleReset}
                    className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    aria-describedby="retry-help"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Try Again
                    <span id="retry-help" className="sr-only">
                      Attempt to recover from the error and reload the content
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    aria-describedby="refresh-help"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Refresh Page
                    <span id="refresh-help" className="sr-only">
                      Refresh the entire page to clear the error
                    </span>
                  </button>
                )}
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  aria-describedby="home-help"
                >
                  Go Home
                  <span id="home-help" className="sr-only">
                    Navigate to the home page
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      return this.props.children;
    }
    ```

---

# 🟢 Low (P4) — Due: 2026-03-15

* [x] `T-4001` **Add loading states to ServiceCard**

  * priority: 4
  * estimate_m: 30
  * labels: [enhancement, ux, components]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/Services.tsx]
  * related_files: [src/components/Button.tsx]
  * sub-tasks:

    - [x] Add loading prop to ServiceCard component in src/components/Services.tsx.
    - [x] Show skeleton loader during booking action in src/components/Services.tsx.
    - [x] Maintain button dimensions during loading state in src/components/Services.tsx.
    - [x] Test loading state behavior and animations.
    - [x] Ensure accessibility during loading state.

    1. Loading prop added to ServiceCard.
    2. Skeleton loader shows during booking.
    3. Button dimensions maintained.
  * test_steps:

    - Test loading state behavior and animations.
    - Ensure accessibility during loading state.
  * notes: Use consistent loading patterns with other components.
  * **Implementation:** Added `loading?: boolean` prop with skeleton UI using `animate-pulse`. Includes accessibility attributes (`aria-busy`, `aria-label`) and matches content dimensions to prevent layout shift.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/Services.tsx (current ServiceCard)
    const ServiceCard = memo(({ service }: { service: typeof services[0] }) => {
      const IconComponent = iconMap[service.icon as keyof typeof iconMap];
      const isSpecial = service.id === 'new-client-special';
      
      return (
        <div className="service-card container-card relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105">
          {/* Service content */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-black">{service.price}</span>
            <Button
              variant="primary"
              href={EXTERNAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className={isSpecial ? 'bg-amber-500 text-black hover:bg-amber-400' : ''}
            >
              Book Now
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      );
    });
    ```

  * **Enhanced Pattern with Loading State:**
    ```tsx
    // src/components/Services.tsx (with loading state)
    interface ServiceCardProps {
      service: typeof services[0];
      loading?: boolean;
    }

    const ServiceCard = memo(({ service, loading = false }: ServiceCardProps) => {
      const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Star;
      const isSpecial = service.id === 'new-client-special';
      
      return (
        <div className={`service-card container-card relative p-8 rounded-2xl border-2 transition-all duration-300 ${
          loading ? 'opacity-75 pointer-events-none' : 'hover:scale-105'
        }`}>
          {isSpecial && (
            <div className="absolute -top-3 -right-3 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <IconContainer bg={isSpecial ? 'amber' : 'black'}>
              {loading ? (
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
              ) : (
                <IconComponent className="w-6 h-6" />
              )}
            </IconContainer>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-black">
                {loading ? (
                  <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
                ) : (
                  service.title
                )}
              </h3>
              <p className="text-gray-600">
                {loading ? (
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  service.duration
                )}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            {loading ? (
              <>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </>
            ) : (
              service.description
            )}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-black">
              {loading ? (
                <div className="h-8 w-16 bg-gray-300 rounded animate-pulse" />
              ) : (
                service.price
              )}
            </span>
            <Button
              variant="primary"
              href={loading ? undefined : EXTERNAL_LINKS.booking}
              target={loading ? undefined : "_blank"}
              rel={loading ? undefined : "noopener noreferrer"}
              disabled={loading}
              className={`${
                isSpecial ? 'bg-amber-500 text-black hover:bg-amber-400' : ''
              } ${loading ? 'cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                <>
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      );
    });
    ```

---

* [x] `T-4002` **Add hover animations to Gallery items**

  * priority: 4
  * estimate_m: 30
  * labels: [enhancement, ux, animations]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/Gallery.tsx]
  * related_files: [src/components/Gallery.stories.tsx]
  * sub-tasks:

    - [x] Enhance hover animations with smooth transitions in src/components/Gallery.tsx.
    - [x] Add subtle scale and overlay effects in src/components/Gallery.tsx.
    - [x] Ensure performance with CSS transforms in src/components/Gallery.tsx.
    - [x] Test animations across different devices.
    - [x] Verify accessibility with reduced motion preferences.

    1. Enhanced hover animations added.
    2. Smooth scale and overlay effects implemented.
    3. CSS transforms used for performance.
  * test_steps:

    - Test animations across different devices.
    - Verify accessibility with reduced motion preferences.
  * notes: Respect prefers-reduced-motion for accessibility.
  * **Implementation:** Enhanced with scale-110 transform, gradient overlay, slide-up content animation, and amber border highlight. Added keyboard accessibility (`tabIndex`, `role="button"`) and `motion-safe:` variants for reduced motion support.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/Gallery.tsx (current hover effects)
    {galleryItems.map((item) => (
      <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
        <Image 
          src={item.src}
          alt={item.alt}
          fill
          placeholder="blur"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <p className="text-white font-semibold">{item.title}</p>
            <p className="text-gray-300 text-sm">by {item.barber}</p>
          </div>
        </div>
      </div>
    ))}
    ```

  * **Enhanced Animation Pattern:**
    ```tsx
    // src/components/Gallery.tsx (enhanced animations)
    {galleryItems.map((item) => (
      <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
        <Image 
          src={item.src}
          alt={item.alt}
          fill
          placeholder="blur"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-90"
        />
        
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-6">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-100">
            <p className="text-white font-bold text-lg mb-1 drop-shadow-lg">{item.title}</p>
            <p className="text-gray-200 text-sm drop-shadow-md">by {item.barber}</p>
          </div>
        </div>

        {/* Subtle border highlight on hover */}
        <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/50 rounded-2xl transition-all duration-300 ease-out pointer-events-none" />

        {/* Respect reduced motion preference */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            .group:hover .group-hover\\:scale-110 {
              transform: scale(1);
            }
            .group:hover .group-hover\\:translate-y-0 {
              transform: translateY(1rem);
            }
            .group-hover\\:opacity-100 {
              opacity: 0;
            }
            .transition-all {
              transition: none;
            }
          }
        `}</style>
      </div>
    ))}
    ```

---

# 🔵 Backlog (P5) — No Due Date

* [ ] `T-5001` **Add comprehensive error logging**

  * priority: 5
  * estimate_m: 60
  * labels: [enhancement, logging, monitoring]
  * assignee: @frontend
  * status: open
  * deps: []
  * target_files: [src/components/ErrorBoundary.tsx]
  * related_files: []
  * sub-tasks:

    - [ ] Integrate error reporting service (Sentry) in src/components/ErrorBoundary.tsx.
    - [ ] Add structured error logging in src/components/ErrorBoundary.tsx.
    - [ ] Include user context and browser info in error reports.
    - [ ] Test error reporting with various error types.
    - [ ] Verify error dashboard integration.

    1. Error reporting service integrated.
    2. Structured error logging added.
    3. User context included in reports.
  * test_steps:

    - Test error reporting with various error types.
    - Verify error dashboard integration.
  * notes: Consider privacy implications of error data collection.

  * **Existing Code Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (current error handling)
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      this.setState({
        error,
        errorInfo,
      });

      this.props.onError?.(error, errorInfo);

      // Log error to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
      }

      // In production, you would send this to an error reporting service
      // like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
    ```

  * **Enhanced Logging Pattern:**
    ```tsx
    // src/components/ErrorBoundary.tsx (with comprehensive logging)
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      this.setState({
        error,
        errorInfo,
      });

      this.props.onError?.(error, errorInfo);

      // Enhanced error logging
      const errorContext = this.gatherErrorContext(error, errorInfo);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('ErrorBoundary caught an error:', {
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          context: errorContext,
        });
      }

      // Production error reporting
      if (process.env.NODE_ENV === 'production') {
        this.reportError(error, errorInfo, errorContext);
      }
    }

    private gatherErrorContext = (error: Error, errorInfo: ErrorInfo) => {
      // Gather comprehensive context for error reporting
      return {
        // User context (privacy-conscious)
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
        
        // Application context
        reactVersion: React.version,
        errorBoundaryName: this.constructor.name,
        retryCount: this.state.retryCount,
        
        // Error classification
        errorType: error.constructor.name,
        isNetworkError: error.message.includes('fetch') || error.message.includes('network'),
        isChunkError: error.message.includes('Loading chunk'),
        
        // Performance context
        memoryUsage: typeof performance !== 'undefined' && 'memory' in performance ? {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        } : undefined,
        
        // Browser capabilities
        supportsP3: typeof CSS !== 'undefined' && CSS.supports('color', 'color(display-p3 1 1 1)'),
        supportsWebP: typeof document !== 'undefined' && document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp'),
      };
    };

    private reportError = (error: Error, errorInfo: ErrorInfo, context: any) => {
      // Example Sentry integration
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
            browser: {
              userAgent: context.userAgent,
              url: context.url,
            },
            error: {
              type: context.errorType,
              isNetworkError: context.isNetworkError,
              isChunkError: context.isChunkError,
            },
          },
          tags: {
            errorBoundary: context.errorBoundaryName,
            retryCount: String(context.retryCount),
          },
          extra: {
            timestamp: context.timestamp,
            reactVersion: context.reactVersion,
            memoryUsage: context.memoryUsage,
            browserCapabilities: {
              supportsP3: context.supportsP3,
              supportsWebP: context.supportsWebP,
            },
          },
          level: context.isChunkError ? 'warning' : 'error',
        });
      }

      // Fallback: Log to external service
      this.logToExternalService(error, errorInfo, context);
    };

    private logToExternalService = (error: Error, errorInfo: ErrorInfo, context: any) => {
      // Custom logging endpoint or service
      try {
        const logData = {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          errorInfo: {
            componentStack: errorInfo.componentStack,
          },
          context: {
            ...context,
            // Sanitize sensitive data
            userAgent: context.userAgent?.substring(0, 100),
            url: context.url?.split('?')[0], // Remove query params
          },
          version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
        };

        // Send to logging service (implement your preferred service)
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        }).catch(() => {
          // Silent fail for logging errors to avoid infinite loops
        });
      } catch (loggingError) {
        console.warn('Failed to log error:', loggingError);
      }
    };
    ```

---

* [ ] `T-5002` **Add performance monitoring**

  * priority: 5
  * estimate_m: 45
  * labels: [enhancement, performance, monitoring]
  * assignee: @frontend
  * status: open
  * deps: []
  * target_files: []
  * related_files: [src/app/layout.tsx]
  * sub-tasks:

    - [ ] Add Web Vitals monitoring in src/app/layout.tsx.
    - [ ] Track Core Web Vitals (LCP, INP, CLS) in src/app/layout.tsx.
    - [ ] Send metrics to analytics service.
    - [ ] Set up performance dashboard alerts.
    - [ ] Monitor performance trends over time.

    1. Web Vitals monitoring added.
    2. Core Web Vitals tracked.
    3. Metrics sent to analytics.
  * test_steps:

    - Verify metrics collection in development.
    - Test performance dashboard integration.
  * notes: Use sample rate for production to avoid excessive data.

  * **Performance Monitoring Pattern:**
    ```tsx
    // src/app/layout.tsx (add performance monitoring)
    import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

    function sendToAnalytics(metric: any) {
      // Send to your analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: Google Analytics
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          non_interaction: true,
        });

        // Example: Custom analytics endpoint
        fetch('/api/web-vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            rating: metric.rating,
            navigationType: performance.navigation?.type,
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      } else {
        console.log('Web Vital:', metric);
      }
    }

    // Initialize Web Vitals monitoring
    if (typeof window !== 'undefined') {
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    }
    ```

---

* [ ] `T-5003` **Add component documentation**

  * priority: 5
  * estimate_m: 90
  * labels: [documentation, components]
  * assignee: @frontend
  * status: open
  * deps: []
  * target_files: [src/components/]
  * related_files: [docs/]
  * sub-tasks:

    - [ ] Add comprehensive JSDoc to all components.
    - [ ] Create component usage examples.
    - [ ] Document prop interfaces and types.
    - [ ] Add accessibility notes to documentation.
    - [ ] Generate component documentation site.

    1. Comprehensive JSDoc added to components.
    2. Usage examples created.
    3. Prop interfaces documented.
  * test_steps:

    - Verify documentation builds correctly.
    - Check examples render properly.
  * notes: Use Storybook for interactive documentation.

---

* [ ] `T-5004` **Optimize bundle size**

  * priority: 5
  * estimate_m: 60
  * labels: [optimization, performance]
  * assignee: @frontend
  * status: open
  * deps: []
  * target_files: [next.config.ts]
  * related_files: [package.json]
  * sub-tasks:

    - [ ] Analyze current bundle size with webpack-bundle-analyzer.
    - [ ] Implement dynamic imports for large components.
    - [ ] Optimize image and font loading.
    - [ ] Configure compression in next.config.ts.
    - [ ] Set up bundle size monitoring.

    1. Bundle size analyzed.
    2. Dynamic imports implemented.
    3. Image and font loading optimized.
  * test_steps:

    - Run bundle analysis before and after optimization.
    - Verify performance improvements in Lighthouse.
  * notes: Monitor bundle size regressions in CI/CD.

---

* [ ] `T-5005` **Add internationalization support**

  * priority: 5
  * estimate_m: 120
  * labels: [enhancement, i18n]
  * assignee: @frontend
  * status: open
  * deps: []
  * target_files: []
  * related_files: [src/data/]
  * sub-tasks:

    - [ ] Set up next-i18next configuration.
    - [ ] Create translation files for supported languages.
    - [ ] Update components to use translation hooks.
    - [ ] Add language switcher component.
    - [ ] Test language switching functionality.

    1. i18n configuration set up.
    2. Translation files created.
    3. Components updated for translations.
  * test_steps:

    - Test language switching in development.
    - Verify SEO tags update correctly.
  * notes: Start with English and Spanish for Dallas market.

---

## Reference Documentation

### Code Pattern Guidelines

This TODO follows established code patterns found throughout the codebase:

#### Image Optimization Pattern
```tsx
<Image 
  src={imageSrc}
  alt={altText}
  fill
  quality={75}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover group-hover:scale-105 transition-transform duration-300"
  // Note: Only use placeholder="blur" for raster images, not SVGs
/>
```

#### Component Interface Pattern
```tsx
interface ComponentProps {
  children: ReactNode;
  className?: string;
  // Required props first, then optional
  requiredProp: string;
  optionalProp?: string;
}
```

#### Error Boundary Pattern
```tsx
// Preserve retry count across errors
static getDerivedStateFromError(error: Error, prevState: State): State {
  return { 
    hasError: true, 
    error, 
    retryCount: prevState.retryCount  // Don't reset retry count
  };
}
```

#### Icon Mapping Pattern
```tsx
const iconMap = {
  IconName1: IconComponent1,
  IconName2: IconComponent2,
  // Always provide fallback
};

// Safe usage with fallback
const IconComponent = iconMap[iconName] || DefaultIcon;
```

#### Structured Data Pattern
```tsx
// Extract address parts safely
const addressParts = BUSINESS_INFO.address.split(', ');
const streetAddress = addressParts[0];
const postalCode = addressParts[2]?.split(' ')[1] || ''; // Safe extraction
```

#### Accessibility Pattern
```tsx
// Focus management and ARIA
<div 
  ref={this.errorRef}
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="error-title"
  aria-describedby="error-description"
  tabIndex={-1}
>
```

#### Performance Pattern
```tsx
// Memoization and dynamic imports
const Component = memo(({ prop }: Props) => {
  // Component logic
});

const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <div className="animate-pulse" />,
});
```

### File Structure Patterns

```
src/
├── components/           # Reusable UI components
│   ├── ComponentName.tsx
│   ├── ComponentName.stories.tsx
│   └── __tests__/
│       └── ComponentName.test.tsx
├── data/               # Static data and constants
│   ├── constants.ts
│   ├── services.ts
│   └── barbers.ts
└── app/                # Next.js app router pages
    ├── layout.tsx
    └── page.tsx
```

### Testing Patterns

#### Unit Test Pattern
```tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

#### Integration Test Pattern
```tsx
import { render, screen } from '@testing-library/react';
import { test, expect } from '@playwright/test';

test('user journey', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The Barber Cave' })).toBeVisible();
});
```

---

*Generated: 2026-03-02*
*Next Review: 2026-03-09*

  * **Note:** Component already works with React 19 ref-as-prop, but should be converted to traditional forwardRef for consistency.
* [ ] `T-2006` **Update ErrorFallback.tsx navigation**

  * priority: 2
  * estimate_m: 30
  * labels: [refactor, frontend, components]
  * assignee: @frontend
  * status: open
  * due: 2026-03-08
  * deps: []
  * target_files: [src/components/ErrorFallback.tsx]
  * related_files: [src/components/SafeComponent.tsx, src/components/ErrorFallback.stories.tsx]
  * sub-tasks:

    - [ ] Replace window.location.href with useRouter().push() in src/components/ErrorFallback.tsx.
    - [ ] Ensure SPA behavior is maintained in src/components/ErrorFallback.tsx.
    - [ ] Ensure no runtime errors in src/components/ErrorFallback.tsx.
    - [ ] Trigger error fallback and test navigation using src/components/ErrorFallback.stories.tsx.
    - [ ] Ensure page transitions work correctly.

    1. Replace window.location.href with useRouter().push().
    2. Maintains SPA behavior.
    3. No runtime errors.
  * test_steps:

    - Trigger error fallback and test navigation.
    - Ensure page transitions work correctly.
  * notes: Use Next.js router for client-side navigation instead of window.location.

(All metadata fields preserved and normalized; structure identical to P1 tasks.)

---

# 🟡 Medium (P3) — Due: 2026-03-15

* [ ] `T-3001` **Strengthen CSP in next.config.ts**

  * priority: 3
  * estimate_m: 60
  * labels: [security, config]
  * assignee: @security
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [next.config.ts]
  * related_files: []
  * sub-tasks:

    - [ ] Remove 'unsafe-inline' and 'unsafe-eval' where possible in next.config.ts.
    - [ ] Verify app still functions after changes to next.config.ts.
    - [ ] Add nonce-based script handling if needed in next.config.ts.
    - [ ] Run the app and check for CSP violations.
    - [ ] Test all features work without unsafe directives.

    1. Remove 'unsafe-inline' and 'unsafe-eval' where possible.
    2. Verify app still functions.
    3. Add nonce-based script handling if needed.
  * test_steps:

    - Run the app and check for CSP violations.
    - Test all features work without unsafe directives.
  * notes: Update Content Security Policy to be more restrictive.
* [ ] `T-3002` **Review CSP form-action setting**

  * priority: 3
  * estimate_m: 30
  * labels: [security, config]
  * assignee: @security
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [next.config.ts]
  * related_files: [src/components/Contact.tsx]
  * sub-tasks:

    - [ ] Confirm 'form-action 'self'' is sufficient for third-party integrations in next.config.ts.
    - [ ] Document exceptions if needed in next.config.ts.
    - [ ] Ensure no security vulnerabilities from form actions in next.config.ts.
    - [ ] Review form submissions in the app using src/components/Contact.tsx.
    - [ ] Check CSP headers for form-action.

    1. Confirm 'form-action 'self'' is sufficient for third-party integrations.
    2. Document exceptions if needed.
    3. No security vulnerabilities from form actions.
  * test_steps:

    - Review form submissions in the app.
    - Check CSP headers for form-action.
  * notes: Ensure CSP form-action is appropriately restrictive.
* [ ] `T-3003` **Verify next.config.ts route header pattern /(.*)**

  * priority: 3
  * estimate_m: 30
  * labels: [testing, config]
  * assignee: @infra
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [next.config.ts]
  * related_files: []
  * sub-tasks:

    - [ ] Confirm headers apply to intended routes in next.config.ts.
    - [ ] Confirm headers do not apply to undesired endpoints in next.config.ts.
    - [ ] Add unit/integration tests for header application in next.config.ts.
    - [ ] Check routes that should have headers.
    - [ ] Verify routes that should not have them.
    - [ ] Run tests.

    1. Confirm headers apply to intended routes.
    2. Headers do not apply to undesired endpoints.
    3. Add unit/integration tests.
  * test_steps:

    - Check routes that should have headers.
    - Verify routes that should not have them.
    - Run tests.
  * notes: Ensure route pattern /(.*) is correct for header application.
* [ ] `T-3004` **Fix eslint.config.mjs flat-config spreading**

  * priority: 3
  * estimate_m: 45
  * labels: [tools, config]
  * assignee: @devops
  * status: completed
  * due: 2026-03-15
  * deps: []
  * sub-tasks:

    - [ ] Ensure eslint.config.mjs uses correct defineConfig with flat config spreading.
    - [ ] Confirm no changes needed in eslint.config.mjs.
    - [ ] Run ESLint to verify configuration works.

    1. eslint.config.mjs uses correct defineConfig with flat config spreading.
    2. No changes needed.
  * test_steps:

    - Run ESLint to verify configuration works.
  * notes: Flat config is already properly implemented.
* [ ] `T-3005` **Review eslint globalIgnores for stories**

  * priority: 3
  * estimate_m: 30
  * labels: [tools, config]
  * assignee: @devops
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [eslint.config.mjs]
  * related_files: [src/components/*.stories.tsx]
  * sub-tasks:

    - [ ] Decide if hiding story breakage is acceptable in eslint.config.mjs.
    - [ ] Document the decision in eslint.config.mjs.
    - [ ] Update configuration accordingly in eslint.config.mjs.
    - [ ] Run ESLint on story files using src/components/*.stories.tsx.
    - [ ] Check if errors are ignored.

    1. Decide if hiding story breakage is acceptable.
    2. Document the decision.
    3. Update configuration accordingly.
  * test_steps:

    - Run ESLint on story files.
    - Check if errors are ignored.
  * notes: Consider if stories should follow the same linting rules.
* [x] `T-3006` **Optimize AccessibilityProvider.tsx axe usage**

  * priority: 3
  * estimate_m: 30
  * labels: [performance, accessibility]
  * assignee: @accessibility
  * status: completed
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/AccessibilityProvider.tsx]
  * related_files: [src/app/layout.tsx]
  * sub-tasks:

    - [x] Ensure axe runs only in development (not production) in src/components/AccessibilityProvider.tsx.
    - [x] Ensure can be toggled via env var in src/components/AccessibilityProvider.tsx.
    - [x] Ensure no performance impact in production in src/components/AccessibilityProvider.tsx.
    - [x] Run app in development and check axe runs using src/app/layout.tsx.
    - [x] Run app in production and check axe does not run.
    - [x] Test env var toggle.

    1. Axe runs only in development (not production).
    2. Can be toggled via env var.
    3. No performance impact in production.
  * test_steps:

    - [x] Run app in development and check axe runs.
    - [x] Run app in production and check axe does not run.
    - [x] Test env var toggle.
  * notes: Ensure accessibility testing is development-only for performance.
* [x] `T-3007` **Review Footer.tsx client-side necessity**

  * priority: 3
  * estimate_m: 30
  * labels: [performance, frontend]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/Footer.tsx]
  * related_files: [src/app/page.tsx]
  * sub-tasks:

    - [x] Remove 'use client' if footer is static in src/components/Footer.tsx.
    - [x] Confirm no client behaviors rely on it in src/components/Footer.tsx.
    - [x] Ensure footer renders correctly as server component in src/components/Footer.tsx.
    - [x] Check if footer has any client-side interactions using src/app/page.tsx.
    - [x] Remove 'use client' and test rendering.
    - [x] Verify no errors.

    1. Remove 'use client' if footer is static.
    2. Confirm no client behaviors rely on it.
    3. Footer renders correctly as server component.
  * test_steps:

    - [x] Check if footer has any client-side interactions.
    - [x] Remove 'use client' and test rendering.
    - [x] Verify no errors.
  * notes: Optimize by making footer a server component if possible.
* [ ] `T-3008` **Optimize Breadcrumbs.tsx JSON-LD output**

  * priority: 3
  * estimate_m: 30
  * labels: [seo, performance]
  * assignee: @seo
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/Breadcrumbs.tsx]
  * related_files: [src/app/page.tsx]
  * sub-tasks:

    - [ ] Suppress breadcrumbs JSON-LD when items.length < 2 in src/components/Breadcrumbs.tsx.
    - [ ] Avoid unnecessary JSON-LD output in src/components/Breadcrumbs.tsx.
    - [ ] Validate that breadcrumbs still work correctly in src/components/Breadcrumbs.tsx.
    - [ ] Check pages with 0 or 1 breadcrumb item.
    - [ ] Verify no JSON-LD is output.
    - [ ] Check pages with 2+ items have JSON-LD.

    1. Suppress breadcrumbs JSON-LD when items.length < 2.
    2. Avoid unnecessary JSON-LD output.
    3. Validate that breadcrumbs still work correctly.
  * test_steps:

    - Check pages with 0 or 1 breadcrumb item.
    - Verify no JSON-LD is output.
    - Check pages with 2+ items have JSON-LD.
  * notes: Reduce noise in structured data by conditionally rendering breadcrumbs schema.

All normalized to:

* kebab-case labels
* consistent due field
* single priority value
* explicit status

---

# 🟢 Low / Backlog (P4–P5) — Due: 2026-03-22

* [ ] `T-4001` **Fix businessEngine.ts opening-hours inconsistency**

  * priority: 4
  * estimate_m: 30
  * labels: [data, backend]
  * assignee: @backend
  * status: open
  * due: 2026-03-22
  * deps: []
  * target_files: [src/data/businessEngine.ts]
  * related_files: [src/data/constants.ts]
  * acceptance_criteria:

    1. Saturday hours align between display and canonical data.
    2. Fix 08:00 vs 09:00 discrepancy.
    3. Update tests to prevent future drift.
  * test_steps:

    - Check businessEngine.ts for Saturday hours.
    - Compare with display data.
    - Update and run tests.
  * notes: Ensure consistent opening hours across the application.

* [ ] `T-4002` **Sync constants.ts vs businessEngine.ts hours**

  * priority: 4
  * estimate_m: 30
  * labels: [data, backend]
  * assignee: @backend
  * status: open
  * due: 2026-03-22
  * deps: []
  * target_files: [src/data/constants.ts, src/data/businessEngine.ts]
  * related_files: []
  * sub-tasks:

    - [ ] Establish single source of truth for opening hours in src/data/constants.ts and src/data/businessEngine.ts.
    - [ ] Sync constants.ts and businessEngine.ts.
    - [ ] Add unit test to detect drift in src/data/constants.ts and src/data/businessEngine.ts.
    - [ ] Compare hours in constants.ts and businessEngine.ts.
    - [ ] Update to single source.
    - [ ] Add test to prevent drift.

    1. Single source of truth for opening hours.
    - [ ] Fix 08:00 vs 09:00 discrepancy in src/data/businessEngine.ts and src/data/constants.ts.
    - [ ] Update tests to prevent future drift in src/data/businessEngine.ts and src/data/constants.ts.
    - [ ] Check businessEngine.ts for Saturday hours.
    - [ ] Compare with display data.
    - [ ] Update and run tests.

    1. Single source of truth for opening hours.
    2. Sync constants.ts and businessEngine.ts.
    3. Add unit test to detect drift.
  * test_steps:

    - Compare hours in constants.ts and businessEngine.ts.
    - Update to single source.
    - Add test to prevent drift.
  * notes: Maintain consistency between data files.

* [x] `T-4003` **Improve Navigation.tsx mobile accessibility**

  * priority: 4
  * estimate_m: 60
  * labels: [accessibility, frontend, ux]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-22
  * deps: []
  * target_files: [src/components/Navigation.tsx]
  * related_files: []
  * sub-tasks:

    - [x] Add Escape-to-close functionality in src/components/Navigation.tsx.
    - [x] Add outside-click close in src/components/Navigation.tsx.
    - [x] Implement proper focus trap in src/components/Navigation.tsx.
    - [x] Verify keyboard navigation in src/components/Navigation.tsx.
    - [x] Test mobile navigation on device/simulator.
    - [x] Check Escape key closes menu.
    - [x] Click outside to close.
    - [x] Verify focus trap and keyboard nav.

    1. Add Escape-to-close functionality.
    2. Add outside-click close.
    3. Implement proper focus trap.
    4. Verify keyboard navigation.
  * test_steps:

    - [x] Test mobile navigation on device/simulator.
    - [x] Check Escape key closes menu.
    - [x] Click outside to close.
    - [x] Verify focus trap and keyboard nav.
  * notes: Enhance accessibility for mobile users.

* [x] `T-4004` **Clean up Barbers.tsx review display**

  * priority: 4
  * estimate_m: 30
  * labels: [ux, frontend]
  * assignee: @frontend
  * status: completed
  * due: 2026-03-22
  * deps: []
  * target_files: [src/components/Barbers.tsx]
  * related_files: [src/data/barbers.ts]
  * sub-tasks:

    - [x] Hide or format (0) reviews elegantly in src/components/Barbers.tsx.
    - [x] Fix spacing issues in src/components/Barbers.tsx.
    - [x] Improve visual presentation in src/components/Barbers.tsx.
    - [x] Check Barbers page with barbers having 0 reviews using src/data/barbers.ts.
    - [x] Verify display is clean.
    - [x] Adjust spacing and formatting.

    1. Hide or format (0) reviews elegantly.
    2. Fix spacing issues.
    3. Improve visual presentation.
  * test_steps:

    - [x] Check Barbers page with barbers having 0 reviews.
    - [x] Verify display is clean.
    - [x] Adjust spacing and formatting.
  * notes: Enhance user experience for review display.

* [x] `T-4005` **Review Button.tsx dark mode contrast**

  * priority: 4
  * estimate_m: 45
  * labels: [design, frontend, accessibility]
  * assignee: @design
  * status: completed
  * due: 2026-03-22
  * deps: []
  * target_files: [src/components/Button.tsx]
  * related_files: [src/components/Hero.tsx]
  * sub-tasks:

    - [x] Ensure secondary variant meets WCAG contrast ratios in src/components/Button.tsx.
    - [x] Ensure proper contrast on dark hero backgrounds in src/components/Button.tsx using src/components/Hero.tsx.
    - [x] Test with accessibility tools.
    - [x] Check Button secondary variant on dark backgrounds.
    - [x] Use contrast checker.
    - [x] Adjust colors if needed.

    1. Secondary variant meets WCAG contrast ratios.
    2. Ensure proper contrast on dark hero backgrounds.
    3. Test with accessibility tools.
  * test_steps:

    - [x] Check Button secondary variant on dark backgrounds.
    - [x] Use contrast checker.
    - [x] Adjust colors if needed.
  * notes: Ensure accessibility compliance in dark mode.

* [ ] `T-4006` **Replace placeholder business data in constants.ts**

  * priority: 4
  * estimate_m: 30
  * labels: [data, production]
  * assignee: @product
  * status: open
  * due: 2026-03-22
  * deps: []
  * target_files: [src/data/constants.ts]
  * related_files: []
  * sub-tasks:

    - [ ] Replace all fake addresses and phones in src/data/constants.ts.
    - [ ] Ensure production config has real data in src/data/constants.ts.
    - [ ] Validate data accuracy in src/data/constants.ts.
    - [ ] Review constants.ts for placeholder data.
    - [ ] Replace with real business information.
    - [ ] Check for any remaining placeholders.

    1. Replace all fake addresses and phones.
    2. Ensure production config has real data.
    3. Validate data accuracy.
  * test_steps:

    - Review constants.ts for placeholder data.
    - Replace with real business information.
    - Check for any remaining placeholders.
  * notes: Prepare for production deployment with accurate business data.

* [ ] `T-4007` **Remove storybook-static from repo**

  * priority: 5
  * estimate_m: 30
  * labels: [cleanup, git]
  * assignee: @devops
  * status: open
  * due: 2026-03-22
  * deps: []
  * target_files: [.gitignore]
  * related_files: [storybook-static/]
  * sub-tasks:

    - [ ] Add storybook-static to .gitignore.
    - [ ] Remove committed artifacts.
    - [ ] Ensure CI still publishes Storybook.
    - [ ] Check .gitignore for storybook-static using .gitignore.
    - [ ] Remove the directory from repo using storybook-static/.
    - [ ] Verify CI workflow still works.

    1. Add storybook-static to .gitignore.
    2. Remove committed artifacts.
    3. Ensure CI still publishes Storybook.
  * test_steps:

    - Check .gitignore for storybook-static.
    - Remove the directory from repo.
    - Verify CI workflow still works.
  * notes: Keep repo clean by not committing build artifacts.

---

# 🔁 Recurring Tasks (P2 default)

Recurring tasks normalized with:

```yaml
recurring:
  type: weekly | pre-release
  next_due: YYYY-MM-DD
```

Example:

* [ ] `T-5001` Run accessibility audit

  * priority: 2
  * estimate_m: 120
  * labels: [testing, accessibility]
  * assignee: @accessibility
  * status: planned
  * recurring:
    type: weekly
    next_due: 2026-03-29
  * target_files: [src/components/**/*]
  * related_files: []
  * sub-tasks:

    - [ ] Run axe accessibility audit on src/components/**/*.
    - [ ] File issues for any failures found.
    - [ ] Validate fixes for reported issues.
    - [ ] Run npm run accessibility.
    - [ ] Review axe results.
    - [ ] Create issues for failures and track fixes.

    1. Run axe accessibility audit.
    2. File issues for any failures found.
    3. Validate fixes for reported issues.
  * test_steps:

    - Run npm run accessibility.
    - Review axe results.
    - Create issues for failures and track fixes.
  * notes: Weekly audit to maintain accessibility standards.

* [ ] `T-5002` **Performance testing after image fixes**

  * priority: 2
  * estimate_m: 90
  * labels: [testing, performance]
  * assignee: @performance
  * status: planned
  * recurring:

    type: before release
    next_due: before each release
  * target_files: [src/components/**/*]
  * related_files: [performance-budgets.json]
  * sub-tasks:

    - [ ] Run Lighthouse performance audit on src/components/**/*.
    - [ ] Check RUM metrics.
    - [ ] Ensure performance budgets are maintained using performance-budgets.json.
    - [ ] Run npm run test:performance.
    - [ ] Review Lighthouse scores.
    - [ ] Verify budgets in performance-budgets.json.

    1. Run Lighthouse performance audit.
    2. Check RUM metrics.
    3. Ensure performance budgets are maintained.
  * test_steps:

    - Run npm run test:performance.
    - Review Lighthouse scores.
    - Verify budgets in performance-budgets.json.
  * notes: Conduct before each release to ensure image optimizations don't regress performance.

* [ ] `T-5003` **Update documentation**

  * priority: 3
  * estimate_m: 60
  * labels: [docs, maintenance]
  * assignee: @docs
  * status: planned
  * recurring:

    type: after major changes
    next_due: after significant updates
  * target_files: [README.md, docs/**/*]
  * related_files: []
  * sub-tasks:

    - [ ] Document API changes in README.md and docs/**/*.
    - [ ] Document behavioral changes from fixes in README.md and docs/**/*.
    - [ ] Update README and docs as needed.
    - [ ] Review recent changes for documentation needs.
    - [ ] Update relevant documentation files.
    - [ ] Check docs build.

    1. Document API changes.
    2. Document behavioral changes from fixes.
    3. Update README and docs as needed.
  * test_steps:

    - Review recent changes for documentation needs.
    - Update relevant documentation files.
    - Check docs build.
  * notes: Keep documentation current with code changes.

* [ ] `T-5004` **Add regression tests for critical fixes**

  * priority: 2
  * estimate_m: 180
  * labels: [testing, quality]
  * assignee: @qa
  * status: planned
  * recurring:

    type: after critical fixes
    next_due: after fixing critical bugs
  * sub-tasks:

    - [ ] Add tests for all critical bug fixes.
    - [ ] Ensure tests run in CI.
    - [ ] Prevent regressions.
    - [ ] Identify critical fixes without tests.
    - [ ] Write regression tests.
    - [ ] Ensure tests pass in CI.
    2. Tests run in CI.
    3. Prevent regressions.
  * test_steps:

    - Identify critical fixes without tests.
    - Write regression tests.
    - Ensure tests pass in CI.
  * notes: Maintain quality by covering critical paths with tests.

---

# 🚀 Deployment Preparation — Due: 2026-04-01

* [ ] `T-6001` **Environment variable audit**

  * priority: 2
  * estimate_m: 60
  * labels: [security, production]
  * assignee: @security
  * status: planned
  * due: 2026-04-01
  * deps: []
  * target_files: [src/data/constants.ts]
  * related_files: [.env*]
  * sub-tasks:

    - [ ] Ensure no placeholders in production envs in src/data/constants.ts.
    - [ ] Ensure secrets centralised in vault using .env*.
    - [ ] Ensure all required env vars documented in src/data/constants.ts.
    - [ ] Review environment configurations.
    - [ ] Check for placeholder values.
    - [ ] Verify secrets management.

    1. No placeholders in production envs.
    2. Secrets centralised in vault.
    3. All required env vars documented.
  * test_steps:

    - Review environment configurations.
    - Check for placeholder values.
    - Verify secrets management.
  * notes: Ensure production environment is secure and complete.

* [ ] `T-6002` **Production build test**

  * priority: 2
  * estimate_m: 90
  * labels: [testing, deployment]
  * assignee: @infra
  * status: planned
  * due: 2026-04-01
  * deps: []
  * target_files: [package.json, next.config.ts]
  * related_files: [src/__tests__/**/*]
  * sub-tasks:

    - [ ] Ensure npm run build succeeds using package.json and next.config.ts.
    - [ ] Ensure smoke tests pass on staging using src/__tests__/**/*.
    - [ ] Ensure no build errors or warnings in package.json and next.config.ts.
    - [ ] Run npm run build.
    - [ ] Deploy to staging.
    - [ ] Run smoke tests.

    1. npm run build succeeds.
    2. Smoke tests pass on staging.
    3. No build errors or warnings.
  * test_steps:

    - Run npm run build.
    - Deploy to staging.
    - Run smoke tests.
  * notes: Verify production build works correctly.

* [ ] `T-6003` **Security review**

  * priority: 2
  * estimate_m: 60
  * labels: [security, deployment]
  * assignee: @security
  * status: planned
  * due: 2026-04-01
  * deps: []
  * target_files: [next.config.ts]
  * related_files: [src/components/**/*]
  * sub-tasks:

    - [ ] Ensure CSP and other configs verified in next.config.ts.
    - [ ] Ensure findings remediated in next.config.ts.
    - [ ] Ensure security audit passed using src/components/**/*.
    - [ ] Review security configurations.
    - [ ] Run security scans.
    - [ ] Fix any vulnerabilities found.

    1. CSP and other configs verified.
    2. Findings remediated.
    3. Security audit passed.
  * test_steps:

    - Review security configurations.
    - Run security scans.
    - Fix any vulnerabilities found.
  * notes: Ensure deployment is secure.

* [ ] `T-6004` **Performance budget validation**

  * priority: 3
  * estimate_m: 45
  * labels: [performance, deployment]
  * assignee: @performance
  * status: planned
  * due: 2026-04-01
  * deps: []
  * target_files: [performance-budgets.json]
  * related_files: [next.config.ts, src/components/**/*]
  * sub-tasks:

    - [ ] Ensure changes are within accepted budgets in performance-budgets.json.
    - [ ] Ensure performance metrics validated in performance-budgets.json.
    - [ ] Ensure no budget violations in performance-budgets.json.
    - [ ] Run performance tests using next.config.ts and src/components/**/*.
    - [ ] Compare against budgets.
    - [ ] Ensure compliance.

    1. Changes are within accepted budgets.
    2. Performance metrics validated.
    3. No budget violations.
  * test_steps:

    - Run performance tests.
    - Compare against budgets.
    - Ensure compliance.
  * notes: Validate that deployment meets performance requirements.

---

# 🎯 Page Rendering Tasks

* [ ] `T-7001` **Optimize hero image loading**

  * priority: 3
  * estimate_m: 30
  * labels: [performance, images, rendering]
  * assignee: @frontend
  * status: open
  * due: 2026-03-15
  * deps: []
  * target_files: [src/components/Hero.tsx]
  * related_files: [src/app/page.tsx]
  * sub-tasks:

    - [ ] Ensure hero image uses priority loading in src/components/Hero.tsx.
    - [ ] Ensure proper image optimization settings in src/components/Hero.tsx.
    - [ ] Ensure LCP optimization implemented in src/components/Hero.tsx.
    - [ ] Add priority attribute to hero Image component.
    - [ ] Optimize quality settings for hero image.
    - [ ] Test LCP performance impact.

    1. Hero image loads with priority.
    2. LCP performance improved.
    3. No layout shift during hero load.
  * test_steps:

    - Test hero image loading performance.
    - Verify LCP metrics.
    - Check for layout shift.
  * notes: Critical for first impression and Core Web Vitals.

* [ ] `T-7002` **Convert gallery SVG placeholders to optimized WebP images**

  * priority: 4
  * estimate_m: 60
  * labels: [performance, images, optimization]
  * assignee: @frontend
  * status: open
  * due: 2026-03-20
  * deps: []
  * target_files: [src/components/Gallery.tsx, public/images/gallery/**/*]
  * related_files: [src/__tests__/image-optimization.test.tsx]
  * sub-tasks:

    - [ ] Ensure real barber work photos created in public/images/gallery/**/*.
    - [ ] Ensure SVG placeholders replaced with WebP images in src/components/Gallery.tsx.
    - [ ] Ensure proper alt texts maintained in src/components/Gallery.tsx.
    - [ ] Create high-quality photos of actual barber work.
    - [ ] Convert images to WebP format with optimization.
    - [ ] Update Gallery component to use real images.
    - [ ] Update image optimization tests.

    1. Real barber work photos implemented.
    2. WebP format optimized for performance.
    3. Gallery loading performance improved.
  * test_steps:

    - Test gallery image loading.
    - Verify WebP optimization.
    - Check performance impact.
  * notes: Replace placeholders with actual work to showcase skills.

* [ ] `T-7003` **Implement intersection observer for gallery lazy loading**

  * priority: 4
  * estimate_m: 45
  * labels: [performance, lazy-loading, user-experience]
  * assignee: @frontend
  * status: open
  * due: 2026-03-25
  * deps: [T-7002]
  * target_files: [src/components/Gallery.tsx]
  * related_files: [src/hooks/useIntersectionObserver.ts]
  * sub-tasks:

    - [ ] Ensure intersection observer hook created in src/hooks/useIntersectionObserver.ts.
    - [ ] Ensure gallery uses intersection observer in src/components/Gallery.tsx.
    - [ ] Ensure images load only when visible in src/components/Gallery.tsx.
    - [ ] Create custom intersection observer hook.
    - [ ] Implement lazy loading for gallery images.
    - [ ] Add smooth fade-in animations for loaded images.
    - [ ] Test performance improvements.

    1. Intersection observer implemented.
    2. Gallery images load only when needed.
    3. Initial page load performance improved.
  * test_steps:

    - Test lazy loading functionality.
    - Verify performance improvements.
    - Check user experience impact.
  * notes: Improves initial page load performance.

* [ ] `T-7004` **Add resource hints for critical CSS and fonts**

  * priority: 4
  * estimate_m: 30
  * labels: [performance, css, fonts, optimization]
  * assignee: @frontend
  * status: open
  * due: 2026-03-18
  * deps: []
  * target_files: [src/app/layout.tsx]
  * related_files: [src/app/globals.css]
  * sub-tasks:

    - [ ] Ensure preconnect hints added for fonts in src/app/layout.tsx.
    - [ ] Ensure preload hints added for critical CSS in src/app/layout.tsx.
    - [ ] Ensure DNS prefetch for external resources in src/app/layout.tsx.
    - [ ] Add preconnect for Google Fonts.
    - [ ] Add preload for critical CSS.
    - [ ] Add DNS prefetch for external domains.
    - [ ] Test resource loading performance.

    1. Resource hints implemented.
    2. Font loading performance improved.
    3. Critical CSS loads faster.
  * test_steps:

    - Test font loading performance.
    - Verify CSS loading optimization.
    - Check resource timing metrics.
  * notes: Improves perceived loading performance.

* [ ] `T-7005` **Optimize barber profile images**

  * priority: 3
  * estimate_m: 45
  * labels: [performance, images, team]
  * assignee: @frontend
  * status: open
  * due: 2026-03-22
  * deps: []
  * target_files: [src/components/Barbers.tsx, public/images/barbers/**/*]
  * related_files: [src/data/barbers.ts]
  * sub-tasks:

    - [ ] Ensure individual barber photos created in public/images/barbers/**/*.
    - [ ] Ensure proper image optimization in src/components/Barbers.tsx.
    - [ ] Ensure consistent image sizes and formats in src/components/Barbers.tsx.
    - [ ] Create professional headshots for each barber.
    - [ ] Optimize images for web performance.
    - [ ] Update Barbers component with optimized images.
    - [ ] Update barber data with new image paths.

    1. Professional barber photos implemented.
    2. Image optimization applied.
    3. Team section performance maintained.
  * test_steps:

    - Test barber image loading.
    - Verify optimization settings.
    - Check team section performance.
  * notes: Professional appearance is crucial for client trust.

* [ ] `T-7006` **Implement speculative prefetching for booking flow**

  * priority: 4
  * estimate_m: 30
  * labels: [performance, booking, user-experience]
  * assignee: @frontend
  * status: open
  * due: 2026-03-28
  * deps: []
  * target_files: [src/components/Services.tsx, src/components/Barbers.tsx]
  * related_files: [src/app/page.tsx]
  * sub-tasks:

    - [ ] Ensure prefetch hints added for booking pages in src/components/Services.tsx.
    - [ ] Ensure prefetch hints added for barber profiles in src/components/Barbers.tsx.
    - [ ] Ensure intelligent prefetching based on user interaction in src/app/page.tsx.
    - [ ] Add prefetch for booking system.
    - [ ] Add prefetch for barber detail pages.
    - [ ] Implement interaction-based prefetching.
    - [ ] Test booking flow performance.

    1. Prefetching implemented for booking flow.
    2. Booking navigation is instant.
    3. User experience improved.
  * test_steps:

    - Test prefetching functionality.
    - Verify booking flow performance.
    - Check user experience impact.
  * notes: Anticipates user behavior for smoother experience.

---

* [ ] `T-5003` **Update documentation**

  * priority: 3
  * estimate_m: 60
  * labels: [docs, maintenance]
  * assignee: @docs
  * status: planned
  * recurring:

    type: after major changes
    next_due: after significant updates
  * target_files: [README.md, docs/**/*]
  * related_files: []
  * sub-tasks:

    - [ ] Document API changes in README.md and docs/**/*.
    - [ ] Document behavioral changes from fixes in README.md and docs/**/*.
    - [ ] Update README and docs as needed.
    - [ ] Review recent changes for documentation needs.
    - [ ] Update relevant documentation files.
    - [ ] Check docs build.

    1. Document API changes.
    2. Document behavioral changes from fixes.
    3. Update README and docs as needed.
  * test_steps:

* Assign T-ID
* Assign priority
* Define acceptance criteria
* Define estimate

This prevents roadmap/task mixing.

---

# Structural Improvements Applied

1. Removed mixed formatting between bullet and structured blocks.
2. Removed duplicate explanatory prose.
3. Enforced consistent:

   * Field order
   * Label casing
   * Priority model
   * Status enum
4. Separated:

   * Active tasks
   * Recurring tasks
   * Enhancements
   * Reference documentation
5. Reduced narrative instructions to canonical operational rules.

---

