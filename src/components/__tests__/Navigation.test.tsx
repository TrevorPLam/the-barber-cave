import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Navigation from '../Navigation'

// Mock the constants
vi.mock('@/data/constants', () => ({
  NAVIGATION_ITEMS: [
    { href: '#services', label: 'Services' },
    { href: '#barbers', label: 'Barbers' }
  ],
  EXTERNAL_LINKS: {
    booking: 'https://example.com/booking'
  },
  BUSINESS_INFO: {
    name: 'The Barber Cave'
  }
}))

describe('Navigation', () => {
  it('renders desktop navigation with business name', () => {
    render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
    
    expect(screen.getByText('The Barber Cave')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Barbers')).toBeInTheDocument()
    expect(screen.getByText('Book Appointment')).toBeInTheDocument()
  })

  it('shows mobile menu when isMenuOpen is true', () => {
    render(<Navigation isMenuOpen={true} onMenuToggle={vi.fn()} />)
    
    // When mobile menu is open, we should see duplicate elements (desktop + mobile)
    expect(screen.getAllByText('Services')).toHaveLength(2)
    expect(screen.getAllByText('Barbers')).toHaveLength(2) 
    expect(screen.getAllByText('Book Appointment')).toHaveLength(2)
    
    // The close button (X) should be visible when menu is open
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  it('hides mobile menu when isMenuOpen is false', () => {
    const { container } = render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
    
    // Mobile menu should not be visible
    const mobileMenu = container.querySelector('.lg:hidden.bg-white')
    expect(mobileMenu).not.toBeInTheDocument()
  })

  it('calls onMenuToggle when menu button is clicked', () => {
    const mockToggle = vi.fn()
    render(<Navigation isMenuOpen={false} onMenuToggle={mockToggle} />)
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(menuButton)
    
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('renders correct external links', () => {
    render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
    
    const bookingLinks = screen.getAllByText('Book Appointment')
    bookingLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/booking')
      expect(link.closest('a')).toHaveAttribute('target', '_blank')
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have no accessibility violations when mobile menu is open', async () => {
    const { container } = render(<Navigation isMenuOpen={true} onMenuToggle={vi.fn()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
