import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Barbers from '@/components/Barbers'

// Mock the constants for all components
vi.mock('@/data/constants', () => ({
  NAVIGATION_ITEMS: [
    { href: '#services', label: 'Services' },
    { href: '#barbers', label: 'Barbers' }
  ],
  EXTERNAL_LINKS: {
    booking: 'https://example.com/booking'
  },
  BUSINESS_INFO: {
    name: 'The Barber Cave',
    description: 'Experience the art of barbering at The Barber Cave.',
    rating: '4.9',
    totalReviews: '194',
    totalBarbers: '8',
    totalServices: '114'
  },
  SERVICES: [
    {
      name: 'Classic Haircut',
      description: 'Traditional barber cut with precision',
      price: '$35',
      duration: '30min'
    }
  ],
  BARBERS: [
    {
      name: 'John Doe',
      title: 'Master Barber',
      specialties: ['Fades', 'Classic Cuts'],
      experience: '10+ years'
    }
  ]
}))

describe('Accessibility Tests', () => {
  describe('Navigation Component', () => {
    it('should have no accessibility violations when closed', async () => {
      const { container } = render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when open', async () => {
      const { container } = render(<Navigation isMenuOpen={true} onMenuToggle={vi.fn()} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Hero Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Hero />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Services Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Services />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Barbers Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Barbers />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Combined Component Accessibility', () => {
    it('should test page-level accessibility', async () => {
      // Simulate a complete page render
      const { container } = render(
        <div>
          <Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />
          <Hero />
          <Services />
          <Barbers />
        </div>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have proper focus management', () => {
      const { container } = render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
      
      // Check that interactive elements are focusable (buttons are focusable by default)
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // Check that links have proper attributes
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('ARIA Attributes', () => {
    it('should have proper ARIA labels', () => {
      render(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i })
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu')
    })
  })
})
