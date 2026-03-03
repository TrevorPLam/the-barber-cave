import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import Barbers from '../Barbers'

vi.mock('@/data/constants', () => ({
  EXTERNAL_LINKS: {
    booking: 'https://example.com/booking',
  },
}))

vi.mock('@/data/barbers', () => ({
  barbers: [
    {
      id: 'trill-l',
      name: 'Trill L.',
      title: 'Master Barber',
      rating: '4.8',
      reviews: '82',
      available: 'Tomorrow',
      image: '/images/barbers/trill-l.svg',
    },
    {
      id: 'charlo-f',
      name: 'Charlo F.',
      title: 'Fade Specialist',
      rating: '5.0',
      reviews: '28',
      available: 'Tomorrow',
      image: '/images/barbers/charlo-f.svg',
    },
  ],
}))

vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  Star: () => <div data-testid="star">Star</div>,
  Phone: () => <div data-testid="phone">Phone</div>,
  Calendar: () => <div data-testid="calendar">Calendar</div>,
  Award: () => <div data-testid="award">Award</div>,
  Music: () => <div data-testid="music">Music</div>,
  MapPin: () => <div data-testid="map-pin">MapPin</div>,
  Clock: () => <div data-testid="clock">Clock</div>,
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

  it('renders booking link', () => {
    render(<Barbers />)

    const link = screen.getByText('Book With Our Barbers')
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/booking')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders barber images from local SVG sources', () => {
    render(<Barbers />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    images.forEach((image) => {
      expect(image).toHaveAttribute('src')
      expect(image.getAttribute('src')).toContain('/images/barbers/')
    })
  })
})
