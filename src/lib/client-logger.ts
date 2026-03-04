/**
 * @file Browser-safe production logger
 * @description Lightweight client-side logger that suppresses all output in production.
 * Use this in client components and universal utilities instead of `console.*` directly.
 *
 * For server-side logging use `src/lib/logger.ts` (pino-based).
 *
 * @example
 * ```ts
 * import { clientLogger } from '@/lib/client-logger';
 * clientLogger.warn('Something went wrong', error);
 * ```
 */

/** Evaluated once at module load — never changes at runtime. */
const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * Production-safe browser logger.
 * All methods are no-ops in production; they delegate to the matching
 * `console.*` method only in development/test environments.
 */
export const clientLogger = {
  /** Log a debug message (dev/test only). */
  debug: (...args: unknown[]): void => {
    if (IS_DEV) console.debug(...args);
  },
  /** Log an informational message (dev/test only). */
  info: (...args: unknown[]): void => {
    if (IS_DEV) console.info(...args);
  },
  /** Log a warning (dev/test only). */
  warn: (...args: unknown[]): void => {
    if (IS_DEV) console.warn(...args);
  },
  /**
   * Log an error.
   * Errors are always logged so that production issues remain visible.
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};
