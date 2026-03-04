// src/__tests__/api/services.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Hoist mock instances so they can be referenced inside vi.mock factories
const { mockIsAllowed } = vi.hoisted(() => ({
  mockIsAllowed: vi.fn().mockReturnValue(true),
}))

vi.mock('@/lib/repositories/service-repository', () => ({
  serviceRepository: {
    findAll: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCachedData: vi.fn(),
  appCache: { delete: vi.fn(), get: vi.fn(), set: vi.fn() },
}))

vi.mock('@/lib/dal', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue({ user: { role: 'admin' } }),
  verifySession: vi.fn().mockResolvedValue({ user: { role: 'admin' } }),
}))

vi.mock('@/lib/security', () => ({
  // Use class syntax so `new RateLimiter()` works correctly
  RateLimiter: class {
    isAllowed = mockIsAllowed
  },
  validateBookingForm: vi.fn(),
}))

import { GET, POST } from '@/app/api/services/route'
import { serviceRepository } from '@/lib/repositories/service-repository'
import { getCachedData, appCache } from '@/lib/cache'

const VALID_SERVICE_BODY = { name: 'Haircut', duration: 30, price: '25.00' }
const MOCK_SERVICE = { id: 1, name: 'Haircut', duration: 30, price: '25.00', isActive: true }

describe('GET /api/services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAllowed.mockReturnValue(true)
  })

  it('returns services list with count and timestamp', async () => {
    vi.mocked(getCachedData).mockResolvedValue([MOCK_SERVICE])

    const response = await GET(new NextRequest('http://localhost/api/services'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.services).toEqual([MOCK_SERVICE])
    expect(data.count).toBe(1)
    expect(typeof data.timestamp).toBe('string')
  })

  it('returns empty services array when none exist', async () => {
    vi.mocked(getCachedData).mockResolvedValue([])

    const response = await GET(new NextRequest('http://localhost/api/services'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.services).toEqual([])
    expect(data.count).toBe(0)
  })

  it('includes Cache-Control header with s-maxage=3600', async () => {
    vi.mocked(getCachedData).mockResolvedValue([])

    const response = await GET(new NextRequest('http://localhost/api/services'))

    expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600')
  })

  it('returns 429 when rate limited', async () => {
    mockIsAllowed.mockReturnValue(false)

    const response = await GET(new NextRequest('http://localhost/api/services'))
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.code).toBe('RATE_LIMITED')
  })

  it('returns 500 when repository throws', async () => {
    vi.mocked(getCachedData).mockRejectedValue(new Error('DB connection failed'))

    const response = await GET(new NextRequest('http://localhost/api/services'))

    expect(response.status).toBe(500)
  })
})

describe('POST /api/services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAllowed.mockReturnValue(true)
  })

  it('creates a service and returns 201', async () => {
    vi.mocked(serviceRepository.create).mockResolvedValue(MOCK_SERVICE)

    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_SERVICE_BODY),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.service).toEqual(MOCK_SERVICE)
    expect(data.message).toBe('Service created successfully')
  })

  it('invalidates services cache after creating a service', async () => {
    vi.mocked(serviceRepository.create).mockResolvedValue(MOCK_SERVICE)

    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_SERVICE_BODY),
    })
    await POST(request)

    expect(appCache.delete).toHaveBeenCalledWith('api:services:all')
  })

  it('returns 400 for invalid request body (empty name)', async () => {
    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', duration: 30, price: '25.00' }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Haircut' }), // missing duration and price
    })
    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('returns 400 for invalid price format', async () => {
    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Haircut', duration: 30, price: '25' }), // missing .00
    })
    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    mockIsAllowed.mockReturnValue(false)

    const request = new NextRequest('http://localhost/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_SERVICE_BODY),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.code).toBe('RATE_LIMITED')
  })
})
