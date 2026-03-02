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
    
    // Check alt texts
    const expectedAlts = ['Classic Fade', 'Beard Trim', 'Modern Cut', 'Pompadour', 'Crew Cut', 'Hot Towel Shave']
    expectedAlts.forEach(alt => {
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
    expect(screen.getByText('by Master Barber')).toBeInTheDocument()
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
    expect(screen.getByText('by Expert Barber')).toBeInTheDocument()
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
