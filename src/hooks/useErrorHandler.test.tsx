import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useErrorHandler } from './useErrorHandler'

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('useErrorHandler', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear()
  })

  it('should return initial error state', () => {
    const { result } = renderHook(() => useErrorHandler())

    expect(result.current.error).toBeNull()
    expect(result.current.isError).toBe(false)
    expect(typeof result.current.handleError).toBe('function')
    expect(typeof result.current.resetError).toBe('function')
    expect(typeof result.current.handleAsyncError).toBe('function')
  })

  it('should handle error correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    const testError = new Error('Test error message')

    act(() => {
      result.current.handleError(testError)
    })

    expect(result.current.error).toBe(testError)
    expect(result.current.isError).toBe(true)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught by useErrorHandler:', testError)
  })

  it('should reset error state', () => {
    const { result } = renderHook(() => useErrorHandler())
    const testError = new Error('Test error')

    act(() => {
      result.current.handleError(testError)
    })

    expect(result.current.isError).toBe(true)

    act(() => {
      result.current.resetError()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isError).toBe(false)
  })

  it('should handle async errors correctly', async () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const failingAsyncFn = async () => {
      throw new Error('Async error')
    }

    let returnValue: string | null = 'initial'
    
    await act(async () => {
      returnValue = await result.current.handleAsyncError(failingAsyncFn)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Async error')
    expect(returnValue).toBeNull()
  })

  it('should return successful async result', async () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const successfulAsyncFn = async () => {
      return 'success'
    }

    let returnValue: string | null = null
    
    await act(async () => {
      returnValue = await result.current.handleAsyncError(successfulAsyncFn)
    })

    expect(result.current.isError).toBe(false)
    expect(result.current.error).toBeNull()
    expect(returnValue).toBe('success')
  })

  it('should convert non-Error throws to Error objects', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleError('string error' as any)
    })

    expect(result.current.error?.message).toBe('string error')
    expect(result.current.isError).toBe(true)
  })

  it('should handle multiple error calls', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const error1 = new Error('First error')
    const error2 = new Error('Second error')

    act(() => {
      result.current.handleError(error1)
    })

    expect(result.current.error).toBe(error1)

    act(() => {
      result.current.handleError(error2)
    })

    expect(result.current.error).toBe(error2)
  })

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useErrorHandler())
    
    const initialHandleError = result.current.handleError
    const initialResetError = result.current.resetError
    const initialHandleAsyncError = result.current.handleAsyncError

    rerender()

    expect(result.current.handleError).toBe(initialHandleError)
    expect(result.current.resetError).toBe(initialResetError)
    expect(result.current.handleAsyncError).toBe(initialHandleAsyncError)
  })
})
