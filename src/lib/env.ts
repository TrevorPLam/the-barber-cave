// src/lib/env.ts - Type-safe environment variables
import { z } from 'zod'

const envSchema = z.object({
  // Runtime
  NODE_ENV: z.enum(['development', 'test', 'production']),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(60), // bcrypt hash

  // CSRF
  CSRF_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z.string().url(),

  // Logging (optional in dev)
  AXIOM_DATASET: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),

  // Analytics (public — safe to expose)
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

// Fail loudly at startup if env is misconfigured
// Never silently fall back to defaults for security-sensitive vars
export const ENV = envSchema.parse(process.env)
