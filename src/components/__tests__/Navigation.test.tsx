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
    render(<Navigation />)
    
    expect(screen.getByText('The Barber Cave')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Barbers')).toBeInTheDocument()
    expect(screen.getByText('Book Appointment')).toBeInTheDocument()
  })

  it('shows mobile menu when menu is toggled open', () => {
    render(<Navigation />)
    
    // Initially closed - mobile menu should not be visible
    expect(screen.queryByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
    
    // Click to open mobile menu
    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(toggleButton)
    
    // Mobile menu should now be visible
    expect(screen.getAllByText('Services')).toHaveLength(2)
    expect(screen.getAllByText('Barbers')).toHaveLength(2) 
    expect(screen.getAllByText('Book Appointment')).toHaveLength(2)
  })

  it('hides mobile menu when toggled closed', () => {
    render(<Navigation />)
    
    // Open mobile menu first
    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(toggleButton)
    
    // Verify mobile menu is open
    expect(screen.getAllByText('Services')).toHaveLength(2)
    
    // Close mobile menu
    fireEvent.click(toggleButton)
    
    // Mobile menu should be hidden again
    expect(screen.getAllByText('Services')).toHaveLength(1)
  })

  it('renders correct external links', () => {
    render(<Navigation />)
    
    const bookingLinks = screen.getAllByText('Book Appointment')
    bookingLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/booking')
      expect(link.closest('a')).toHaveAttribute('target', '_blank')
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu')
  })

  it('should have no accessibility violations', async () => {
    render(<Navigation />)
    const nav = screen.getByRole('navigation')
    const results = await axe(nav)
    console.log('Axe results:', results)
    expect(results.violations).toHaveLength(0)
  })

  it('should have no accessibility violations when mobile menu is open', async () => {
    render(<Navigation />)
    
    // Open mobile menu
    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(toggleButton)
    
    const nav = screen.getByRole('navigation')
    const results = await axe(nav)
    console.log('Axe results (mobile open):', results)
    expect(results.violations).toHaveLength(0)
  })
})
