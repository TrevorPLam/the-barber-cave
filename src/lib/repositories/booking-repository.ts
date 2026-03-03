// src/lib/repositories/booking-repository.ts
import { db } from '../db'
import { bookings, services, barbers } from '../db/schema'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import type { Booking, NewBooking } from '../db/schema'

export class BookingRepository {
  async findAll(limit = 50, offset = 0): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async findById(id: string): Promise<Booking | null> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id))
    return result[0] || null
  }

  async findByCustomerEmail(email: string): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .where(eq(bookings.customerEmail, email))
      .orderBy(desc(bookings.date))
  }

  async findByBarberAndDate(barberId: number, date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.barberId, barberId),
          gte(bookings.date, startOfDay),
          lte(bookings.date, endOfDay),
          sql`${bookings.status} != 'cancelled'`
        )
      )
      .orderBy(bookings.time)
  }

  async create(data: NewBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(data).returning()
    return result[0]
  }

  async update(id: string, data: Partial<NewBooking>): Promise<Booking | null> {
    const result = await db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning()
    return result[0] || null
  }

  async cancel(id: string): Promise<boolean> {
    const result = await db
      .update(bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning({ id: bookings.id })
    return result.length > 0
  }

  async markCompleted(id: string): Promise<boolean> {
    const result = await db
      .update(bookings)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning({ id: bookings.id })
    return result.length > 0
  }

  async markNoShow(id: string): Promise<boolean> {
    const result = await db
      .update(bookings)
      .set({ status: 'no_show', updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning({ id: bookings.id })
    return result.length > 0
  }

  async checkAvailability(barberId: number, date: Date, time: string, duration: number): Promise<boolean> {
    // Get existing bookings for this barber on this date
    const existingBookings = await this.findByBarberAndDate(barberId, date)

    const requestedStart = this.timeToMinutes(time)
    const requestedEnd = requestedStart + duration

    // Check for conflicts
    for (const booking of existingBookings) {
      const bookingStart = this.timeToMinutes(booking.time)
      const bookingEnd = bookingStart + booking.duration

      // Check if time slots overlap
      if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
        return false // Conflict found
      }
    }

    return true // No conflicts
  }

  async getAvailableSlots(barberId: number, date: Date, serviceId: number): Promise<string[]> {
    // Get service duration
    const service = await db.select().from(services).where(eq(services.id, serviceId))
    if (!service[0]) return []

    const duration = service[0].duration

    // Generate time slots (9 AM to 7 PM, 30-minute intervals)
    const slots: string[] = []
    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        if (await this.checkAvailability(barberId, date, time, duration)) {
          slots.push(time)
        }
      }
    }

    return slots
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}

export const bookingRepository = new BookingRepository()
