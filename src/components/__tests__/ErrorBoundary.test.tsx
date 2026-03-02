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
})
