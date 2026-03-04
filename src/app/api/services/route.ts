// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { serviceRepository } from '@/lib/repositories/service-repository'
import { validateBookingForm, RateLimiter } from '@/lib/security'
import { verifyAdminSession } from '@/lib/dal'
import { getCachedData, appCache } from '@/lib/cache'
import { handleAPIError } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize rate limiter for services endpoint
const servicesRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

const SERVICES_CACHE_KEY = 'api:services:all'
const SERVICES_CACHE_TTL = 3600 // 1 hour

// GET /api/services - Get all active services
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!servicesRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      )
    }

    // Fetch all active services (cached for 1 hour)
    const services = await getCachedData(
      SERVICES_CACHE_KEY,
      () => serviceRepository.findAll(),
      SERVICES_CACHE_TTL,
    )

    return NextResponse.json(
      {
        services,
        count: services.length,
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

// POST /api/services - Create new service (admin only)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!servicesRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      )
    }

    // DAL authentication gate - throws redirect if not admin
    await verifyAdminSession()

    // Parse and validate request body
    const body = await request.json()

    const ServiceSchema = z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      duration: z.number().min(5).max(480), // 5 minutes to 8 hours
      price: z.string().regex(/^\d+\.\d{2}$/), // Format: "25.00"
    })

    const validatedData = ServiceSchema.parse(body)

    // Create service
    const service = await serviceRepository.create({
      ...validatedData,
      price: validatedData.price,
    })

    // Invalidate the services cache so the next GET reflects the new data
    appCache.delete(SERVICES_CACHE_KEY)

    return NextResponse.json({
      service,
      message: 'Service created successfully'
    }, { status: 201 })

  } catch (error) {
    return handleAPIError(error)
  }
}
