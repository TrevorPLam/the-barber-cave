// src/__tests__/api/barbers.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Hoist mock instances so they can be referenced inside vi.mock factories
const { mockIsAllowed } = vi.hoisted(() => ({
  mockIsAllowed: vi.fn().mockReturnValue(true),
}))

vi.mock('@/lib/repositories/barber-repository', () => ({
  barberRepository: {
    findAll: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCachedData: vi.fn(),
  appCache: { delete: vi.fn(), get: vi.fn(), set: vi.fn() },
}))

vi.mock('@/lib/security', () => ({
  // Use class syntax so `new RateLimiter()` works correctly
  RateLimiter: class {
    isAllowed = mockIsAllowed
  },
  validateBookingForm: vi.fn(),
}))

import { GET, POST } from '@/app/api/barbers/route'
import { barberRepository } from '@/lib/repositories/barber-repository'
import { getCachedData, appCache } from '@/lib/cache'

const MOCK_BARBER = {
  id: 1,
  name: 'Marcus Johnson',
  email: 'marcus@barbercave.com',
  isActive: true,
}
const VALID_BARBER_BODY = {
  name: 'Marcus Johnson',
  email: 'marcus@barbercave.com',
}

describe('GET /api/barbers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAllowed.mockReturnValue(true)
  })

  it('returns barbers list with count and timestamp', async () => {
    vi.mocked(getCachedData).mockResolvedValue([MOCK_BARBER])

    const response = await GET(new NextRequest('http://localhost/api/barbers'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.barbers).toEqual([MOCK_BARBER])
    expect(data.count).toBe(1)
    expect(typeof data.timestamp).toBe('string')
  })

  it('returns empty barbers array when none exist', async () => {
    vi.mocked(getCachedData).mockResolvedValue([])

    const response = await GET(new NextRequest('http://localhost/api/barbers'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.barbers).toEqual([])
    expect(data.count).toBe(0)
  })

  it('includes Cache-Control header with s-maxage=3600', async () => {
    vi.mocked(getCachedData).mockResolvedValue([])

    const response = await GET(new NextRequest('http://localhost/api/barbers'))

    expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600')
  })

  it('returns 429 when rate limited', async () => {
    mockIsAllowed.mockReturnValue(false)

    const response = await GET(new NextRequest('http://localhost/api/barbers'))
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.code).toBe('RATE_LIMITED')
  })

  it('returns 500 when repository throws', async () => {
    vi.mocked(getCachedData).mockRejectedValue(new Error('DB connection failed'))

    const response = await GET(new NextRequest('http://localhost/api/barbers'))

    expect(response.status).toBe(500)
  })
})

describe('POST /api/barbers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAllowed.mockReturnValue(true)
  })

  it('creates a barber and returns 201', async () => {
    vi.mocked(barberRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(barberRepository.create).mockResolvedValue(MOCK_BARBER)

    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_BARBER_BODY),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.barber).toEqual(MOCK_BARBER)
    expect(data.message).toBe('Barber created successfully')
  })

  it('invalidates barbers cache after creating a barber', async () => {
    vi.mocked(barberRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(barberRepository.create).mockResolvedValue(MOCK_BARBER)

    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_BARBER_BODY),
    })
    await POST(request)

    expect(appCache.delete).toHaveBeenCalledWith('api:barbers:all')
  })

  it('returns 409 when barber with email already exists', async () => {
    vi.mocked(barberRepository.findByEmail).mockResolvedValue(MOCK_BARBER)

    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_BARBER_BODY),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.code).toBe('CONFLICT')
    expect(barberRepository.create).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid request body (empty name)', async () => {
    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'valid@email.com' }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Marcus', email: 'not-an-email' }),
    })
    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    mockIsAllowed.mockReturnValue(false)

    const request = new NextRequest('http://localhost/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_BARBER_BODY),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.code).toBe('RATE_LIMITED')
  })
})
