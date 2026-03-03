import pino from 'pino'

// next-axiom transport routes logs to Axiom in production
// Falls back to pretty-print in development
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  ...(process.env.NODE_ENV === 'production'
    ? {
        transport: {
          target: '@axiomhq/pino',
          options: {
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
          },
        },
      }
    : {
        transport: { target: 'pino-pretty' },
      }),
})

// Drop-in replacement for console.error — never exposes stack traces in prod
export function logError(context: string, error: unknown, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    logger.error({ context, ...meta }, error instanceof Error ? error.message : String(error))
  } else {
    logger.error({ context, ...meta }, error)
  }
}
