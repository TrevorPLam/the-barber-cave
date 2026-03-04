/**
 * Audit logging — append-only event log for sensitive operations.
 *
 * Records who did what, on which resource, and when.  In production the events
 * are forwarded to the structured logger (Axiom / pino) so they land in the
 * same observability pipeline as application logs.  In development they are
 * pretty-printed to the console.
 * @example
 * ```ts
 * await logAuditEvent({
 *   action: 'booking.create',
 *   userId: session.user.id,
 *   resource: 'bookings',
 *   resourceId: booking.id,
 *   metadata: { serviceId, barberId },
 *   ip,
 * })
 * ```
 */

import { logger } from './logger'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Categories of audit-worthy actions. */
export type AuditAction =
  | 'booking.create'
  | 'booking.update'
  | 'booking.cancel'
  | 'booking.complete'
  | 'booking.no_show'
  | 'barber.create'
  | 'barber.update'
  | 'barber.delete'
  | 'service.create'
  | 'service.update'
  | 'service.delete'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.failed'
  | 'admin.access'

/** Audit event payload. */
export interface AuditEvent {
  /** Action that was performed. */
  action: AuditAction
  /** ID of the user who performed the action, or 'anonymous' for guests. */
  userId: string
  /** Resource type that was acted upon (e.g. 'bookings'). */
  resource: string
  /** ID of the specific resource instance, if applicable. */
  resourceId?: string
  /** Additional context — must not contain PII beyond what's already present. */
  metadata?: Record<string, unknown>
  /** Client IP address for security analysis. */
  ip?: string
  /** ISO 8601 timestamp — set automatically when omitted. */
  timestamp?: string
}

/** Minimal request-like interface for extracting client IP from headers. */
export interface RequestLike {
  /** Direct client IP (populated by some runtimes). */
  ip?: string
  /** HTTP headers accessor. */
  headers: {
    /** Retrieve a header value by name. */
    get(name: string): string | null
  }
}

// ─── Implementation ───────────────────────────────────────────────────────────

/**
 * Log an immutable audit event.
 *
 * The function is async so callers can await it if they need to confirm the
 * write, but the implementation never throws — failures are swallowed and
 * logged as errors so they never break the critical path.
 * @param event Audit event to record.
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const entry: Required<AuditEvent> = {
      ...event,
      resourceId: event.resourceId ?? '',
      metadata: event.metadata ?? {},
      ip: event.ip ?? 'unknown',
      timestamp: event.timestamp ?? new Date().toISOString(),
    }

    logger.info({ audit: true, ...entry }, `AUDIT ${entry.action}`)
  } catch {
    // Audit logging must never crash the application.
  }
}

/**
 * Convenience wrapper that extracts common request headers.
 *
 * Reads IP from `request.ip` first, then `x-forwarded-for`, then `x-real-ip`.
 * @param event   Audit event without the `ip` field.
 * @param request Next.js `Request` / `NextRequest` (or any `RequestLike`).
 * @returns Promise that resolves when the event is logged.
 */
export async function logAuditEventFromRequest(
  event: Omit<AuditEvent, 'ip'>,
  request: RequestLike,
): Promise<void> {
  const ip =
    request.ip ??
    request.headers.get('x-forwarded-for')?.split(',')[0] ??
    request.headers.get('x-real-ip') ??
    'unknown'

  return logAuditEvent({ ...event, ip })
}
