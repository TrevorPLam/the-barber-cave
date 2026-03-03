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
let validatedEnv: any

try {
  validatedEnv = envSchema.parse(process.env)
} catch (error) {
  console.error('❌ Invalid environment variables:', error)
  process.exit(1)
}

// Export validated environment
export const ENV = {
  NODE_ENV: validatedEnv.NODE_ENV,
  NEXT_PUBLIC_APP_URL: validatedEnv.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ANALYTICS_ID: validatedEnv.NEXT_PUBLIC_ANALYTICS_ID,
  // Server-only variables
  API_SECRET_KEY: validatedEnv.API_SECRET_KEY,
  DATABASE_URL: validatedEnv.DATABASE_URL,
  SMTP_PASSWORD: validatedEnv.SMTP_PASSWORD
}

// Development-only checks
if (ENV.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected')
  console.log('📊 Analytics:', ENV.NEXT_PUBLIC_ANALYTICS_ID ? 'enabled' : 'disabled')
}
