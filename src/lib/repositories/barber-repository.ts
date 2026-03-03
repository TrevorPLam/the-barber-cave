// src/lib/repositories/barber-repository.ts
import { db } from '../db'
import { barbers } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import type { Barber, NewBarber } from '../db/schema'

export class BarberRepository {
  async findAll(): Promise<Barber[]> {
    return db.select().from(barbers).where(eq(barbers.isActive, true)).orderBy(barbers.name)
  }

  async findById(id: number): Promise<Barber | null> {
    const result = await db.select().from(barbers).where(and(eq(barbers.id, id), eq(barbers.isActive, true)))
    return result[0] || null
  }

  async findByEmail(email: string): Promise<Barber | null> {
    const result = await db.select().from(barbers).where(and(eq(barbers.email, email), eq(barbers.isActive, true)))
    return result[0] || null
  }

  async create(data: NewBarber): Promise<Barber> {
    const result = await db.insert(barbers).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewBarber>): Promise<Barber | null> {
    const result = await db
      .update(barbers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(barbers.id, id))
      .returning()
    return result[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .update(barbers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(barbers.id, id))
      .returning({ id: barbers.id })
    return result.length > 0
  }
}

export const barberRepository = new BarberRepository()
