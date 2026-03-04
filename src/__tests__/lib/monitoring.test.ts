// src/__tests__/lib/monitoring.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  PerformanceMonitor,
  initPerformanceMonitor,
  getPerformanceMonitor,
  _resetMonitor,
} from '../../lib/monitoring'

// jsdom doesn't implement PerformanceObserver; define a minimal stub.
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

class MockPerformanceObserver {
  static supportedEntryTypes = ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input']
  private callback: (list: { getEntries: () => PerformanceEntry[] }) => void

  constructor(callback: (list: { getEntries: () => PerformanceEntry[] }) => void) {
    this.callback = callback
  }
  observe = mockObserve
  disconnect = mockDisconnect
}

Object.defineProperty(globalThis, 'PerformanceObserver', {
  value: MockPerformanceObserver,
  writable: true,
  configurable: true,
})

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    _resetMonitor()
  })

  afterEach(() => {
    _resetMonitor()
  })

  describe('startTimer / recordAPICall', () => {
    it('calls reporter with API metric', () => {
      const reporter = vi.fn()
      const monitor = new PerformanceMonitor({ reporter })

      const start = monitor.startTimer()
      monitor.recordAPICall('/api/services', start)

      expect(reporter).toHaveBeenCalledOnce()
      const metric = reporter.mock.calls[0][0]
      expect(metric.name).toBe('API')
      expect(metric.label).toBe('/api/services')
      expect(metric.value).toBeGreaterThanOrEqual(0)
      expect(metric.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('records non-negative duration', () => {
      const reporter = vi.fn()
      const monitor = new PerformanceMonitor({ reporter })
      const start = monitor.startTimer()
      monitor.recordAPICall('/api/barbers', start)
      expect(reporter.mock.calls[0][0].value).toBeGreaterThanOrEqual(0)
    })
  })

  describe('observe', () => {
    it('registers PerformanceObserver instances', () => {
      const monitor = new PerformanceMonitor({ reporter: vi.fn() })
      monitor.observe()
      expect(mockObserve).toHaveBeenCalled()
    })

    it('is a no-op in a non-browser context', () => {
      const original = globalThis.window
      // @ts-expect-error - simulating non-browser environment
      delete globalThis.window
      const monitor = new PerformanceMonitor()
      expect(() => monitor.observe()).not.toThrow()
      // @ts-expect-error
      globalThis.window = original
    })
  })

  describe('disconnect', () => {
    it('disconnects all observers', () => {
      const monitor = new PerformanceMonitor({ reporter: vi.fn() })
      monitor.observe()
      monitor.disconnect()
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('default reporter', () => {
    it('does not throw in production mode', () => {
      vi.stubEnv('NODE_ENV', 'production')
      const monitor = new PerformanceMonitor()
      expect(() => monitor.recordAPICall('/api/test', 0)).not.toThrow()
      vi.unstubAllEnvs()
    })
  })
})

describe('initPerformanceMonitor / getPerformanceMonitor / _resetMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    _resetMonitor()
  })

  afterEach(() => {
    _resetMonitor()
  })

  it('returns the same instance on repeated calls', () => {
    const m1 = initPerformanceMonitor({ reporter: vi.fn() })
    const m2 = initPerformanceMonitor({ reporter: vi.fn() })
    expect(m1).toBe(m2)
  })

  it('getPerformanceMonitor returns the initialized monitor', () => {
    const monitor = initPerformanceMonitor({ reporter: vi.fn() })
    expect(getPerformanceMonitor()).toBe(monitor)
  })

  it('getPerformanceMonitor throws when not initialized', () => {
    expect(() => getPerformanceMonitor()).toThrow('not initialized')
  })

  it('_resetMonitor allows re-initialization', () => {
    const m1 = initPerformanceMonitor({ reporter: vi.fn() })
    _resetMonitor()
    const m2 = initPerformanceMonitor({ reporter: vi.fn() })
    expect(m1).not.toBe(m2)
  })
})
