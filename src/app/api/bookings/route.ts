import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateBookingForm, RateLimiter } from '@/lib/security';
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
    const validatedData = createBookingSchema.parse(body);

    // Additional business logic validation
    const bookingDate = new Date(validatedData.date);
    const now = new Date();

    if (bookingDate < now) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check if time slot is available (mock implementation)
    const isAvailable = await checkTimeSlotAvailability(
      validatedData.barberId,
      validatedData.date,
      validatedData.time
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
    const booking = await createBooking({
      ...validatedData,
      userId: session?.user?.id
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

// GET endpoint to retrieve bookings (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's bookings
    const bookings = await getUserBookings(session.user.id);

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock functions - replace with actual database operations
async function checkTimeSlotAvailability(barberId: string, date: string, time: string): Promise<boolean> {
  // Mock availability check - in production, query database
  const bookedSlots = ['10:00', '14:30']; // Example booked slots
  return !bookedSlots.includes(time);
}

async function createBooking(data: any): Promise<{ id: string }> {
  // Mock booking creation - in production, save to database
  const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));

  return { id: bookingId };
}

async function getUserBookings(userId: string): Promise<any[]> {
  // Mock user bookings retrieval - in production, query database
  return [
    {
      id: 'booking-123',
      date: '2026-03-29',
      time: '14:00',
      serviceId: 'service-1',
      barberId: 'barber-1',
      status: 'confirmed'
    }
  ];
}
