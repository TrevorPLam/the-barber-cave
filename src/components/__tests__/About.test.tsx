import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import About from '../About'

// Mock the constants to use real data
vi.mock('@/data/constants', () => ({
  BUSINESS_INFO: {
    name: 'The Barber Cave',
    rating: '4.9',
    totalReviews: '178',
    totalBarbers: '8',
    totalServices: '28',
  }
}))

describe('About', () => {
  it('renders about section with correct structure', () => {
    render(<About />)
    
    expect(screen.getByRole('heading', { name: 'The Barber Cave Experience' })).toBeInTheDocument()
    // Use flexible matcher for text that may be broken across elements
    expect(screen.getByText((content, element) => {
      return content.includes('Located in the heart of Dallas') && element?.tagName.toLowerCase() === 'p'
    })).toBeInTheDocument()
    expect(screen.getByText((content, element) => {
      return content.includes('Our barbers specialize') && element?.tagName.toLowerCase() === 'p'
    })).toBeInTheDocument()
  })

  it('displays business statistics correctly', () => {
    render(<About />)
    
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
    expect(screen.getByText('Average Rating')).toBeInTheDocument()
    expect(screen.getByText('8+')).toBeInTheDocument()
    expect(screen.getByText('Expert Barbers')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
  })

  it('renders shop interior image with proper attributes', () => {
    render(<About />)
    
    const image = screen.getByAltText('The Barber Cave Interior')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src')
    expect(image.closest('div')).toHaveClass('aspect-square', 'rounded-2xl', 'overflow-hidden', 'bg-gray-200')
  })

  it('has proper section structure and classes', () => {
    const { container } = render(<About />)
    
    const section = container.querySelector('section#about')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('py-20', 'bg-white')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<About />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
