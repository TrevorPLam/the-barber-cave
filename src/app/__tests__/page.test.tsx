import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import Home from '../page'

// Mock all components
vi.mock('@/components/Navigation', () => ({
  default: ({ isMenuOpen, onMenuToggle }: { isMenuOpen: boolean; onMenuToggle: () => void }) => (
    <nav data-testid="navigation">
      <button onClick={onMenuToggle}>Toggle Menu</button>
      <div>Menu Open: {isMenuOpen.toString()}</div>
    </nav>
  )
}))

vi.mock('@/components/SafeComponent', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@/components/Hero', () => ({
  default: () => <section data-testid="hero">Hero Section</section>
}))

vi.mock('@/components/Gallery', () => ({
  default: () => <section data-testid="gallery">Gallery Section</section>
}))

vi.mock('@/components/Services', () => ({
  default: () => <section data-testid="services">Services Section</section>
}))

vi.mock('@/components/Barbers', () => ({
  default: () => <section data-testid="barbers">Barbers Section</section>
}))

vi.mock('@/components/About', () => ({
  default: () => <section data-testid="about">About Section</section>
}))

vi.mock('@/components/Contact', () => ({
  default: () => <section data-testid="contact">Contact Section</section>
}))

vi.mock('@/components/Social', () => ({
  default: () => <section data-testid="social">Social Section</section>
}))

vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}))

describe('Home Page', () => {
  it('renders main sections', () => {
    render(<Home />)
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    // Note: Dynamic components will show loading states initially
  })

  it('handles menu toggle correctly', () => {
    render(<Home />)
    
    const toggleButton = screen.getByText('Toggle Menu')
    expect(screen.getByText('Menu Open: false')).toBeInTheDocument()
    
    fireEvent.click(toggleButton)
    expect(screen.getByText('Menu Open: true')).toBeInTheDocument()
    
    fireEvent.click(toggleButton)
    expect(screen.getByText('Menu Open: false')).toBeInTheDocument()
  })

  it('has correct page structure', async () => {
    render(<Home />)
    
    // Verify immediately rendered components
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    
    // Dynamic components may render asynchronously
    await waitFor(() => {
      expect(screen.getByTestId('gallery')).toBeInTheDocument()
      expect(screen.getByTestId('services')).toBeInTheDocument()
      expect(screen.getByTestId('barbers')).toBeInTheDocument()
      expect(screen.getByTestId('about')).toBeInTheDocument()
      expect(screen.getByTestId('contact')).toBeInTheDocument()
      expect(screen.getByTestId('social')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })
})
