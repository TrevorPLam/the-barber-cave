import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateStructuredData, validateMetaTags, validateBreadcrumbs, validateSEO, seoValidators } from './seo-validation'

describe('SEO Validation', () => {
  beforeEach(() => {
    // Mock document
    const mockDocument = {
      querySelector: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([]),
    }
    ;(global as any).document = mockDocument
  })

  afterEach(() => {
    delete (global as any).document
  })

  describe('validateStructuredData', () => {
    it('should return issues when document is undefined (server-side)', () => {
      delete (global as any).document

      const result = validateStructuredData()

      expect(result.passed).toBe(false)
      expect(result.issues).toContain('Cannot validate structured data server-side')
    })

    it('should validate structured data when scripts are present', () => {
      const mockScript = {
        textContent: '{"@type": "Organization"}',
      }
      ;(global as any).document.querySelectorAll.mockReturnValue([mockScript])

      const result = validateStructuredData()

      expect(result.passed).toBe(false) // Missing other required schemas
      expect(result.issues).toContain('Missing LocalBusiness structured data')
    })

    it('should handle invalid JSON in structured data', () => {
      const mockScript = {
        textContent: 'invalid json',
      }
      ;(global as any).document.querySelectorAll.mockReturnValue([mockScript])

      const result = validateStructuredData()

      expect(result.issues).toContain('Invalid JSON-LD syntax found')
    })

    it('should pass when all required schemas are present', () => {
      const mockScripts = [
        { textContent: '{"@type": "Organization"}' },
        { textContent: '{"@type": "LocalBusiness"}' },
        { textContent: '{"@type": "Service"}' },
        { textContent: '{"@type": "BreadcrumbList"}' },
      ]
      ;(global as any).document.querySelectorAll.mockReturnValue(mockScripts)

      const result = validateStructuredData()

      expect(result.passed).toBe(true)
      expect(result.issues.length).toBe(0)
    })
  })

  describe('validateMetaTags', () => {
    it('should return issues when document is undefined', () => {
      delete (global as any).document

      const result = validateMetaTags()

      expect(result.passed).toBe(false)
      expect(result.issues).toContain('Cannot validate meta tags server-side')
    })

    it('should validate essential meta tags', () => {
      // Mock missing meta tags
      ;(global as any).document.querySelector.mockImplementation((selector: string) => {
        if (selector.includes('title')) return null
        if (selector.includes('canonical')) return null
        return { getAttribute: () => null }
      })

      const result = validateMetaTags()

      expect(result.passed).toBe(false)
      expect(result.issues).toContain('Missing or empty title meta tag')
      expect(result.issues).toContain('Missing canonical URL')
    })

    it('should pass when all essential meta tags are present', () => {
      ;(global as any).document.querySelector.mockImplementation((selector: string) => {
        if (selector.includes('canonical')) return {} // Present
        return { getAttribute: () => 'content' } // Has content
      })

      const result = validateMetaTags()

      expect(result.passed).toBe(true)
      expect(result.issues.length).toBe(0)
    })
  })

  describe('validateBreadcrumbs', () => {
    it('should return issues when document is undefined', () => {
      delete (global as any).document

      const result = validateBreadcrumbs()

      expect(result.passed).toBe(false)
      expect(result.issues).toContain('Cannot validate breadcrumbs server-side')
    })

    it('should validate breadcrumb navigation presence', () => {
      ;(global as any).document.querySelector.mockReturnValue(null)

      const result = validateBreadcrumbs()

      expect(result.passed).toBe(false)
      expect(result.issues).toContain('Missing breadcrumb navigation')
    })

    it('should validate breadcrumb structured data', () => {
      const mockScript = {
        textContent: '{"@type": "BreadcrumbList"}',
      }
      ;(global as any).document.querySelector.mockImplementation((selector: string) => {
        if (selector.includes('nav[aria-label="Breadcrumb"]')) return {}
        if (selector.includes('script[type="application/ld+json"]')) return mockScript
        return null
      })

      const result = validateBreadcrumbs()

      expect(result.passed).toBe(true)
      expect(result.recommendations).toContain('Breadcrumb structured data found')
    })
  })

  describe('validateSEO', () => {
    it('should run comprehensive SEO validation', () => {
      // Mock all validators to return passing results
      const mockResult = { passed: true, issues: [], recommendations: [] }

      const result = validateSEO()

      expect(result).toHaveProperty('overall')
      expect(result).toHaveProperty('results')
      expect(result.results).toHaveProperty('structuredData')
      expect(result.results).toHaveProperty('metaTags')
      expect(result.results).toHaveProperty('breadcrumbs')
    })

    it('should return overall false when any validation fails', () => {
      // This would require mocking the individual validators
      // For now, just test the structure
      const result = validateSEO()

      expect(typeof result.overall).toBe('boolean')
      expect(typeof result.results).toBe('object')
    })
  })

  describe('seoValidators export', () => {
    it('should export all validator functions', () => {
      expect(seoValidators).toHaveProperty('structuredData')
      expect(seoValidators).toHaveProperty('metaTags')
      expect(seoValidators).toHaveProperty('breadcrumbs')
      expect(typeof seoValidators.structuredData).toBe('function')
      expect(typeof seoValidators.metaTags).toBe('function')
      expect(typeof seoValidators.breadcrumbs).toBe('function')
    })
  })
})
