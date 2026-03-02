import { describe, it, expect } from 'vitest'
import { getServicesData } from './cached-services'

describe('getServicesData', () => {
  it('should return the services data array', async () => {
    const result = await getServicesData()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(28)
    
    // Check structure of first service
    const firstService = result[0]
    expect(firstService).toHaveProperty('id')
    expect(firstService).toHaveProperty('title')
    expect(firstService).toHaveProperty('description')
    expect(firstService).toHaveProperty('price')
    expect(firstService).toHaveProperty('duration')
    expect(firstService).toHaveProperty('icon')
  })

  it('should return consistent data on multiple calls', async () => {
    const result1 = await getServicesData()
    const result2 = await getServicesData()
    
    expect(result1).toEqual(result2)
    expect(result1.length).toBe(result2.length)
  })

  it('should contain the new client special service', async () => {
    const result = await getServicesData()
    
    const specialService = result.find(service => service.id === 'new-client-special')
    expect(specialService).toBeDefined()
    expect(specialService?.title).toBe('New Client Special $10 Off')
  })
})
