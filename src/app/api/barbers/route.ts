// src/app/api/barbers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { barberRepository } from '@/lib/repositories/barber-repository'
import { RateLimiter } from '@/lib/security'
import { getCachedData, appCache } from '@/lib/cache'
import { handleAPIError } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize rate limiter for barbers endpoint
const barbersRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

const BARBERS_CACHE_KEY = 'api:barbers:all'
const BARBERS_CACHE_TTL = 3600 // 1 hour

// GET /api/barbers - Get all active barbers
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!barbersRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      )
    }

    // Fetch all active barbers (cached for 1 hour)
    const barbers = await getCachedData(
      BARBERS_CACHE_KEY,
      () => barberRepository.findAll(),
      BARBERS_CACHE_TTL,
    )

    return NextResponse.json(
      {
        barbers,
        count: barbers.length,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )

  } catch (error) {
    return handleAPIError(error)
  }
}

// POST /api/barbers - Create new barber (admin only)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!barbersRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    const BarberSchema = z.object({
      name: z.string().min(1).max(100),
      email: z.string().email().max(255),
      phone: z.string().optional(),
      bio: z.string().optional(),
      avatar: z.string().url().optional(),
    })

    const validatedData = BarberSchema.parse(body)

    // Check if barber with this email already exists
    const existingBarber = await barberRepository.findByEmail(validatedData.email)
    if (existingBarber) {
      return NextResponse.json(
        { error: 'Barber with this email already exists', code: 'CONFLICT' },
        { status: 409 }
      )
    }

    // Create barber
    const barber = await barberRepository.create(validatedData)

    // Invalidate the barbers cache so the next GET reflects the new data
    appCache.delete(BARBERS_CACHE_KEY)

    return NextResponse.json({
      barber,
      message: 'Barber created successfully'
    }, { status: 201 })

  } catch (error) {
    return handleAPIError(error)
  }
}
