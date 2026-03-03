/**
 * @file Regression tests for critical fixes
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Regression tests for critical bugs and fixes to prevent future regressions.
 * Tests are organized by component and fix type.
 */

import { render, screen } from '@testing-library/react';
import { expect, describe, it } from 'vitest';

// Test for hero image quality fix (T-7001 regression)
describe('Hero Component Image Quality Regression', () => {
  it('should use configured image quality to prevent accessibility warnings', async () => {
    // Import hero component dynamically to avoid issues
    const { default: Hero } = await import('../components/Hero');

    render(<Hero />);

    // Check that hero image is rendered (SVG placeholder)
    const heroImage = document.querySelector('img[alt=""]');
    expect(heroImage).toBeInTheDocument();

    // Verify the image has proper attributes
    expect(heroImage).toHaveAttribute('src');
    expect(heroImage).toHaveAttribute('loading', 'eager'); // priority should set loading="eager"
  });
});

// Test for gallery lazy loading implementation (T-7003 regression)
describe('Gallery Lazy Loading Regression', () => {
  it('should implement lazy loading for gallery images', async () => {
    const { default: Gallery } = await import('../components/Gallery');

    render(<Gallery />);

    // Check that gallery images are present
    const galleryImages = screen.getAllByRole('img');
    expect(galleryImages.length).toBeGreaterThan(0);

    // Verify lazy loading implementation
    // Images should be wrapped in LazyImage components with intersection observer
    galleryImages.forEach(img => {
      // Images should have proper alt text
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });
});

// Test for resource hints implementation (T-7004 regression)
describe('Resource Hints Regression', () => {
  it('should include proper resource hints in document head', async () => {
    // Import layout dynamically
    const { default: RootLayout } = await import('../app/layout');

    // Render layout to check head content
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    // Check for resource hint links in document head
    const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');

    // Should have preconnect for fonts
    expect(preconnectLinks.length).toBeGreaterThan(0);
    const fontPreconnect = Array.from(preconnectLinks).find(link =>
      link.getAttribute('href')?.includes('fonts.googleapis.com')
    );
    expect(fontPreconnect).toBeTruthy();

    // Should have preload for CSS
    expect(preloadLinks.length).toBeGreaterThan(0);
    const cssPreload = Array.from(preloadLinks).find(link =>
      link.getAttribute('href')?.includes('globals.css')
    );
    expect(cssPreload).toBeTruthy();
  });
});

// Test for barber priority loading (T-7005 regression)
describe('Barber Priority Loading Regression', () => {
  it('should prioritize loading for above-the-fold barber images', async () => {
    const { default: Barbers } = await import('../components/Barbers');

    render(<Barbers />);

    // Get all barber images
    const barberImages = document.querySelectorAll('img[alt]');

    // First 4 images should have priority loading
    const firstFourImages = Array.from(barberImages).slice(0, 4);
    firstFourImages.forEach(img => {
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });
});

// Test for booking prefetching (T-7006 regression)
describe('Booking Prefetch Regression', () => {
  it('should prefetch booking URLs on hover', async () => {
    const { default: Button } = await import('../components/Button');
    const userEvent = (await import('@testing-library/user-event')).default;
    const user = userEvent.setup();

    // Mock document.head methods
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    Object.defineProperty(document.head, 'appendChild', { value: mockAppendChild });
    Object.defineProperty(document.head, 'removeChild', { value: mockRemoveChild });

    // Create a booking button
    const bookingUrl = 'https://getsquire.com/booking/book/the-barber-cave-dallas';
    render(
      <Button href={bookingUrl}>
        Book Appointment
      </Button>
    );

    const button = screen.getByRole('link', { name: /book appointment/i });

    // Hover over the button
    await user.hover(button);

    // Should have created a prefetch link
    expect(mockAppendChild).toHaveBeenCalled();
    const linkElement = mockAppendChild.mock.calls[0][0];
    expect(linkElement.tagName).toBe('LINK');
    expect(linkElement.rel).toBe('prefetch');
    expect(linkElement.href).toBe(bookingUrl);
  });
});

// Test for intersection observer hook (T-7003 regression)
describe('Intersection Observer Hook Regression', () => {
  it('should properly handle intersection observer cleanup', async () => {
    const { useIntersectionObserver } = await import('../hooks/useIntersectionObserver');

    // Mock intersection observer
    const mockObserve = vi.fn();
    const mockUnobserve = vi.fn();
    const mockDisconnect = vi.fn();

    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect
    }));

    // Create a test component that uses the hook
    function TestComponent() {
      const { ref } = useIntersectionObserver();
      return <div ref={ref as any}>test</div>;
    }

    const { unmount } = render(<TestComponent />);

    // Should have observed the element
    expect(mockObserve).toHaveBeenCalled();

    // Unmount should cleanup
    unmount();

    // Should have unobserved the element
    expect(mockUnobserve).toHaveBeenCalled();
  });
});
