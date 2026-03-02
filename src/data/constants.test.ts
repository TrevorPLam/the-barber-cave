import { describe, it, expect } from 'vitest'
import { SITE_URL, BUSINESS_INFO, EXTERNAL_LINKS, NAVIGATION_ITEMS } from './constants'

describe('Constants', () => {
  describe('SITE_URL', () => {
    it('should be a valid URL string', () => {
      expect(SITE_URL).toBe('https://the-barber-cave.vercel.app')
      expect(typeof SITE_URL).toBe('string')
      expect(SITE_URL.startsWith('https://')).toBe(true)
    })
  })

  describe('BUSINESS_INFO', () => {
    it('should contain all required business information fields', () => {
      expect(BUSINESS_INFO).toHaveProperty('name')
      expect(BUSINESS_INFO).toHaveProperty('tagline')
      expect(BUSINESS_INFO).toHaveProperty('description')
      expect(BUSINESS_INFO).toHaveProperty('location')
      expect(BUSINESS_INFO).toHaveProperty('fullLocation')
      expect(BUSINESS_INFO).toHaveProperty('address')
      expect(BUSINESS_INFO).toHaveProperty('phone')
      expect(BUSINESS_INFO).toHaveProperty('rating')
      expect(BUSINESS_INFO).toHaveProperty('totalReviews')
      expect(BUSINESS_INFO).toHaveProperty('totalBarbers')
      expect(BUSINESS_INFO).toHaveProperty('totalServices')
      expect(BUSINESS_INFO).toHaveProperty('newClientDiscount')
      expect(BUSINESS_INFO).toHaveProperty('coordinates')
    })

    it('should have non-empty string values for all fields', () => {
      Object.entries(BUSINESS_INFO).forEach(([key, value]) => {
        if (key === 'coordinates') {
          const coords = value as { latitude: string; longitude: string }
          expect(coords).toHaveProperty('latitude')
          expect(coords).toHaveProperty('longitude')
          expect(typeof coords.latitude).toBe('string')
          expect(typeof coords.longitude).toBe('string')
        } else {
          expect(typeof value).toBe('string')
          expect((value as string).length).toBeGreaterThan(0)
        }
      })
    })

    it('should have valid rating and numeric fields', () => {
      expect(BUSINESS_INFO.rating).toMatch(/^\d+(\.\d+)?$/)
      expect(BUSINESS_INFO.totalReviews).toMatch(/^\d+$/)
      expect(BUSINESS_INFO.totalBarbers).toMatch(/^\d+$/)
      expect(BUSINESS_INFO.totalServices).toMatch(/^\d+$/)
    })
  })

  describe('EXTERNAL_LINKS', () => {
    it('should contain all required external link fields', () => {
      expect(EXTERNAL_LINKS).toHaveProperty('booking')
      expect(EXTERNAL_LINKS).toHaveProperty('services')
      expect(EXTERNAL_LINKS).toHaveProperty('instagram')
      expect(EXTERNAL_LINKS).toHaveProperty('facebook')
      expect(EXTERNAL_LINKS).toHaveProperty('youtube')
    })

    it('should have valid URLs for all external links', () => {
      Object.values(EXTERNAL_LINKS).forEach((url: string) => {
        expect(typeof url).toBe('string')
        expect(url.length).toBeGreaterThan(0)
        expect(url.startsWith('http')).toBe(true)
      })
    })

    it('should have proper social media URLs', () => {
      expect(EXTERNAL_LINKS.instagram).toContain('instagram.com')
      expect(EXTERNAL_LINKS.facebook).toContain('facebook.com')
      expect(EXTERNAL_LINKS.youtube).toContain('youtube.com')
    })
  })

  describe('NAVIGATION_ITEMS', () => {
    it('should be an array of navigation items', () => {
      expect(Array.isArray(NAVIGATION_ITEMS)).toBe(true)
      expect(NAVIGATION_ITEMS.length).toBeGreaterThan(0)
    })

    it('should have proper structure for each navigation item', () => {
      NAVIGATION_ITEMS.forEach((item: { readonly href: string; readonly label: string }) => {
        expect(item).toHaveProperty('href')
        expect(item).toHaveProperty('label')
        expect(typeof item.href).toBe('string')
        expect(typeof item.label).toBe('string')
        expect(item.href.length).toBeGreaterThan(0)
        expect(item.label.length).toBeGreaterThan(0)
      })
    })

    it('should have valid href values', () => {
      NAVIGATION_ITEMS.forEach((item: { readonly href: string; readonly label: string }) => {
        expect(item.href.startsWith('#') || item.href.startsWith('/')).toBe(true)
      })
    })
  })
})
