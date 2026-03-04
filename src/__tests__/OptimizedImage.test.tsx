// src/__tests__/OptimizedImage.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import OptimizedImage from '@/components/OptimizedImage'

// Mock Next.js Image component — expose boolean props as data attributes for testability
// (React filters unknown boolean props from DOM elements, so they won't appear as HTML attributes)
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, onLoad, priority, fill, quality, sizes, placeholder, blurDataURL, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
      data-priority={priority ? 'true' : undefined}
      data-fill={fill ? 'true' : undefined}
      data-quality={quality}
      data-sizes={sizes}
      data-placeholder={placeholder}
      className={className}
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

  it('hides loading state after image loads', async () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')

    // Wrap in act() to flush the React state update triggered by onLoad
    await act(async () => {
      fireEvent.load(image)
    })

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('shows fallback on error', async () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')

    // Wrap in act() to flush the React state update triggered by onError
    await act(async () => {
      fireEvent.error(image)
    })

    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Failed to load image: Test image')
  })

  it('applies priority loading for LCP elements', () => {
    render(<OptimizedImage {...defaultProps} priority />)

    const image = screen.getByTestId('next-image')
    // priority is a Next.js prop, not a standard HTML attribute — verified via data-priority
    expect(image).toHaveAttribute('data-priority', 'true')
  })

  it('does not apply priority when not set', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    expect(image).not.toHaveAttribute('data-priority')
  })

  it('supports fill mode', () => {
    render(<OptimizedImage {...defaultProps} fill />)

    const image = screen.getByTestId('next-image')
    // fill is a Next.js prop, not a standard HTML attribute — verified via data-fill
    expect(image).toHaveAttribute('data-fill', 'true')
  })

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />)

    const container = screen.getByTestId('next-image').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('uses default quality of 85', () => {
    render(<OptimizedImage {...defaultProps} />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('data-quality', '85')
  })

  it('allows custom quality', () => {
    render(<OptimizedImage {...defaultProps} quality={90} />)

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('data-quality', '90')
  })

  // T-K005: Alt text validation (WCAG 1.1.1 Non-text Content)
  describe('Alt Text Validation (WCAG 1.1.1)', () => {
    it('renders with descriptive alt text for informative images', () => {
      render(<OptimizedImage src="/barber.jpg" alt="Barber performing a fade haircut" />)

      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('alt', 'Barber performing a fade haircut')
      expect(image.getAttribute('alt')).not.toBe('')
    })

    it('supports empty alt text for decorative images', () => {
      render(<OptimizedImage src="/decoration.jpg" alt="" />)

      const image = screen.getByTestId('next-image')
      // Empty alt marks the image as decorative — correct for non-informative visuals
      expect(image).toHaveAttribute('alt', '')
    })

    it('fallback div carries descriptive aria-label matching the original alt text', async () => {
      render(<OptimizedImage src="/barber.jpg" alt="Barber shop interior" />)

      const image = screen.getByTestId('next-image')

      await act(async () => {
        fireEvent.error(image)
      })

      // The fallback element uses role="img" with an aria-label that mirrors the original alt
      const fallback = screen.getByRole('img')
      expect(fallback).toHaveAttribute('aria-label', 'Failed to load image: Barber shop interior')
    })

    it('alt text is present and non-empty for non-decorative images', () => {
      const descriptiveAlt = 'A classic haircut being performed by a master barber'
      render(<OptimizedImage src="/haircut.jpg" alt={descriptiveAlt} />)

      const image = screen.getByTestId('next-image')
      const altText = image.getAttribute('alt')

      expect(altText).toBeTruthy()
      expect(altText).toBe(descriptiveAlt)
    })
  })
})
