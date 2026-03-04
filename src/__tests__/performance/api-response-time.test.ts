// src/__tests__/performance/api-response-time.test.ts
// T-Z003: Performance Regression Testing
//
// Verifies that API route handlers respond within acceptable time budgets
// when operating with mocked dependencies (i.e. measures pure handler overhead,
// not DB latency).  Any result above the threshold signals a code-level
// performance regression in the handler itself.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mock all I/O dependencies ───────────────────────────────────────────────

vi.mock('@/lib/repositories/service-repository', () => ({
  serviceRepository: { findAll: vi.fn(), create: vi.fn() },
}))

vi.mock('@/lib/repositories/barber-repository', () => ({
  barberRepository: { findAll: vi.fn(), findByEmail: vi.fn(), create: vi.fn() },
}))

vi.mock('@/lib/repositories/booking-repository', () => ({
  bookingRepository: {
    findAll: vi.fn(),
    findByCustomerEmail: vi.fn(),
    checkAvailability: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCachedData: vi.fn().mockResolvedValue([]),
  appCache: { delete: vi.fn(), get: vi.fn(), set: vi.fn() },
}))

vi.mock('@/lib/dal', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue({ user: { role: 'admin' } }),
  verifySession: vi.fn().mockResolvedValue({ user: { role: 'admin' } }),
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
  default: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// All three route modules share this class — isAllowed always returns true
// so performance tests measure handler logic without rate-limit overhead.
vi.mock('@/lib/security', () => ({
  // Use class syntax so `new RateLimiter()` works correctly
  RateLimiter: class {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isAllowed(_ip: string) {
      return true
    }
  },
  validateBookingForm: vi.fn().mockReturnValue({
    serviceId: '00000000-0000-0000-0000-000000000001',
    barberId: '00000000-0000-0000-0000-000000000002',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '10:00',
    customerInfo: { name: 'Jane Doe', email: 'jane@example.com', phone: '+15550001234' },
  }),
}))

// ─── Import handlers after mocks ─────────────────────────────────────────────

import { GET as servicesGET } from '@/app/api/services/route'
import { GET as barbersGET } from '@/app/api/barbers/route'
import { GET as bookingsGET } from '@/app/api/bookings/route'
import { getCachedData } from '@/lib/cache'
import { bookingRepository } from '@/lib/repositories/booking-repository'

// ─── Thresholds ──────────────────────────────────────────────────────────────

/** Maximum acceptable handler latency (ms) for in-process calls with mocked I/O. */
const HANDLER_BUDGET_MS = 500

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function measureMs(fn: () => Promise<unknown>): Promise<number> {
  const start = performance.now()
  await fn()
  return performance.now() - start
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('API Handler Response-Time Budget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCachedData).mockResolvedValue([])
  })

  it(`GET /api/services responds within ${HANDLER_BUDGET_MS}ms`, async () => {
    const elapsed = await measureMs(() =>
      servicesGET(new NextRequest('http://localhost/api/services')),
    )
    expect(elapsed).toBeLessThan(HANDLER_BUDGET_MS)
  })

  it(`GET /api/barbers responds within ${HANDLER_BUDGET_MS}ms`, async () => {
    const elapsed = await measureMs(() =>
      barbersGET(new NextRequest('http://localhost/api/barbers')),
    )
    expect(elapsed).toBeLessThan(HANDLER_BUDGET_MS)
  })

  it(`GET /api/bookings responds within ${HANDLER_BUDGET_MS}ms (customer email)`, async () => {
    vi.mocked(bookingRepository.findByCustomerEmail).mockResolvedValue([])

    const elapsed = await measureMs(() =>
      bookingsGET(
        new NextRequest('http://localhost/api/bookings?customerEmail=test@example.com'),
      ),
    )
    expect(elapsed).toBeLessThan(HANDLER_BUDGET_MS)
  })

  it('GET /api/services returns 200 (smoke-test with perf mock)', async () => {
    const response = await servicesGET(
      new NextRequest('http://localhost/api/services'),
    )
    expect(response.status).toBe(200)
  })

  it('GET /api/barbers returns 200 (smoke-test with perf mock)', async () => {
    const response = await barbersGET(
      new NextRequest('http://localhost/api/barbers'),
    )
    expect(response.status).toBe(200)
  })
})
