import { describe, it, expect } from 'vitest'
import { getBusinessInfo } from './cached-business'

describe('getBusinessInfo', () => {
  it('should return the business info object', async () => {
    const result = await getBusinessInfo()
    
    expect(typeof result).toBe('object')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('address')
    expect(result).toHaveProperty('phone')
    expect(result).toHaveProperty('rating')
  })

  it('should return consistent data on multiple calls', async () => {
    const result1 = await getBusinessInfo()
    const result2 = await getBusinessInfo()
    
    expect(result1).toEqual(result2)
  })

  it('should contain required business fields', async () => {
    const result = await getBusinessInfo()
    
    expect(result.name).toBe('The Barber Cave')
    expect(result.rating).toBe('4.9')
    expect(typeof result.phone).toBe('string')
    expect(result.phone.length).toBeGreaterThan(0)
  })
})
