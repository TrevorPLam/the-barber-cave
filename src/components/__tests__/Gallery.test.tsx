import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Gallery from '../Gallery'

describe('Gallery', () => {
  it('renders gallery section with correct heading and description', () => {
    render(<Gallery />)
    
    expect(screen.getByRole('heading', { name: 'Our Work' })).toBeInTheDocument()
    expect(screen.getByText('See the transformations and styles that define The Barber Cave experience')).toBeInTheDocument()
  })

  it('renders all 6 gallery images with proper attributes', () => {
    render(<Gallery />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
    
    // Check descriptive alt texts
    const expectedAlts = [
      'Side profile view of a classic fade haircut with clean blended lines',
      'Well-groomed beard with precise edge shaping and neckline definition',
      'Contemporary textured haircut with volume on top and tapered sides',
      'Classic pompadour style with high volume swept back and clean sides',
      'Traditional crew cut with uniform length and neat military-style finish',
      'Traditional straight razor shave with hot towel treatment preparation',
    ]

    expectedAlts.forEach((alt) => {
      expect(screen.getByAltText(alt)).toBeInTheDocument()
    })
    
    // Check that images have src attributes
    images.forEach(image => {
      expect(image).toHaveAttribute('src')
      expect(image.closest('div')).toHaveClass('relative')
    })
  })

  it('displays hover overlay with title and barber information', () => {
    render(<Gallery />)
    
    // Check that overlay content is present (though may be hidden by default)
    expect(screen.getByText('Classic Fade')).toBeInTheDocument()
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
    expect(screen.getByText('Modern Cut')).toBeInTheDocument()
    expect(screen.getByText('Pompadour')).toBeInTheDocument()
    expect(screen.getByText('Crew Cut')).toBeInTheDocument()
    expect(screen.getByText('Hot Towel Shave')).toBeInTheDocument()
    
    // Barber names appear multiple times, use getAllByText
    expect(screen.getAllByText('by Master Barber').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('by Expert Barber').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('by Senior Barber').length).toBeGreaterThanOrEqual(2)
  })

  it('has proper grid layout and responsive classes', () => {
    const { container } = render(<Gallery />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
    
    const galleryItems = container.querySelectorAll('.aspect-square')
    expect(galleryItems).toHaveLength(6)
  })

  it('has proper section structure', () => {
    const { container } = render(<Gallery />)
    
    const section = container.querySelector('section#work')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('py-20', 'bg-gray-50')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Gallery />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
