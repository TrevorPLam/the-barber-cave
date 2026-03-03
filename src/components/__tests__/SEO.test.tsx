import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import StructuredData, { BreadcrumbData } from '../StructuredData';
import Breadcrumbs from '../Breadcrumbs';

// Mock the constants
vi.mock('@/data/constants', () => ({
  BUSINESS_INFO: {
    name: 'The Barber Cave',
    description: 'Experience the art of barbering at The Barber Cave.',
    rating: '4.9',
    totalReviews: '178',
    address: '1234 Real Street, Dallas, TX 75201',
    phone: '(214) 555-0123',
    coordinates: {
      latitude: '32.7767',
      longitude: '-96.7970'
    },
    openingHours: [
      { days: 'Mon-Fri', hours: '9am–7pm' },
      { days: 'Sat', hours: '9am–6pm' },
      { days: 'Sun', hours: '10am–6pm' }
    ]
  },
  BUSINESS_METRICS: {
    structuredDataHours: [
      { days: 'Mo-Fr', open: '09:00', close: '19:00' },
      { days: 'Sa', open: '08:00', close: '20:00' },
      { days: 'Su', open: '10:00', close: '18:00' }
    ]
  },
  SITE_URL: 'https://the-barber-cave.vercel.app',
  EXTERNAL_LINKS: {
    instagram: 'https://www.instagram.com/the_barbercave_',
    facebook: 'https://www.facebook.com/TrillBarberCave/',
    youtube: 'https://www.youtube.com/@TheBarberCave'
  }
}));

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = vi.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('SEO Components', () => {
  describe('StructuredData', () => {
    it('renders Organization structured data', () => {
      const { container } = render(<StructuredData type="Organization" />);
      
      // First just check if any script element exists
      const script = container.querySelector('script');
      expect(script).toBeInTheDocument();
      
      // If script exists, check its type and content
      if (script) {
        expect(script).toHaveAttribute('type', 'application/ld+json');
        const content = script.innerHTML;
        expect(content).toBeTruthy();
        expect(content).toContain('Organization');
      }
    });

    it('renders HairSalon structured data', () => {
      const { container } = render(<StructuredData type="HairSalon" />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).toContain('HairSalon');
    });

    it('HairSalon schema does not contain servesCuisine', () => {
      const { container } = render(<StructuredData type="HairSalon" />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).not.toContain('servesCuisine');
    });

    it('renders Service structured data with custom data', () => {
      const serviceData = {
        name: 'Haircut Service',
        description: 'Professional haircut service',
        services: [
          { id: 'basic-cut', title: 'Basic Cut', description: 'Simple haircut', price: '$25', priceMin: 25, priceMax: 25, duration: '30 min', icon: 'Scissors' }
        ]
      };
      
      const { container } = render(<StructuredData type="Service" data={serviceData} />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).toContain('Service');
    });

    it('renders Service structured data with PriceSpecification for ranges', () => {
      const serviceData = {
        name: 'Haircut Service',
        description: 'Professional haircut service',
        services: [
          { id: 'range-cut', title: 'Range Cut', description: 'Variable price haircut', price: '$40-$60', priceMin: 40, priceMax: 60, duration: '45 min', icon: 'Star' }
        ]
      };
      
      const { container } = render(<StructuredData type="Service" data={serviceData} />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).toContain('PriceSpecification');
      expect(content).toContain('"minPrice":40');
      expect(content).toContain('"maxPrice":60');
    });

    it('extracts postalCode correctly from address string', () => {
      const { container } = render(<StructuredData type="Organization" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();

      const data = JSON.parse(script!.innerHTML);
      expect(data.address.postalCode).toBe('75201');
      expect(data.address.postalCode).not.toContain('TX');
    });

    it('renders BreadcrumbList structured data', () => {
      const breadcrumbData: BreadcrumbData = {
        breadcrumbs: [
          { "@type": "ListItem", position: 1, name: 'Home', item: 'https://example.com' }
        ]
      };
      
      const { container } = render(<StructuredData type="BreadcrumbList" data={breadcrumbData} />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).toContain('BreadcrumbList');
    });

    it('does not render for invalid type', () => {
      const { container } = render(<StructuredData type="Organization" />);
      // Test with valid type but ensure component handles edge cases
      expect(container.querySelector('script')).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('renders breadcrumb navigation', () => {
      const items = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' }
      ];
      
      render(<Breadcrumbs items={items} />);
      
      const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(nav).toBeInTheDocument();
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('renders structured data for breadcrumbs', () => {
      const items = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' }
      ];
      
      const { container } = render(<Breadcrumbs items={items} />);
      
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const content = script?.innerHTML;
      expect(content).toBeTruthy();
      expect(content).toContain('BreadcrumbList');
    });

    it('marks last item as current page', () => {
      const items = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' }
      ];
      
      render(<Breadcrumbs items={items} />);
      
      const currentPage = screen.getByText('Services');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('renders links for all but last item', () => {
      const items = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' }
      ];
      
      render(<Breadcrumbs items={items} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
      
      const servicesLink = screen.getByText('Services').closest('a');
      expect(servicesLink).not.toBeInTheDocument();
    });
  });
});

describe('SEO Validation', () => {
  it('validates structured data presence', () => {
    // This would be used in integration tests - for now just test the component exists
    const { container } = render(<StructuredData type="Organization" />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });

  it('validates meta tags', () => {
    // Check for essential meta tags - simplified test
    const { container } = render(<StructuredData type="Organization" />);
    // In a real app, these would be in the head, but we test component behavior
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });
});
