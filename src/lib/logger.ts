import pino from 'pino'
import { ENV } from './env'

// next-axiom transport routes logs to Axiom in production
// Falls back to pretty-print in development
export const logger = pino({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  ...(ENV.NODE_ENV === 'production'
    ? {
        transport: {
          target: '@axiomhq/pino',
          options: {
            dataset: ENV.AXIOM_DATASET,
            token: ENV.AXIOM_TOKEN,
          },
        },
      }
    : {
        transport: { target: 'pino-pretty' },
      }),
})

// Drop-in replacement for console.error — never exposes stack traces in prod
export function logError(context: string, error: unknown, meta?: Record<string, unknown>) {
  if (ENV.NODE_ENV === 'production') {
    logger.error({ context, ...meta }, error instanceof Error ? error.message : String(error))
  } else {
    logger.error({ context, ...meta }, error)
  }
}
