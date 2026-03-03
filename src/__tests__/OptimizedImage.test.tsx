// src/__tests__/OptimizedImage.test.tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import OptimizedImage from '@/components/OptimizedImage'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, onLoad, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
      {...props}
      data-testid="next-image"
    />
  )
}))

describe('OptimizedImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image'
  }

  it('renders with correct props', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test image')
  })

  it('shows loading state initially', () => {
    render(<OptimizedImage {...defaultProps} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('hides loading state after image loads', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    // Simulate load event
    image.dispatchEvent(new Event('load'))

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('shows fallback on error', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    // Simulate error event
    image.dispatchEvent(new Event('error'))

    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Failed to load image: Test image')
  })

  it('applies priority loading for LCP elements', () => {
    render(<OptimizedImage {...defaultProps} priority />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('priority')
  })

  it('supports fill mode', () => {
    render(<OptimizedImage {...defaultProps} fill />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('fill')
  })

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />)

    const container = screen.getByTestId('next-image').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('uses default quality of 85', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('quality', '85')
  })

  it('allows custom quality', () => {
    render(<OptimizedImage {...defaultProps} quality={90} />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('quality', '90')
  })
})
