// src/lib/repositories/service-repository.ts
import { db } from '../db'
import { services } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import type { Service, NewService } from '../db/schema'

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.isActive, true)).orderBy(services.name)
  }

  async findById(id: number): Promise<Service | null> {
    const result = await db.select().from(services).where(and(eq(services.id, id), eq(services.isActive, true)))
    return result[0] || null
  }

  async create(data: NewService): Promise<Service> {
    const result = await db.insert(services).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewService>): Promise<Service | null> {
    const result = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning()
    return result[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .update(services)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning({ id: services.id })
    return result.length > 0
  }
}

export const serviceRepository = new ServiceRepository()
