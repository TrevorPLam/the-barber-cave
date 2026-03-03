// src/__tests__/hooks/hook-lifecycle.test.ts
import { renderHook, act, cleanup } from '@testing-library/react'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { useCSRF } from '@/hooks/useCSRF'
import { useAnnouncement } from '@/hooks/useAnnouncement'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useBooking } from '@/hooks/useBooking'

// Mock fetch for useCSRF
global.fetch = vi.fn()

// Parameterized cleanup matrix — each hook tested for memory safety
const hooksUnderTest = [
  {
    name: 'useCSRF',
    factory: () => renderHook(() => useCSRF()),
    expectsCleanup: true, // AbortController
  },
  {
    name: 'useAnnouncement',
    factory: () => renderHook(() => useAnnouncement()),
    expectsCleanup: true, // DOM element removal
  },
  {
    name: 'useLocalStorage',
    factory: () => renderHook(() => useLocalStorage('test-key', null)),
    expectsCleanup: true, // event listener removal
  },
]

describe.each(hooksUnderTest)('$name — lifecycle safety', ({ factory }) => {
  beforeEach(() => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ csrfToken: 'test-token' }),
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('mounts and unmounts without throwing', () => {
    const { unmount } = factory()
    expect(() => unmount()).not.toThrow()
  })

  it('does not leak DOM nodes after unmount', () => {
    // Flush any previous renderHook containers from prior tests
    cleanup()
    const nodesBefore = document.body.childNodes.length
    const { unmount } = factory()
    unmount()
    // Force RTL to remove its container so we only count hook-added nodes
    cleanup()
    expect(document.body.childNodes.length).toBe(nodesBefore)
  })
})

describe('useBooking — stale closure immunity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submitBooking uses current state not stale closure', async () => {
    const { result } = renderHook(() => useBooking())

    act(() => result.current.selectService('service-1'))
    act(() => result.current.selectBarber('barber-1'))
    // Rapidly update state to trigger stale closure scenario
    act(() => result.current.selectService('service-2'))

    // submitBooking should use service-2, not the stale service-1
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    await act(async () => {
      result.current.selectDate(new Date('2026-03-15'))
      result.current.selectTime('14:00')
      result.current.setCustomerInfo({ name: 'Test', email: 'test@example.com', phone: '555-0000' })
    })

    await act(async () => {
      await result.current.submitBooking()
    })

    const body = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body)
    expect(body.serviceId).toBe('service-2') // not stale 'service-1'
  })
})

describe('useLocalStorage — cross-tab race condition', () => {
  it('ignores storage events that match current value', () => {
    const { result } = renderHook(() => useLocalStorage('tab-key', 'initial'))

    // Simulate storage event with same value
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tab-key',
        newValue: JSON.stringify('initial'),
      }))
    })

    // Should not cause unnecessary re-render (value stays the same)
    expect(result.current[0]).toBe('initial')
  })

  it('handles key removal in another tab', () => {
    const { result } = renderHook(() => useLocalStorage('remove-key', 'default'))

    // Set a value first
    act(() => result.current[1]('changed'))
    expect(result.current[0]).toBe('changed')

    // Simulate key removal in another tab
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'remove-key',
        newValue: null,
      }))
    })

    // Should reset to initialValue when key is removed
    expect(result.current[0]).toBe('default')
  })
})
