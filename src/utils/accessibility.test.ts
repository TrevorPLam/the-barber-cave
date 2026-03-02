import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reportAccessibility } from './accessibility'

// Mock React
const mockReact = {}
const mockReactDOM = {}
const mockAxe = { default: vi.fn() }

// Mock dynamic imports
vi.mock('@axe-core/react', () => ({ default: mockAxe.default }))
vi.mock('react-dom', () => mockReactDOM)

describe('reportAccessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global window
    delete (global as any).window
  })

  it('should not initialize axe when window is undefined (server-side)', async () => {
    // window is undefined by default in test environment
    
    await reportAccessibility(mockReact as any)
    
    expect(mockAxe.default).not.toHaveBeenCalled()
  })

  it('should not initialize axe in production environment', async () => {
    // Set up window
    ;(global as any).window = {}
    const originalEnv = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'

    await reportAccessibility(mockReact as any)
    
    expect(mockAxe.default).not.toHaveBeenCalled()
    
    ;(process.env as any).NODE_ENV = originalEnv
  })

  it('should initialize axe in development environment with window available', async () => {
    // Set up window
    ;(global as any).window = {}
    const originalEnv = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'

    const config = { rules: { 'color-contrast': { enabled: false } } }
    
    await reportAccessibility(mockReact as any, config)
    
    expect(mockAxe.default).toHaveBeenCalledWith(mockReact, mockReactDOM, 1000, config)
    
    ;(process.env as any).NODE_ENV = originalEnv
  })

  it('should initialize axe with default config when no config provided', async () => {
    // Set up window
    ;(global as any).window = {}
    const originalEnv = (process.env as any).NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'

    await reportAccessibility(mockReact as any)
    
    expect(mockAxe.default).toHaveBeenCalledWith(mockReact, mockReactDOM, 1000, undefined)
    
    ;(process.env as any).NODE_ENV = originalEnv
  })

  it('should handle axe import errors gracefully', async () => {
    // Set up window
    ;(global as any).window = {}
    const originalEnv = (process.env as any).NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'

    // Mock failed import
    vi.doMock('@axe-core/react', () => {
      throw new Error('Import failed')
    })

    // Should not throw, just silently fail
    await expect(reportAccessibility(mockReact as any)).resolves.not.toThrow()
    
    ;(process.env as any).NODE_ENV = originalEnv
  })
})
