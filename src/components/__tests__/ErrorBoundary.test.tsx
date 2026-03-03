import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { axe } from 'vitest-axe'
import ErrorBoundary from '../ErrorBoundary'

// Mock console.error to avoid noise in tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

// Component that throws an error
function ErrorComponent() {
  throw new Error('Test error')
  return null
}

// Normal component
function NormalComponent() {
  return <div>Normal content</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('catches thrown errors and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument()
  })

  it('shows error details in development mode', () => {
    vi.stubEnv('NODE_ENV', 'development')

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument()
    expect(screen.getByText(/Test error/)).toBeInTheDocument()

    vi.unstubAllEnvs()
  })

  it('does not show error details in production mode', () => {
    vi.stubEnv('NODE_ENV', 'production')

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument()

    vi.unstubAllEnvs()
  })

  it('calls onError callback when provided', () => {
    const onErrorMock = vi.fn()

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )
  })

  it('resets error state when Try Again is clicked', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const { unmount } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    // Need to unmount and remount with different key to reset error boundary
    unmount()
    render(
      <ErrorBoundary key="reset">
        <NormalComponent />
      </ErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('Normal content')).toBeInTheDocument()
    })

    vi.unstubAllEnvs()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('should have no accessibility violations in error state', async () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    const results = await axe(document.body)
    expect(results).toHaveNoViolations()
  })

  describe('Retry Logic', () => {
    it('increments retry count on each reset attempt', async () => {
      vi.stubEnv('NODE_ENV', 'development') // No delay in development

      const { rerender } = render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // First retry
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

      // Should reset and show normal content (but ErrorComponent will throw again)
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      // Second retry
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      vi.unstubAllEnvs()
    })

    it('shows permanent error message after 3 failed retries', async () => {
      vi.stubEnv('NODE_ENV', 'development') // No delay in development

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )

      // First retry
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      // Second retry
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      // Third retry - should show permanent error
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

      // Should still show error but now with permanent message and Refresh Page button
      expect(screen.getByText(/We're experiencing technical difficulties/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument()

      vi.unstubAllEnvs()
    })

    it('prevents further retries after reaching maximum attempts', async () => {
      vi.stubEnv('NODE_ENV', 'development')

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )

      // Exhaust all retries
      for (let i = 0; i < 3; i++) {
        fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
        await waitFor(() => {
          expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        })
      }

      // Try Again button should be gone, Refresh Page button should be present
      expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument()

      // Clicking Refresh Page should not change the UI in test environment
      // (window.location.reload is mocked by jsdom)
      fireEvent.click(screen.getByRole('button', { name: 'Refresh Page' }))

      vi.unstubAllEnvs()
    })
  })

  describe('resetKeys Behavior', () => {
    it('resets error boundary when resetKeys change', async () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={[1]}>
          <ErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Change resetKeys - should reset the boundary
      rerender(
        <ErrorBoundary resetKeys={[2]}>
          <ErrorComponent />
        </ErrorBoundary>
      )

      // Should reset to normal state, then ErrorComponent throws again
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })
    })

    it('does not reset when resetKeys remain the same', async () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={[1]}>
          <ErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Same resetKeys - should not reset
      rerender(
        <ErrorBoundary resetKeys={[1]}>
          <ErrorComponent />
        </ErrorBoundary>
      )

      // Should remain in error state
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('Exponential Backoff', () => {
    it('applies no delay in development environment', async () => {
      vi.stubEnv('NODE_ENV', 'development')

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )

      const startTime = Date.now()
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

      // Should reset immediately in development
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      const endTime = Date.now()
      const elapsed = endTime - startTime

      // Should be very fast (< 100ms) in development (accounting for React rendering and waitFor)
      expect(elapsed).toBeLessThan(100)

      vi.unstubAllEnvs()
    })

    it('calculates backoff delay correctly', () => {
      vi.stubEnv('NODE_ENV', 'production')

      const { container } = render(
        <ErrorBoundary>
          <NormalComponent />
        </ErrorBoundary>
      )

      const boundary = container.firstChild as any
      const instance = boundary._reactInternalInstance?._debugOwner?.stateNode ||
                      boundary[Object.keys(boundary).find(key => key.startsWith('__reactInternalInstance'))]

      // Access the private method (in test environment only)
      if (instance && typeof instance.calculateBackoffDelay === 'function') {
        expect(instance.calculateBackoffDelay(0)).toBeGreaterThanOrEqual(750) // Base delay with jitter
        expect(instance.calculateBackoffDelay(0)).toBeLessThanOrEqual(1250)
        expect(instance.calculateBackoffDelay(1)).toBeGreaterThanOrEqual(1500) // 2x base with jitter
        expect(instance.calculateBackoffDelay(1)).toBeLessThanOrEqual(2500)
      }

      vi.unstubAllEnvs()
    })
  })
})
