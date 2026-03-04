// src/components/__tests__/keyboard.test.tsx
// T-K007: Keyboard-Only Navigation Tests (WCAG 2.1.1 Keyboard)
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navigation from '../Navigation'

// Mock next-auth/react to avoid SessionProvider requirement
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

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

describe('Keyboard-Only Navigation Tests (WCAG 2.1.1)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Tab Navigation', () => {
    it('all interactive elements in desktop nav are keyboard focusable', () => {
      render(<Navigation />)

      // Buttons must not have tabIndex=-1 (unless intentionally removed from tab order)
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
      buttons.forEach(button => {
        expect(button.tabIndex).not.toBe(-1)
      })

      // Links must have valid href so they are included in tab order
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'))
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.getAttribute('href')).not.toBe('')
      })
    })

    it('focusable elements inside open mobile menu are reachable by Tab', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      const dialog = await waitFor(() => screen.getByRole('dialog'))

      const focusableElements = dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      expect(focusableElements.length).toBeGreaterThan(0)

      focusableElements.forEach(el => {
        // Elements must not be hidden from keyboard navigation
        expect(el).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('first focusable element in mobile menu receives focus when menu opens', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      const dialog = await waitFor(() => screen.getByRole('dialog'))
      const firstFocusable = dialog.querySelector<HTMLElement>('a[href], button')

      await waitFor(() => {
        expect(firstFocusable).toHaveFocus()
      })
    })
  })

  describe('Escape Key', () => {
    it('Escape key closes the mobile menu', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' })
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('focus returns to toggle button after Escape closes the menu', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
      toggleButton.focus()

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' })
      })

      await waitFor(() => {
        expect(toggleButton).toHaveFocus()
      })
    })
  })

  describe('ARIA State Attributes', () => {
    it('aria-expanded on toggle button reflects menu open/closed state', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('mobile menu dialog has aria-modal="true" when open', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      const dialog = await waitFor(() => screen.getByRole('dialog'))
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('mobile menu button has aria-controls pointing to menu id', () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
      expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })
  })

  describe('Link Activation', () => {
    it('booking link is a proper anchor element activatable via keyboard', () => {
      render(<Navigation />)

      // Desktop booking link — must be a native <a> so Enter activates it natively
      const bookingLinks = screen.getAllByText('Book Appointment')
      bookingLinks.forEach(el => {
        const anchor = el.closest('a')
        expect(anchor?.tagName).toBe('A')
        expect(anchor).toHaveAttribute('href', 'https://example.com/booking')
      })
    })

    it('navigation items are anchor elements with valid hrefs', () => {
      render(<Navigation />)

      const servicesLinks = screen.getAllByText('Services')
      servicesLinks.forEach(el => {
        const anchor = el.closest('a')
        if (anchor) {
          expect(anchor).toHaveAttribute('href', '#services')
        }
      })
    })
  })

  describe('Outside Click', () => {
    it('clicking outside mobile menu closes it', async () => {
      render(<Navigation />)

      const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click on the document body (outside the menu)
      await act(async () => {
        fireEvent.click(document.body)
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
