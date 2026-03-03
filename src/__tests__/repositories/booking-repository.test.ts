// src/__tests__/repositories/booking-repository.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { bookingRepository } from '../../lib/repositories/booking-repository'
import { db } from '../../lib/db'

// Mock the database
vi.mock('../../lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    from: vi.fn(),
  },
}))

describe('BookingRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findById', () => {
    it('should return booking by id', async () => {
      const mockBooking = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        serviceId: 1,
        barberId: 1,
        date: new Date('2026-03-15'),
        time: '10:00',
        status: 'confirmed',
      }

      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockBooking]),
        }),
      })

      db.select = mockSelect

      const result = await bookingRepository.findById(mockBooking.id)
      expect(result).toEqual(mockBooking)
    })
  })

  describe('create', () => {
    it('should create a new booking', async () => {
      const newBooking = {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '555-0123',
        serviceId: 1,
        barberId: 2,
        date: new Date('2026-03-16'),
        time: '14:00',
        duration: 45,
        price: '35.00',
      }
      const createdBooking = { id: '456e7890-e89b-12d3-a456-426614174001', ...newBooking, status: 'confirmed' }

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdBooking]),
        }),
      })

      db.insert = mockInsert

      const result = await bookingRepository.create(newBooking)
      expect(result).toEqual(createdBooking)
    })
  })

  describe('checkAvailability', () => {
    it('should return true when slot is available', async () => {
      // Mock empty bookings for the date
      vi.spyOn(bookingRepository, 'findByBarberAndDate').mockResolvedValue([])

      const result = await bookingRepository.checkAvailability(1, new Date('2026-03-15'), '10:00', 30)
      expect(result).toBe(true)
    })

    it('should return false when slot conflicts', async () => {
      // Mock existing booking that conflicts
      const existingBooking = {
        id: '123',
        time: '10:00',
        duration: 30,
      }
      vi.spyOn(bookingRepository, 'findByBarberAndDate').mockResolvedValue([existingBooking])

      const result = await bookingRepository.checkAvailability(1, new Date('2026-03-15'), '10:15', 30)
      expect(result).toBe(false)
    })
  })

  describe('cancel', () => {
    it('should cancel booking and return true', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: '123' }]),
          }),
        }),
      })

      db.update = mockUpdate

      const result = await bookingRepository.cancel('123')
      expect(result).toBe(true)
    })
  })
})
