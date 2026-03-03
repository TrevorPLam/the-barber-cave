// src/__tests__/useBooking.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBooking } from '@/hooks/useBooking'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useBooking Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useBooking())

    expect(result.current.selectedService).toBeNull()
    expect(result.current.selectedBarber).toBeNull()
    expect(result.current.selectedDate).toBeNull()
    expect(result.current.selectedTime).toBeNull()
    expect(result.current.customerInfo).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('selects service correctly', () => {
    const { result } = renderHook(() => useBooking())

    act(() => {
      result.current.selectService('service-123')
    })

    expect(result.current.selectedService).toBe('service-123')
    expect(result.current.error).toBeNull()
  })

  it('selects barber correctly', () => {
    const { result } = renderHook(() => useBooking())

    act(() => {
      result.current.selectBarber('barber-456')
    })

    expect(result.current.selectedBarber).toBe('barber-456')
    expect(result.current.error).toBeNull()
  })

  it('selects date correctly', () => {
    const { result } = renderHook(() => useBooking())
    const testDate = new Date('2026-03-15')

    act(() => {
      result.current.selectDate(testDate)
    })

    expect(result.current.selectedDate).toEqual(testDate)
    expect(result.current.error).toBeNull()
  })

  it('selects time correctly', () => {
    const { result } = renderHook(() => useBooking())

    act(() => {
      result.current.selectTime('14:30')
    })

    expect(result.current.selectedTime).toBe('14:30')
    expect(result.current.error).toBeNull()
  })

  it('sets customer info correctly', () => {
    const { result } = renderHook(() => useBooking())
    const customerInfo = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }

    act(() => {
      result.current.setCustomerInfo(customerInfo)
    })

    expect(result.current.customerInfo).toEqual(customerInfo)
    expect(result.current.error).toBeNull()
  })

  it('prevents submission when form is incomplete', async () => {
    const { result } = renderHook(() => useBooking())

    // Only set partial data
    act(() => {
      result.current.selectService('service-123')
    })

    await act(async () => {
      await result.current.submitBooking()
    })

    expect(result.current.error).toBe('Please complete all booking steps')
    expect(result.current.isSubmitting).toBe(false)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('submits booking successfully', async () => {
    const { result } = renderHook(() => useBooking())
    const mockResponse = { id: 'booking-789' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    // Set complete booking data
    act(() => {
      result.current.selectService('service-123')
      result.current.selectBarber('barber-456')
      result.current.selectDate(new Date('2026-03-15'))
      result.current.selectTime('14:30')
      result.current.setCustomerInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      })
    })

    await act(async () => {
      await result.current.submitBooking()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'service-123',
        barberId: 'barber-456',
        date: '2026-03-15T00:00:00.000Z', // ISO string
        time: '14:30',
        customerInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        }
      })
    })

    // Should reset form on success
    expect(result.current.selectedService).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles submission error', async () => {
    const { result } = renderHook(() => useBooking())

    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Set complete booking data
    act(() => {
      result.current.selectService('service-123')
      result.current.selectBarber('barber-456')
      result.current.selectDate(new Date('2026-03-15'))
      result.current.selectTime('14:30')
      result.current.setCustomerInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      })
    })

    await act(async () => {
      await result.current.submitBooking()
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('resets booking correctly', () => {
    const { result } = renderHook(() => useBooking())

    // Set some data
    act(() => {
      result.current.selectService('service-123')
      result.current.selectBarber('barber-456')
      result.current.setCustomerInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      })
    })

    // Reset
    act(() => {
      result.current.resetBooking()
    })

    expect(result.current.selectedService).toBeNull()
    expect(result.current.selectedBarber).toBeNull()
    expect(result.current.customerInfo).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('clears error correctly', () => {
    const { result } = renderHook(() => useBooking())

    // Set an error
    act(() => {
      result.current.selectService('service-123')
      result.current.submitBooking()
    })

    expect(result.current.error).toBe('Please complete all booking steps')

    // Clear error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })
})
