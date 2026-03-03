import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateBookingForm, RateLimiter } from '@/lib/security';
import { bookingRepository } from '@/lib/repositories/booking-repository';
import { serviceRepository } from '@/lib/repositories/service-repository';
import { barberRepository } from '@/lib/repositories/barber-repository';
import { z } from 'zod';

// Initialize rate limiter for booking endpoint
const bookingRateLimiter = new RateLimiter(5, 300000); // 5 requests per 5 minutes

// Booking creation schema
const createBookingSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  barberId: z.string().uuid('Invalid barber ID'),
  date: z.string().datetime('Invalid date format'),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  customerInfo: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format'),
    notes: z.string().max(500, 'Notes too long').optional()
  })
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Apply rate limiting
    if (!bookingRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many booking requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate session (optional - allow guest bookings)
    const session = await getServerSession(authOptions);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateBookingForm(body);

    // Additional business logic validation
    const bookingDate = new Date(validatedData.date);
    const now = new Date();

    if (bookingDate < now) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check if service exists and is active
    const service = await serviceRepository.findById(parseInt(validatedData.serviceId));
    if (!service) {
      return NextResponse.json(
        { error: 'Selected service is not available' },
        { status: 400 }
      );
    }

    // Check if barber exists and is active
    const barber = await barberRepository.findById(parseInt(validatedData.barberId));
    if (!barber) {
      return NextResponse.json(
        { error: 'Selected barber is not available' },
        { status: 400 }
      );
    }

    // Check availability for this time slot
    const isAvailable = await bookingRepository.checkAvailability(
      parseInt(validatedData.barberId),
      bookingDate,
      validatedData.time,
      service.duration
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 409 }
      );
    }

    // Check business hours (example: 9 AM - 8 PM)
    const bookingHour = parseInt(validatedData.time.split(':')[0]);
    if (bookingHour < 9 || bookingHour > 20) {
      return NextResponse.json(
        { error: 'Bookings are only available between 9 AM and 8 PM' },
        { status: 400 }
      );
    }

    // Process booking
    const booking = await bookingRepository.create({
      customerName: validatedData.customerInfo.name,
      customerEmail: validatedData.customerInfo.email,
      customerPhone: validatedData.customerInfo.phone || '',
      serviceId: parseInt(validatedData.serviceId),
      barberId: parseInt(validatedData.barberId),
      date: bookingDate,
      time: validatedData.time,
      duration: service.duration,
      price: service.price,
      notes: validatedData.customerInfo.notes,
    });

    // Return success response (without sensitive data)
    return NextResponse.json({
      id: booking.id,
      status: 'confirmed',
      message: 'Booking confirmed successfully',
      booking: {
        date: validatedData.date,
        time: validatedData.time,
        serviceId: validatedData.serviceId,
        barberId: validatedData.barberId
      }
    });

  } catch (error) {
    console.error('Booking API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve bookings
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!bookingRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customerEmail');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    let bookings;

    if (customerEmail) {
      // Allow customers to view their own bookings by email
      bookings = await bookingRepository.findByCustomerEmail(customerEmail);
    } else if (session) {
      // TODO: Add role-based access control
      // For now, authenticated users can see all bookings (admin functionality)
      bookings = await bookingRepository.findAll(limit, offset);
    } else {
      return NextResponse.json(
        { error: 'Authentication required or provide customer email' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      bookings,
      count: bookings.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
