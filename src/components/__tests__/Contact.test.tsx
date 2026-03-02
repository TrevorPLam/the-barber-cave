import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Contact from '../Contact'

// Mock the constants to use real data
vi.mock('@/data/constants', () => ({
  BUSINESS_INFO: {
    address: '1234 Real Street, Dallas, TX 75201',
    fullLocation: 'Dallas, Texas\nDFW Metro Area',
    phone: '(214) 555-0123',
    newClientDiscount: '$10',
  },
  EXTERNAL_LINKS: {
    booking: 'https://getsquire.com/booking/book/the-barber-cave-dallas'
  }
}))

describe('Contact', () => {
  it('renders contact section with correct heading and description', () => {
    render(<Contact />)
    
    expect(screen.getByRole('heading', { name: 'Visit The Cave' })).toBeInTheDocument()
    expect(screen.getByText('Ready for your transformation? Book your appointment with one of our master barbers')).toBeInTheDocument()
  })

  it('displays location information correctly', () => {
    render(<Contact />)
    
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('1234 Real Street, Dallas, TX 75201')).toBeInTheDocument()
    expect(screen.getByText('Dallas, Texas')).toBeInTheDocument()
    expect(screen.getByText('DFW Metro Area')).toBeInTheDocument()
  })

  it('displays contact information with booking link', () => {
    render(<Contact />)
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('(214) 555-0123')).toBeInTheDocument()
    expect(screen.getByText('Book Online →')).toBeInTheDocument()
    
    const bookingLink = screen.getByText('Book Online →')
    expect(bookingLink.closest('a')).toHaveAttribute('href', 'https://getsquire.com/booking/book/the-barber-cave-dallas')
    expect(bookingLink.closest('a')).toHaveAttribute('target', '_blank')
    expect(bookingLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays hours information', () => {
    render(<Contact />)
    
    expect(screen.getByText('Flexible Hours')).toBeInTheDocument()
    expect(screen.getByText('Daily appointments')).toBeInTheDocument()
    expect(screen.getByText('Early morning & evening available')).toBeInTheDocument()
  })

  it('renders main booking CTA button', () => {
    render(<Contact />)
    
    const ctaButton = screen.getByText('Book Your Appointment Now')
    expect(ctaButton.closest('a')).toHaveAttribute('href', 'https://getsquire.com/booking/book/the-barber-cave-dallas')
    expect(ctaButton.closest('a')).toHaveAttribute('target', '_blank')
    expect(ctaButton.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    expect(ctaButton.closest('a')).toHaveClass('bg-amber-500', 'text-black')
  })

  it('displays new client discount information', () => {
    render(<Contact />)
    
    expect(screen.getByText('New clients get $10 off their first service!')).toBeInTheDocument()
  })

  it('has proper section structure and classes', () => {
    const { container } = render(<Contact />)
    
    const section = container.querySelector('section#contact')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('py-20', 'bg-black', 'text-white')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Contact />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
