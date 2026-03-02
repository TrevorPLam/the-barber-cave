import { describe, it, expect } from 'vitest'
import { barbers } from './barbers'

describe('Barbers Data', () => {
  it('should export a barbers array', () => {
    expect(Array.isArray(barbers)).toBe(true)
    expect(barbers.length).toBe(8)
  })

  it('should have unique IDs for all barbers', () => {
    const ids = barbers.map(barber => barber.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have required fields for each barber', () => {
    barbers.forEach(barber => {
      expect(barber).toHaveProperty('id')
      expect(barber).toHaveProperty('name')
      expect(barber).toHaveProperty('title')
      expect(barber).toHaveProperty('rating')
      expect(barber).toHaveProperty('reviews')
      expect(barber).toHaveProperty('available')
    })
  })

  it('should have non-empty string values for all required fields', () => {
    barbers.forEach(barber => {
      expect(typeof barber.id).toBe('string')
      expect(barber.id.length).toBeGreaterThan(0)
      
      expect(typeof barber.name).toBe('string')
      expect(barber.name.length).toBeGreaterThan(0)
      
      expect(typeof barber.title).toBe('string')
      expect(barber.title.length).toBeGreaterThan(0)
      
      expect(typeof barber.rating).toBe('string')
      expect(barber.rating.length).toBeGreaterThan(0)
      
      expect(typeof barber.reviews).toBe('string')
      expect(barber.reviews.length).toBeGreaterThan(0)
      
      expect(typeof barber.available).toBe('string')
      expect(barber.available.length).toBeGreaterThan(0)
    })
  })

  it('should have valid rating formats', () => {
    barbers.forEach(barber => {
      // Ratings should be numeric OR 'No ratings' for new barbers
      if (barber.rating !== 'No ratings') {
        expect(barber.rating).toMatch(/^\d+(\.\d+)?$/)
        const rating = parseFloat(barber.rating)
        expect(rating).toBeGreaterThanOrEqual(0)
        expect(rating).toBeLessThanOrEqual(5)
      }
    })
  })

  it('should have valid review counts', () => {
    barbers.forEach(barber => {
      expect(barber.reviews).toMatch(/^\d+$/)
      const reviews = parseInt(barber.reviews)
      expect(reviews).toBeGreaterThanOrEqual(0)
    })
  })

  it('should have valid availability statuses', () => {
    barbers.forEach(barber => {
      expect(['Tomorrow', 'Today', 'Available', 'Booked', 'Available Friday'].includes(barber.available)).toBe(true)
    })
  })

  it('should have valid barber titles', () => {
    const validTitles = ['Master Barber', 'Senior Barber', 'Expert Barber', 'Fade Specialist', 'Blend Specialist', 'Loc Specialist', 'VIP Specialist']
    
    barbers.forEach(barber => {
      expect(validTitles).toContain(barber.title)
    })
  })

  it('should not have duplicate names', () => {
    const names = barbers.map(barber => barber.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(names.length)
  })

  it('should contain expected barber profiles', () => {
    const barberNames = barbers.map(b => b.name)
    expect(barberNames).toContain('Trill L.')
    expect(barberNames).toContain('Charlo F.')
  })

  it('should have reasonable review counts for a barber shop', () => {
    barbers.forEach(barber => {
      const reviews = parseInt(barber.reviews)
      expect(reviews).toBeGreaterThanOrEqual(0) // Allow 0 for new barbers
      expect(reviews).toBeLessThan(1000) // Reasonable upper bound
    })
  })
})
