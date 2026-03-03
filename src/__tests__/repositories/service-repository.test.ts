// src/__tests__/repositories/service-repository.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { serviceRepository } from '../../lib/repositories/service-repository'
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

describe('ServiceRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return all active services', async () => {
      const mockServices = [
        { id: 1, name: 'Haircut', description: 'Basic haircut', duration: 30, price: '25.00', isActive: true },
        { id: 2, name: 'Shave', description: 'Hot towel shave', duration: 45, price: '35.00', isActive: true },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockServices),
          }),
        }),
      })

      db.select = mockSelect

      const result = await serviceRepository.findAll()
      expect(result).toEqual(mockServices)
      expect(mockSelect).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('should return service by id if active', async () => {
      const mockService = { id: 1, name: 'Haircut', isActive: true }

      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockService]),
        }),
      })

      db.select = mockSelect

      const result = await serviceRepository.findById(1)
      expect(result).toEqual(mockService)
    })

    it('should return null if service not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      })

      db.select = mockSelect

      const result = await serviceRepository.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new service', async () => {
      const newService = {
        name: 'Beard Trim',
        description: 'Professional beard trimming',
        duration: 20,
        price: '15.00',
      }
      const createdService = { id: 3, ...newService, isActive: true }

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdService]),
        }),
      })

      db.insert = mockInsert

      const result = await serviceRepository.create(newService)
      expect(result).toEqual(createdService)
      expect(mockInsert).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update service and return updated record', async () => {
      const updatedService = { id: 1, name: 'Updated Haircut', price: '30.00' }

      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedService]),
          }),
        }),
      })

      db.update = mockUpdate

      const result = await serviceRepository.update(1, { name: 'Updated Haircut', price: '30.00' })
      expect(result).toEqual(updatedService)
    })
  })

  describe('delete', () => {
    it('should soft delete service', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      })

      db.update = mockUpdate

      const result = await serviceRepository.delete(1)
      expect(result).toBe(true)
    })
  })
})
