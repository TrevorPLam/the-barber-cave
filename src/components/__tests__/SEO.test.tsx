import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StructuredData from '../StructuredData';
import Breadcrumbs from '../Breadcrumbs';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('SEO Components', () => {
  describe('StructuredData', () => {
    it('renders Organization structured data', () => {
      render(<StructuredData type="Organization" />);
      
      const script = screen.getByRole('script', { name: /application\/ld\+json/i });
      expect(script).toBeInTheDocument();
      
      const data = JSON.parse(script.getAttribute('content') || '{}');
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('Organization');
      expect(data.name).toBe('The Barber Cave');
    });

    it('renders LocalBusiness structured data', () => {
      render(<StructuredData type="LocalBusiness" />);
      
      const script = screen.getByRole('script', { name: /application\/ld\+json/i });
      const data = JSON.parse(script.getAttribute('content') || '{}');
      expect(data['@type']).toBe('LocalBusiness');
      expect(data.address.addressLocality).toBe('Dallas');
    });

    it('renders Service structured data with custom data', () => {
      const serviceData = {
        name: 'Haircut Service',
        description: 'Professional haircut service',
        services: [
          { title: 'Basic Cut', description: 'Simple haircut', price: '$25' }
        ]
      };
      
      render(<StructuredData type="Service" data={serviceData} />);
      
      const script = screen.getByRole('script', { name: /application\/ld\+json/i });
      const data = JSON.parse(script.getAttribute('content') || '{}');
      expect(data['@type']).toBe('Service');
      expect(data.name).toBe('Haircut Service');
    });

    it('renders BreadcrumbList structured data', () => {
      const breadcrumbData = {
        breadcrumbs: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' }
        ]
      };
      
      render(<StructuredData type="BreadcrumbList" data={breadcrumbData} />);
      
      const script = screen.getByRole('script', { name: /application\/ld\+json/i });
      const data = JSON.parse(script.getAttribute('content') || '{}');
      expect(data['@type']).toBe('BreadcrumbList');
      expect(data.itemListElement).toHaveLength(1);
    });

    it('does not render for invalid type', () => {
      const { container } = render(<StructuredData type="InvalidType" as any />);
      expect(container.firstChild).toBeNull();
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
      
      render(<Breadcrumbs items={items} />);
      
      const script = screen.getByRole('script', { name: /application\/ld\+json/i });
      const data = JSON.parse(script.getAttribute('content') || '{}');
      expect(data['@type']).toBe('BreadcrumbList');
      expect(data.itemListElement).toHaveLength(2);
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
    // This would be used in integration tests
    expect(document.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });

  it('validates meta tags', () => {
    // Check for essential meta tags
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(ogTitle).toBeInTheDocument();
  });
});
