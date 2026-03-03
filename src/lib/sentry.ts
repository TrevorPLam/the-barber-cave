import * as Sentry from '@sentry/nextjs'

/**
 * Initialize Sentry for error monitoring.
 * Called once at application startup in production.
 */
export function initSentry(): void {
  if (process.env.NODE_ENV !== 'production') return
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  })
}

export { Sentry }
