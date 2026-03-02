import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Hero from '../Hero'

// Mock the constants
vi.mock('@/data/constants', () => ({
  BUSINESS_INFO: {
    description: 'Experience the art of barbering at The Barber Cave.',
    rating: '4.9',
    totalReviews: '194',
    totalBarbers: '8',
    totalServices: '114'
  },
  EXTERNAL_LINKS: {
    booking: 'https://example.com/booking'
  }
}))

describe('Hero', () => {
  it('renders hero section with correct content', () => {
    render(<Hero />)
    
    expect(screen.getByText('Where Style Meets')).toBeInTheDocument()
    expect(screen.getByText('Excellence')).toBeInTheDocument()
    expect(screen.getByText('Experience the art of barbering at The Barber Cave.')).toBeInTheDocument()
  })

  it('displays business statistics correctly', () => {
    render(<Hero />)
    
    expect(screen.getByText('4.9')).toBeInTheDocument()
    expect(screen.getByText('194 Reviews')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Expert Barbers')).toBeInTheDocument()
    expect(screen.getByText('114')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
  })

  it('renders booking and work links with correct attributes', () => {
    render(<Hero />)
    
    const bookingLink = screen.getByText('Book Your Appointment')
    expect(bookingLink.closest('a')).toHaveAttribute('href', 'https://example.com/booking')
    expect(bookingLink.closest('a')).toHaveAttribute('target', '_blank')
    expect(bookingLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')

    const workLink = screen.getByText('View Our Work')
    expect(workLink.closest('a')).toHaveAttribute('href', '#work')
  })

  it('shows Dallas location badge', () => {
    render(<Hero />)
    
    expect(screen.getByText('DALLAS • PREMIER BARBER DESTINATION')).toBeInTheDocument()
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Hero />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
