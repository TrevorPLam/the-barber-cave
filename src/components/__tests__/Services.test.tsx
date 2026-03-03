import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Services from '../Services'
import * as servicesData from '@/data/services'

// Mock the constants
vi.mock('@/data/constants', () => ({
  EXTERNAL_LINKS: {
    services: 'https://example.com/services',
    booking: 'https://example.com/booking'
  }
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  Crown: () => <div data-testid="crown">Crown</div>,
  Scissors: () => <div data-testid="scissors">Scissors</div>,
  Star: () => <div data-testid="star">Star</div>,
  Users: () => <div data-testid="users">Users</div>,
  Award: () => <div data-testid="award">Award</div>,
  Zap: () => <div data-testid="zap">Zap</div>,
  Sparkles: () => <div data-testid="sparkles">Sparkles</div>,
  Gem: () => <div data-testid="gem">Gem</div>,
  Heart: () => <div data-testid="heart">Heart</div>,
  Clock: () => <div data-testid="clock">Clock</div>,
  CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
  Target: () => <div data-testid="target">Target</div>,
  Move: () => <div data-testid="move">Move</div>,
  Smile: () => <div data-testid="smile">Smile</div>,
  Flower: () => <div data-testid="flower">Flower</div>,
  Diamond: () => <div data-testid="diamond">Diamond</div>,
  Sun: () => <div data-testid="sun">Sun</div>,
  Moon: () => <div data-testid="moon">Moon</div>,
  RefreshCw: () => <div data-testid="refresh-cw">RefreshCw</div>,
  Wind: () => <div data-testid="wind">Wind</div>,
  Droplet: () => <div data-testid="droplet">Droplet</div>,
  Link: () => <div data-testid="link">Link</div>,
  Plus: () => <div data-testid="plus">Plus</div>,
  RotateCcw: () => <div data-testid="rotate-ccw">RotateCcw</div>
}))

// Mock component dependencies
vi.mock('../Breadcrumbs', () => ({
  default: ({ items }: any) => <nav data-testid="breadcrumbs">Breadcrumbs</nav>
}))

vi.mock('../StructuredData', () => ({
  default: ({ type, data }: any) => <script type="application/ld+json">{'{"@type": "' + type + '"'}</script>
}))

vi.mock('../ContainerQueries', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>
}))

describe('Services', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('renders services section with correct heading', () => {
    render(<Services />)
    
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Premium grooming services tailored to your style')).toBeInTheDocument()
  })

  it('renders service cards with correct information', () => {
    render(<Services />)
    
    expect(screen.getByText('Ultimate Grooming (with beard)')).toBeInTheDocument()
    expect(screen.getByText(/Deep cleanse exfoliating facial/)).toBeInTheDocument()
    
    expect(screen.getByText('New Client Special $10 Off')).toBeInTheDocument()
    expect(screen.getByText(/\$10 off any service/)).toBeInTheDocument()
    
    // Check that multiple services are rendered
    const serviceCards = document.querySelectorAll('.service-card')
    expect(serviceCards.length).toBe(28)
  })

  it('highlights special offer with amber color', () => {
    render(<Services />)
    
    // The special offer should have amber styling on the "Book Now" button
    const amberElements = document.querySelectorAll('[class*="bg-amber-500"]')
    expect(amberElements.length).toBeGreaterThan(0)
    
    // Find the "Book Now" link within amber elements
    const specialBookNowLink = Array.from(amberElements).find(el => 
      el.textContent?.includes('Book Now')
    )
    expect(specialBookNowLink).toBeTruthy()
    expect(specialBookNowLink).toHaveClass('bg-amber-500', 'text-black')
  })

  it('renders view all services link', () => {
    render(<Services />)
    
    const link = screen.getByRole('link', { name: /view all \d+ services/i })
    expect(link).toHaveAttribute('href', 'https://example.com/services')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('falls back to Star icon when service icon is not found in iconMap', () => {
    // Temporarily inject a service with an unknown icon
    vi.spyOn(servicesData, 'services', 'get').mockReturnValue([
      {
        id: 'unknown-icon-service',
        title: 'Unknown Icon Service',
        description: 'A service with an icon not in iconMap',
        price: '$50',
        duration: '30 min',
        icon: 'NonExistentIcon'
      }
    ])

    render(<Services />)

    // Should render without crashing and show the Star fallback icon
    expect(screen.getByText('Unknown Icon Service')).toBeInTheDocument()
    expect(screen.getByTestId('star')).toBeInTheDocument()
  })
})
