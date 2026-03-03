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

  it('has keyboard accessible gallery items with proper ARIA attributes', () => {
    render(<Gallery />)
    
    const galleryItems = screen.getAllByRole('button')
    expect(galleryItems).toHaveLength(6)
    
    // Check each item is focusable
    galleryItems.forEach((item, index) => {
      expect(item).toHaveAttribute('tabIndex', '0')
      expect(item).toHaveClass('cursor-pointer', 'focus-within:ring-2')
    })
    
    // Check aria-labels provide context
    expect(galleryItems[0]).toHaveAttribute('aria-label', 'View Classic Fade by Master Barber')
  })

  it('supports motion-safe and motion-reduce preferences', () => {
    const { container } = render(<Gallery />)
    
    const galleryItems = container.querySelectorAll('[role="button"]')
    
    galleryItems.forEach(item => {
      // Check for motion-safe classes (animations only apply when user prefers motion)
      const image = item.querySelector('img')
      expect(image).toHaveClass('motion-safe:group-hover:scale-110')
      expect(image).toHaveClass('motion-safe:group-focus:scale-110')
    })
  })

  it('has enhanced hover effects with gradient overlay', () => {
    const { container } = render(<Gallery />)
    
    const galleryItems = container.querySelectorAll('[role="button"]')
    
    galleryItems.forEach(item => {
      // Check gradient overlay exists
      const gradientOverlay = item.querySelector('.bg-gradient-to-t')
      expect(gradientOverlay).toBeInTheDocument()
      expect(gradientOverlay).toHaveClass('from-black/70', 'via-black/30', 'to-transparent')
      
      // Check border highlight exists
      const borderHighlight = item.querySelector('.border-2')
      expect(borderHighlight).toBeInTheDocument()
      expect(borderHighlight).toHaveClass('motion-safe:group-hover:border-amber-500/60')
    })
  })

  it('displays content with slide-up animation on hover/focus', () => {
    render(<Gallery />)
    
    // Content should be present in the DOM even if visually hidden initially
    const titles = ['Classic Fade', 'Beard Trim', 'Modern Cut', 'Pompadour', 'Crew Cut', 'Hot Towel Shave']
    
    titles.forEach(title => {
      const titleElement = screen.getByText(title)
      expect(titleElement).toBeInTheDocument()
      expect(titleElement.parentElement).toHaveClass('motion-safe:translate-y-4', 'motion-safe:group-hover:translate-y-0')
    })
  })
})
