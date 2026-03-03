// src/app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { bookingRepository } from '@/lib/repositories/booking-repository'
import { serviceRepository } from '@/lib/repositories/service-repository'
import { barberRepository } from '@/lib/repositories/barber-repository'
import { RateLimiter } from '@/lib/security'
import { z } from 'zod'

// Initialize rate limiter for availability endpoint
const availabilityRateLimiter = new RateLimiter(200, 60000) // 200 requests per minute

// GET /api/availability?barberId=X&date=YYYY-MM-DD&serviceId=Y
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown'

    if (!availabilityRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const barberId = searchParams.get('barberId')
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    // Validation
    const AvailabilitySchema = z.object({
      barberId: z.string().min(1, 'Barber ID required'),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
      serviceId: z.string().min(1, 'Service ID required'),
    })

    const validatedData = AvailabilitySchema.parse({
      barberId,
      date,
      serviceId,
    })

    // Verify barber exists
    const barber = await barberRepository.findById(parseInt(validatedData.barberId))
    if (!barber) {
      return NextResponse.json(
        { error: 'Barber not found' },
        { status: 404 }
      )
    }

    // Verify service exists
    const service = await serviceRepository.findById(parseInt(validatedData.serviceId))
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Parse date and validate it's not in the past
    const requestedDate = new Date(validatedData.date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot check availability for past dates' },
        { status: 400 }
      )
    }

    // Get available time slots
    const availableSlots = await bookingRepository.getAvailableSlots(
      parseInt(validatedData.barberId),
      requestedDate,
      parseInt(validatedData.serviceId)
    )

    return NextResponse.json({
      barberId: validatedData.barberId,
      date: validatedData.date,
      serviceId: validatedData.serviceId,
      availableSlots,
      count: availableSlots.length,
      businessHours: {
        start: '09:00',
        end: '20:00',
        daysOff: ['sunday'] // Example - could be configurable
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Availability API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
