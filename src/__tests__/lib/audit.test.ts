// src/__tests__/lib/audit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logAuditEvent, logAuditEventFromRequest } from '../../lib/audit'

// Mock the logger so tests don't produce noise and we can inspect calls.
vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

// Import the mocked logger so we can assert on it.
import { logger } from '../../lib/logger'

describe('logAuditEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs an info entry with audit=true', async () => {
    await logAuditEvent({
      action: 'booking.create',
      userId: 'user-123',
      resource: 'bookings',
      resourceId: 'booking-abc',
    })
    expect(logger.info).toHaveBeenCalledOnce()
    const [meta, msg] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.audit).toBe(true)
    expect(meta.action).toBe('booking.create')
    expect(meta.userId).toBe('user-123')
    expect(msg).toContain('booking.create')
  })

  it('populates default fields when omitted', async () => {
    await logAuditEvent({
      action: 'auth.login',
      userId: 'anon',
      resource: 'auth',
    })
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('unknown')
    expect(meta.resourceId).toBe('')
    expect(meta.metadata).toEqual({})
    expect(meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('preserves provided ip, resourceId and metadata', async () => {
    await logAuditEvent({
      action: 'booking.cancel',
      userId: 'user-99',
      resource: 'bookings',
      resourceId: 'booking-xyz',
      ip: '192.168.1.1',
      metadata: { reason: 'no-show' },
    })
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('192.168.1.1')
    expect(meta.resourceId).toBe('booking-xyz')
    expect(meta.metadata).toEqual({ reason: 'no-show' })
  })

  it('never throws — swallows errors silently', async () => {
    ;(logger.info as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Logger failure')
    })
    await expect(
      logAuditEvent({ action: 'auth.failed', userId: 'x', resource: 'auth' }),
    ).resolves.toBeUndefined()
  })
})

describe('logAuditEventFromRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('extracts ip from x-forwarded-for header', async () => {
    const request = {
      ip: undefined,
      headers: { get: (name: string) => (name === 'x-forwarded-for' ? '10.0.0.1, 10.0.0.2' : null) },
    }
    await logAuditEventFromRequest(
      { action: 'admin.access', userId: 'admin-1', resource: 'admin' },
      request,
    )
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('10.0.0.1')
  })

  it('uses request.ip when available', async () => {
    const request = {
      ip: '1.2.3.4',
      headers: { get: () => null },
    }
    await logAuditEventFromRequest(
      { action: 'booking.create', userId: 'u1', resource: 'bookings' },
      request,
    )
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    const request = {
      ip: undefined,
      headers: {
        get: (name: string) => (name === 'x-real-ip' ? '9.9.9.9' : null),
      },
    }
    await logAuditEventFromRequest(
      { action: 'auth.login', userId: 'u2', resource: 'auth' },
      request,
    )
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('9.9.9.9')
  })

  it('uses unknown when no ip information is available', async () => {
    const request = { ip: undefined, headers: { get: () => null } }
    await logAuditEventFromRequest(
      { action: 'auth.logout', userId: 'u3', resource: 'auth' },
      request,
    )
    const [meta] = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(meta.ip).toBe('unknown')
  })
})
