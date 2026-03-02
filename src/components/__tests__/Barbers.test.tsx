import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import Barbers from '../Barbers'

// Mock the constants and barbers data
vi.mock('@/data/constants', () => ({
  EXTERNAL_LINKS: {
    services: 'https://example.com/services'
  }
}))

vi.mock('@/data/barbers', () => ({
  barbers: [
    {
      id: 'trill-l',
      name: 'Trill L.',
      title: 'Master Barber',
      rating: '4.8',
      reviews: '82',
      available: 'Tomorrow'
    },
    {
      id: 'charlo-f',
      name: 'Charlo F.',
      title: 'Fade Specialist',
      rating: '5.0',
      reviews: '28',
      available: 'Tomorrow'
    }
  ]
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  Star: () => <div data-testid="star">Star</div>
}))

describe('Barbers', () => {
  it('renders barbers section with correct heading', () => {
    render(<Barbers />)
    
    expect(screen.getByText('Master Barbers')).toBeInTheDocument()
    expect(screen.getByText('Meet our team of expert barbers, each with their own unique style and expertise')).toBeInTheDocument()
  })

  it('renders barber cards with correct information', () => {
    render(<Barbers />)
    
    expect(screen.getByText('Trill L.')).toBeInTheDocument()
    expect(screen.getByText('Master Barber')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(82)')).toBeInTheDocument()
    expect(screen.getAllByText('Available Tomorrow')).toHaveLength(2)
    
    expect(screen.getByText('Charlo F.')).toBeInTheDocument()
    expect(screen.getByText('Fade Specialist')).toBeInTheDocument()
    expect(screen.getByText('5.0')).toBeInTheDocument()
    expect(screen.getByText('(28)')).toBeInTheDocument()
  })

  it('renders meet all barbers link', () => {
    render(<Barbers />)
    
    const link = screen.getByText('Meet All 8 Barbers')
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/services')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays availability badges', () => {
    render(<Barbers />)
    
    const availabilityBadges = screen.getAllByText(/Available/)
    expect(availabilityBadges).toHaveLength(2)
    availabilityBadges.forEach(badge => {
      expect(badge).toHaveTextContent('Available Tomorrow')
    })
  })
})
