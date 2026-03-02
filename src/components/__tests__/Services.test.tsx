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
    
    const link = screen.getByText('View All 2 Services')
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/services')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
