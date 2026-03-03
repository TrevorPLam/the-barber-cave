import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AccessibilityProvider from '../AccessibilityProvider';

// Mock the axe-core imports to avoid actual loading in tests
const mockAxeDefault = vi.fn();

// Mock react-dom properly to avoid "$$typeof" errors
vi.mock('react-dom', () => ({
  default: {
    render: vi.fn(),
    createRoot: vi.fn(),
    // Add other properties that React might expect
    $$typeof: Symbol.for('react.element'),
  },
}));

vi.mock('@axe-core/react', () => ({
  default: mockAxeDefault,
}));

describe('AccessibilityProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  describe('Environment Variable Control', () => {
    it('should run axe when ENABLE_ACCESSIBILITY_AUDIT is explicitly set to true', async () => {
      process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT = 'true';
      process.env.NODE_ENV = 'production'; // Even in production

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).toHaveBeenCalledWith(
        expect.any(Function), // React
        mockReactDOM, // ReactDOM
        1000
      );
    });

    it('should run axe in development mode when ENABLE_ACCESSIBILITY_AUDIT is not set', async () => {
      delete process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT;
      process.env.NODE_ENV = 'development';

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).toHaveBeenCalledWith(
        expect.any(Function), // React
        mockReactDOM, // ReactDOM
        1000
      );
    });

    it('should not run axe in production when ENABLE_ACCESSIBILITY_AUDIT is not set', async () => {
      delete process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT;
      process.env.NODE_ENV = 'production';

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).not.toHaveBeenCalled();
    });

    it('should not run axe when ENABLE_ACCESSIBILITY_AUDIT is explicitly set to false', async () => {
      process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT = 'false';
      process.env.NODE_ENV = 'development'; // Even in development

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).not.toHaveBeenCalled();
    });

    it('should run axe in development mode even when ENABLE_ACCESSIBILITY_AUDIT is undefined', async () => {
      process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT = undefined;
      process.env.NODE_ENV = 'development';

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).toHaveBeenCalledWith(
        expect.any(Function), // React
        mockReactDOM, // ReactDOM
        1000
      );
    });
  });

  describe('Component Behavior', () => {
    it('should render null (no visible output)', () => {
      const { container } = render(<AccessibilityProvider />);
      expect(container.firstChild).toBeNull();
    });

    it('should not cause any side effects when disabled', async () => {
      process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT = 'false';

      render(<AccessibilityProvider />);

      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockAxeDefault).not.toHaveBeenCalled();
    });

    it('should have proper effect cleanup', async () => {
      process.env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT = 'true';

      const { unmount } = render(<AccessibilityProvider />);

      // Wait for effect to run
      await new Promise(resolve => setTimeout(resolve, 10));

      // Unmount component
      unmount();

      // Wait a bit more to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Component should have been cleaned up (effect runs once on mount)
      expect(mockAxeDefault).toHaveBeenCalledTimes(1);
    });
  });
});
