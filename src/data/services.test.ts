import { describe, it, expect } from 'vitest'
import { services } from './services'

describe('Services Data', () => {
  it('should export a services array', () => {
    expect(Array.isArray(services)).toBe(true)
    expect(services.length).toBe(28)
  })

  it('should have unique IDs for all services', () => {
    const ids = services.map(service => service.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have required fields for each service', () => {
    services.forEach(service => {
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('title')
      expect(service).toHaveProperty('description')
      expect(service).toHaveProperty('price')
      expect(service).toHaveProperty('duration')
      expect(service).toHaveProperty('icon')
    })
  })

  it('should have non-empty string values for all required fields', () => {
    services.forEach(service => {
      expect(typeof service.id).toBe('string')
      expect(service.id.length).toBeGreaterThan(0)
      
      expect(typeof service.title).toBe('string')
      expect(service.title.length).toBeGreaterThan(0)
      
      expect(typeof service.description).toBe('string')
      expect(service.description.length).toBeGreaterThan(0)
      
      expect(typeof service.price).toBe('string')
      expect(service.price.length).toBeGreaterThan(0)
      
      expect(typeof service.duration).toBe('string')
      expect(service.duration.length).toBeGreaterThan(0)
      
      expect(typeof service.icon).toBe('string')
      expect(service.icon.length).toBeGreaterThan(0)
    })
  })

  it('should have valid price formats', () => {
    services.forEach(service => {
      // Prices should be either "$X" or "$X-$Y" or "$X+" format
      expect(service.price).toMatch(/^\$[0-9]+(\-[0-9]+|\+)?$/)
    })
  })

  it('should have valid duration formats', () => {
    services.forEach(service => {
      // Durations should contain numbers and time units
      expect(service.duration).toMatch(/[0-9]+/)
      expect(service.duration.toLowerCase()).toMatch(/(min|hour|hr)/)
    })
  })

  it('should have valid icon names', () => {
    const validIcons = [
      'Crown', 'Scissors', 'Star', 'Users', 'Award', 'Zap', 'Sparkles', 'Gem',
      'Heart', 'Target', 'Move', 'Smile', 'Flower', 'Diamond', 'Sun', 'Moon',
      'RefreshCw', 'Wind', 'Droplet', 'Link', 'Plus', 'RotateCcw', 'ChevronRight'
    ]

    services.forEach(service => {
      expect(validIcons).toContain(service.icon)
    })
  })

  it('should not have duplicate titles', () => {
    const titles = services.map(service => service.title)
    const uniqueTitles = new Set(titles)
    expect(uniqueTitles.size).toBe(titles.length)
  })

  it('should contain the new client special service', () => {
    const newClientSpecial = services.find(service => service.id === 'new-client-special')
    expect(newClientSpecial).toBeDefined()
    expect(newClientSpecial?.title).toBe('New Client Special $10 Off')
    expect(newClientSpecial?.price).toBe('$10 OFF')
  })

  it('should have proper service categorization based on titles', () => {
    const haircutServices = services.filter(service => 
      service.title.toLowerCase().includes('haircut') || 
      service.title.toLowerCase().includes('cut')
    )
    expect(haircutServices.length).toBeGreaterThan(0)

    const beardServices = services.filter(service => 
      service.title.toLowerCase().includes('beard')
    )
    expect(beardServices.length).toBeGreaterThan(0)
  })
})
