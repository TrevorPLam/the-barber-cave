import { describe, it, expect } from 'vitest'
import { getBarbersData } from './cached-barbers'

describe('getBarbersData', () => {
  it('should return the barbers data', async () => {
    const result = await getBarbersData()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    
    // Check structure of first barber
    const firstBarber = result[0]
    expect(firstBarber).toHaveProperty('id')
    expect(firstBarber).toHaveProperty('name')
    expect(firstBarber).toHaveProperty('title')
    expect(firstBarber).toHaveProperty('rating')
    expect(firstBarber).toHaveProperty('reviews')
    expect(firstBarber).toHaveProperty('available')
  })

  it('should return consistent data on multiple calls', async () => {
    const result1 = await getBarbersData()
    const result2 = await getBarbersData()
    
    expect(result1).toEqual(result2)
    expect(result1.length).toBe(result2.length)
  })
})
