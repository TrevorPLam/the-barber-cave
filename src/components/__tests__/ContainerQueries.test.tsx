import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContainerQueries, { useContainerQuerySupport } from '../ContainerQueries';

// Mock CSS.supports
const mockCSSSupports = vi.fn();
Object.defineProperty(window, 'CSS', {
  value: {
    supports: mockCSSSupports,
  },
  writable: true,
});

describe('ContainerQueries Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <ContainerQueries>
        <div>Test Content</div>
      </ContainerQueries>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ContainerQueries className="custom-class">
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('sets container-type to inline-size by default', () => {
    render(
      <ContainerQueries>
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ containerType: 'inline-size' });
  });

  it('sets container-type to size when specified', () => {
    render(
      <ContainerQueries containerType="size">
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ containerType: 'size' });
  });

  it('sets container-name when provided', () => {
    render(
      <ContainerQueries containerName="test-container">
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ containerName: 'test-container' });
  });

  it('sets container-name to none when not provided', () => {
    render(
      <ContainerQueries>
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ containerName: 'none' });
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };

    render(
      <ContainerQueries ref={ref}>
        <div>Test Content</div>
      </ContainerQueries>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional props', () => {
    render(
      <ContainerQueries data-testid="container-queries" role="region">
        <div>Test Content</div>
      </ContainerQueries>
    );

    const container = screen.getByTestId('container-queries');
    expect(container).toHaveAttribute('role', 'region');
  });
});

describe('useContainerQuerySupport Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when CSS.supports indicates container query support', () => {
    mockCSSSupports.mockReturnValue(true);

    const result = useContainerQuerySupport();
    expect(result).toBe(true);
    expect(mockCSSSupports).toHaveBeenCalledWith('container-type', 'inline-size');
  });

  it('returns false when CSS.supports indicates no container query support', () => {
    mockCSSSupports.mockReturnValue(false);

    const result = useContainerQuerySupport();
    expect(result).toBe(false);
  });

  it('returns false during server-side rendering', () => {
    // Mock window being undefined
    const originalWindow = global.window;
    delete (global as any).window;

    const result = useContainerQuerySupport();
    expect(result).toBe(false);

    // Restore window
    global.window = originalWindow;
  });
});

describe('Container Queries Integration', () => {
  it('applies correct container styles for barber grid', () => {
    render(
      <ContainerQueries containerName="barber-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="barber-card">Barber 1</div>
        <div className="barber-card">Barber 2</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Barber 1').parentElement;
    expect(container).toHaveStyle({
      containerType: 'inline-size',
      containerName: 'barber-grid',
    });
    expect(container).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8');
  });

  it('applies correct container styles for services grid', () => {
    render(
      <ContainerQueries containerName="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="service-card">Service 1</div>
        <div className="service-card">Service 2</div>
      </ContainerQueries>
    );

    const container = screen.getByText('Service 1').parentElement;
    expect(container).toHaveStyle({
      containerType: 'inline-size',
      containerName: 'services-grid',
    });
    expect(container).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8');
  });
});
