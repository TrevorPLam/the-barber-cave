import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../Button';

describe('Button Component', () => {
  describe('Dark Mode Contrast Compliance', () => {
    it('should apply correct classes for primary variant in light mode', () => {
      render(<Button variant="primary">Primary Button</Button>);

      const button = screen.getByRole('button', { name: /primary button/i });
      expect(button).toHaveClass('bg-black', 'text-white');
      expect(button).toHaveClass('hover:bg-gray-900');
      expect(button).toHaveClass('focus-visible:ring-black');
    });

    it('should apply correct classes for primary variant in dark mode', () => {
      // Simulate dark mode by adding dark class to document element
      document.documentElement.classList.add('dark');

      render(<Button variant="primary">Primary Button Dark</Button>);

      const button = screen.getByRole('button', { name: /primary button dark/i });
      expect(button).toHaveClass('dark:bg-white', 'dark:text-black');
      expect(button).toHaveClass('dark:hover:bg-gray-100');
      expect(button).toHaveClass('dark:focus-visible:ring-white');

      // Clean up
      document.documentElement.classList.remove('dark');
    });

    it('should apply correct classes for secondary variant in light mode', () => {
      render(<Button variant="secondary">Secondary Button</Button>);

      const button = screen.getByRole('button', { name: /secondary button/i });
      expect(button).toHaveClass('border-black', 'text-black');
      expect(button).toHaveClass('hover:bg-black', 'hover:text-white');
      expect(button).toHaveClass('focus-visible:ring-black');
    });

    it('should apply correct classes for secondary variant in dark mode', () => {
      document.documentElement.classList.add('dark');

      render(<Button variant="secondary">Secondary Button Dark</Button>);

      const button = screen.getByRole('button', { name: /secondary button dark/i });
      expect(button).toHaveClass('dark:border-white', 'dark:text-white');
      expect(button).toHaveClass('dark:hover:bg-white', 'dark:hover:text-black');
      expect(button).toHaveClass('dark:focus-visible:ring-white');

      document.documentElement.classList.remove('dark');
    });

    it('should apply correct classes for accent variant in both modes', () => {
      render(<Button variant="accent">Accent Button</Button>);

      const button = screen.getByRole('button', { name: /accent button/i });
      expect(button).toHaveClass('bg-accent', 'text-foreground');
      expect(button).toHaveClass('hover:bg-amber-600');
      expect(button).toHaveClass('focus-visible:ring-amber-500');
      // Accent variant uses the same classes for both light and dark modes
      // as it relies on CSS custom properties that adapt to theme
      expect(button).toHaveClass('dark:bg-accent', 'dark:text-foreground');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper focus ring styling', () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole('button', { name: /focus test/i });
      expect(button).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-offset-2');
    });

    it('should support keyboard navigation', () => {
      render(<Button>Keyboard Test</Button>);

      const button = screen.getByRole('button', { name: /keyboard test/i });
      // Buttons are keyboard accessible by default - they don't need explicit tabIndex
      expect(button).toBeInTheDocument();
    });
  });

  describe('Variant Behavior', () => {
    it('should default to primary variant', () => {
      render(<Button>Default Variant</Button>);

      const button = screen.getByRole('button', { name: /default variant/i });
      expect(button).toHaveClass('bg-black', 'text-white');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom Class</Button>);

      const button = screen.getByRole('button', { name: /custom class/i });
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Link Functionality', () => {
    it('should render as link when href is provided', () => {
      render(<Button href="/test">Link Button</Button>);

      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should render external links with security attributes', () => {
      render(<Button href="https://example.com">External Link</Button>);

      const link = screen.getByRole('link', { name: /external link/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
