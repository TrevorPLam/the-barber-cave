import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Navigation from '../Navigation'

// Mock next-auth/react to avoid SessionProvider requirement
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock the constants
vi.mock('@/data/constants', () => ({
  NAVIGATION_ITEMS: [
    { href: '#services', label: 'Services' },
    { href: '#barbers', label: 'Barbers' },
    { href: '#work', label: 'Our Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ],
  EXTERNAL_LINKS: {
    booking: 'https://example.com/booking'
  },
  BUSINESS_INFO: {
    name: 'The Barber Cave'
  }
}))

describe('Navigation', () => {
  beforeEach(() => {
    // Reset any event listeners and focus states
    document.body.innerHTML = '';
  });

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

    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')

    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
    expect(menuButton).toHaveAttribute('id', 'mobile-menu-button')
  })

  it('should have no accessibility violations', async () => {
    render(<Navigation />)
    const banner = screen.getByRole('banner')
    const results = await axe(banner)
    console.log('Axe results:', results)
    expect(results.violations).toHaveLength(0)
  })

  it('should have no accessibility violations when mobile menu is open', async () => {
    render(<Navigation />)

    // Open mobile menu
    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(toggleButton)

    // Verify aria-expanded changed to true
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    // Verify mobile menu has correct id
    const mobileMenu = document.getElementById('mobile-menu')
    expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')

    const banner = screen.getByRole('banner')
    const results = await axe(banner)
    console.log('Axe results (mobile open):', results)
    expect(results.violations).toHaveLength(0)
  })

  // New mobile accessibility tests
  describe('Mobile Menu Accessibility', () => {
    it('closes mobile menu when Escape key is pressed', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' })

      // Menu should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('returns focus to menu button when Escape closes menu', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' })

      // Focus should return to menu button
      await waitFor(() => {
        expect(menuButton).toHaveFocus()
      })
    })

    it('closes mobile menu when clicking outside', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click outside the menu (on document body)
      fireEvent.click(document.body)

      // Menu should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('does not close mobile menu when clicking inside the menu', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click inside the menu
      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog)

      // Menu should remain open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has correct ARIA attributes for mobile menu dialog', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-menu-button')
        expect(dialog).toHaveAttribute('role', 'dialog')
      })
    })

    it('focuses first menu item when menu opens', async () => {
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /toggle menu/i })

      // Open menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // First focusable element should receive focus
      const dialog = screen.getByRole('dialog')
      const firstFocusable = dialog.querySelector('a[href], button')
      await waitFor(() => {
        expect(firstFocusable).toHaveFocus()
      })
    })
  })
})
