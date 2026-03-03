// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { serviceRepository } from '@/lib/repositories/service-repository'
import { validateBookingForm, RateLimiter } from '@/lib/security'
import { z } from 'zod'

// Initialize rate limiter for services endpoint
const servicesRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

// GET /api/services - Get all active services
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!servicesRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Fetch all active services
    const services = await serviceRepository.findAll()

    return NextResponse.json({
      services,
      count: services.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // TODO: Add authentication check for admin role
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

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

    return NextResponse.json({
      service,
      message: 'Service created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create service API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid service data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
