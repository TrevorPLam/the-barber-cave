import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import About from '@/components/About';
import Barbers from '@/components/Barbers';
import Gallery from '@/components/Gallery';
import Hero from '@/components/Hero';

describe('Image Optimization', () => {
  describe('Hero Component', () => {
    it('uses Next.js Image with priority-friendly loading behavior', () => {
      render(<Hero />);
      const heroImage = screen.getByAltText('');

      expect(heroImage).toBeInTheDocument();
      expect(heroImage).toHaveAttribute('src', '/images/hero/hero-bg.svg');

      // Priority images should never be explicitly lazy-loaded
      const loading = heroImage.getAttribute('loading');
      expect(loading).not.toBe('lazy');

      const parentContainer = heroImage.closest('div');
      expect(parentContainer).toHaveClass('absolute', 'inset-0');
    });

    it('preserves hero image layout container for fill image rendering', () => {
      render(<Hero />);
      const heroImage = screen.getByAltText('');
      const heroSection = heroImage.closest('section');

      expect(heroSection).toHaveClass('relative');
      expect(heroImage).toHaveClass('object-cover');
    });
  });

  describe('Gallery Component', () => {
    it('renders all gallery images with meaningful alt text', () => {
      render(<Gallery />);
      const galleryImages = screen.getAllByRole('img');

      expect(galleryImages).toHaveLength(6);
      galleryImages.forEach((image) => {
        expect(image).toHaveAttribute('alt');
        expect(image.getAttribute('alt')).toBeTruthy();
        expect(image.closest('div')).toHaveClass('relative');
      });
    });
  });

  describe('Barbers Component', () => {
    it('renders barber images with alt text', () => {
      render(<Barbers />);
      const barberImages = screen.getAllByRole('img');

      expect(barberImages.length).toBeGreaterThan(0);
      barberImages.forEach((image) => {
        expect(image).toHaveAttribute('alt');
        expect(image.closest('div')).toHaveClass('relative');
      });
    });
  });

  describe('About Component', () => {
    it('uses Next.js Image for shop interior with expected alt text', () => {
      render(<About />);
      const aboutImage = screen.getByAltText('The Barber Cave Interior - Luxury Barber Shop Environment');

      expect(aboutImage).toBeInTheDocument();
      expect(aboutImage.closest('div')).toHaveClass('aspect-square', 'rounded-2xl', 'overflow-hidden', 'bg-gray-200');
    });
  });

  describe('Image Performance & Accessibility', () => {
    it('uses local image paths for hero image', () => {
      render(<Hero />);
      const heroImage = screen.getByAltText('');

      expect(heroImage).not.toHaveAttribute('src', expect.stringContaining('unsplash'));
      expect(heroImage).not.toHaveAttribute('src', expect.stringContaining('http'));
    });

    it('uses empty alt text for decorative hero image', () => {
      render(<Hero />);
      const heroImage = screen.getByAltText('');

      expect(heroImage).toHaveAttribute('alt', '');
    });
  });
});
