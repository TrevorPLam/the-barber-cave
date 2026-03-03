// src/app/api/barbers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { barberRepository } from '@/lib/repositories/barber-repository'
import { RateLimiter } from '@/lib/security'
import { z } from 'zod'

// Initialize rate limiter for barbers endpoint
const barbersRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

// GET /api/barbers - Get all active barbers
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!barbersRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Fetch all active barbers
    const barbers = await barberRepository.findAll()

    return NextResponse.json({
      barbers,
      count: barbers.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Barbers API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
        { error: 'Barber with this email already exists' },
        { status: 409 }
      )
    }

    // Create barber
    const barber = await barberRepository.create(validatedData)

    return NextResponse.json({
      barber,
      message: 'Barber created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create barber API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid barber data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
