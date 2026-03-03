// src/lib/security.ts - Comprehensive security utilities
import DOMPurify from 'dompurify'
import { z } from 'zod'
import { createHmac, timingSafeEqual } from 'crypto'

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
  const cryptoModule = require('crypto')
  return cryptoModule.randomBytes(32).toString('hex')
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

export function validateHmacCsrfToken(tokenWithSig: string): boolean {
  const [token, sig] = tokenWithSig.split('.')
  if (!token || !sig) return false
  const expected = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(token)
    .digest('hex')
  // Constant-time comparison prevents timing attacks
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}
