import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import Services from '../Services'

// Mock the constants and services data
vi.mock('@/data/constants', () => ({
  EXTERNAL_LINKS: {
    services: 'https://example.com/services'
  }
}))

vi.mock('@/data/services', () => ({
  services: [
    {
      id: 'ultimate-grooming',
      title: 'Ultimate Grooming',
      description: '2-hour luxury experience',
      price: '$100',
      duration: '2 hours',
      icon: 'Crown'
    },
    {
      id: 'new-client-special',
      title: 'New Client Special',
      description: 'First-time clients receive $10 off',
      price: '$10 OFF',
      duration: 'First visit',
      icon: 'ChevronRight'
    }
  ]
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  Crown: () => <div data-testid="crown">Crown</div>,
  Scissors: () => <div data-testid="scissors">Scissors</div>,
  Star: () => <div data-testid="star">Star</div>,
  Users: () => <div data-testid="users">Users</div>,
  Award: () => <div data-testid="award">Award</div>
}))

describe('Services', () => {
  it('renders services section with correct heading', () => {
    render(<Services />)
    
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Premium grooming services tailored to your style')).toBeInTheDocument()
  })

  it('renders service cards with correct information', () => {
    render(<Services />)
    
    expect(screen.getByText('Ultimate Grooming')).toBeInTheDocument()
    expect(screen.getByText('2-hour luxury experience')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('2 hours')).toBeInTheDocument()
    
    expect(screen.getByText('New Client Special')).toBeInTheDocument()
    expect(screen.getByText('First-time clients receive $10 off')).toBeInTheDocument()
    expect(screen.getByText('$10 OFF')).toBeInTheDocument()
    expect(screen.getByText('First visit')).toBeInTheDocument()
  })

  it('highlights special offer with amber color', () => {
    render(<Services />)
    
    // The special offer should have amber styling on the "Book Now" button
    const bookNowButtons = screen.getAllByText('Book Now')
    const specialBookNowButton = bookNowButtons.find(button => 
      button.closest('a')?.classList.contains('bg-amber-500')
    )
    expect(specialBookNowButton).toBeInTheDocument()
    expect(specialBookNowButton?.closest('a')).toHaveClass('bg-amber-500', 'text-black')
  })

  it('renders view all services link', () => {
    render(<Services />)
    
    const link = screen.getByText('View All 114 Services')
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/services')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
