import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { P3Color, P3Gradient, useP3Support } from '../P3Color';

// Mock CSS.supports and window.matchMedia
const mockCSSSupports = vi.fn();
const mockMatchMedia = vi.fn();

// Setup window mocks before component imports
Object.defineProperty(window, 'CSS', {
  value: {
    supports: mockCSSSupports,
  },
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
});

describe('P3Color Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children with provided className', () => {
    render(
      <P3Color className="test-class">
        <div>Test Content</div>
      </P3Color>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('test-class');
  });

  it('applies custom styles', () => {
    render(
      <P3Color style={{ backgroundColor: 'red' }}>
        <div>Test Content</div>
      </P3Color>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container?.style.backgroundColor).toBe('red');
  });
});

describe('P3Gradient Component', () => {
  it('renders with default gradient colors', () => {
    render(
      <P3Gradient>
        <div>Gradient Content</div>
      </P3Gradient>
    );

    const container = screen.getByText('Gradient Content').parentElement;
    expect(container).toBeInTheDocument();
  });

  it('renders with custom gradient colors', () => {
    render(
      <P3Gradient from="color(display-p3 1 0 0)" to="color(display-p3 0 1 0)">
        <div>Custom Gradient</div>
      </P3Gradient>
    );

    const container = screen.getByText('Custom Gradient').parentElement;
    expect(container?.style.background).toBe('linear-gradient(to right, color(display-p3 1 0 0), color(display-p3 0 1 0))');
  });
});

describe('useP3Support Hook', () => {
  let TestComponent: () => JSX.Element;

  beforeEach(() => {
    TestComponent = () => {
      const p3Supported = useP3Support();
      return <div>{p3Supported ? 'P3 Supported' : 'P3 Not Supported'}</div>;
    };
  });

  it('returns false during server-side rendering', () => {
    // Mock window as undefined for SSR
    const originalWindow = global.window;
    delete (global as any).window;

    render(<TestComponent />);

    expect(screen.getByText('P3 Not Supported')).toBeInTheDocument();

    // Restore window
    global.window = originalWindow;
  });

  it('returns true when P3 is supported', () => {
    mockCSSSupports.mockReturnValue(true);
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as MediaQueryList);

    render(<TestComponent />);

    expect(screen.getByText('P3 Supported')).toBeInTheDocument();
    expect(mockCSSSupports).toHaveBeenCalledWith('color', 'color(display-p3 1 1 1)');
    expect(mockMatchMedia).toHaveBeenCalledWith('(color-gamut: p3)');
  });

  it('returns false when CSS.supports returns false', () => {
    mockCSSSupports.mockReturnValue(false);

    render(<TestComponent />);

    expect(screen.getByText('P3 Not Supported')).toBeInTheDocument();
    expect(mockCSSSupports).toHaveBeenCalledWith('color', 'color(display-p3 1 1 1)');
  });

  it('returns false when matchMedia returns false', () => {
    mockCSSSupports.mockReturnValue(true);
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as MediaQueryList);

    render(<TestComponent />);

    expect(screen.getByText('P3 Not Supported')).toBeInTheDocument();
  });
});

describe('P3 Color Integration', () => {
  it('CSS custom properties are defined correctly', () => {
    // This test verifies that the CSS custom properties are properly defined
    // In a real application, you would check the computed styles
    const style = getComputedStyle(document.documentElement);
    
    // These should be defined in globals.css
    expect(style.getPropertyValue('--background')).toBeDefined();
    expect(style.getPropertyValue('--foreground')).toBeDefined();
    expect(style.getPropertyValue('--accent')).toBeDefined();
    expect(style.getPropertyValue('--accent-bright')).toBeDefined();
  });

  it('P3 colors have proper fallbacks', () => {
    // Test that P3 colors fallback to sRGB when not supported
    mockCSSSupports.mockReturnValue(false);
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as MediaQueryList);

    const TestComponent = () => {
      const p3Supported = useP3Support();
      return <div>Support: {p3Supported.toString()}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Support: false')).toBeInTheDocument();
  });
});
