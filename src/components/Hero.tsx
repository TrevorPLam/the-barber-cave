/**
 * @fileoverview Hero section component for the barber shop homepage
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Displays the main hero section with business branding, call-to-action buttons,
 * and key statistics. Features premium visual design with P3 color gradients
 * and optimized background imagery.
 */

/**
 * @component
 * @description Main hero section component for the barber shop homepage
 *
 * Features premium visual design with:
 * - Full-screen background image with P3 color gradients
 * - Compelling headline and business description
 * - Primary and secondary call-to-action buttons
 * - Key business statistics display
 * - Responsive design with mobile-first approach
 *
 * @example
 * ```tsx
 * import Hero from '@/components/Hero';
 *
 * function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <!-- Other page content -->
 *     </main>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Used in Next.js page component
 * export default function Page() {
 *   return <Hero />;
 * }
 * ```
 *
 * @returns {JSX.Element} The hero section with branding, CTAs, and statistics
 *
 * @accessibility
 * - High contrast text on gradient background
 * - Semantic heading hierarchy
 * - Keyboard navigable buttons
 * - Screen reader friendly content
 *
 * @performance
 * - Optimized background image loading with priority
 * - WebP/AVIF format support via Next.js Image
 * - Efficient CSS gradients with P3 color space
 */
'use client';

import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';
import { P3Gradient } from './P3Color';
import Image from 'next/image';
import Button from './Button';
import StatCard from './StatCard';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Replace with actual shop photo */}
      <P3Gradient 
        className="absolute inset-0"
        from="color(display-p3 0 0 0 / 0.6)"
        to="color(display-p3 0 0 0 / 0.4)"
      >
        <Image 
          src="/images/hero/hero-bg.svg"
          alt="The Barber Cave Interior"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </P3Gradient>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span 
            className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid color(display-p3 0.831 0.647 0.455 / 0.3)',
            }}
          >
            DALLAS • PREMIER BARBER DESTINATION
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Where Style Meets
          <span 
            className="block"
            style={{
              color: 'var(--accent-bright)',
              textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
            }}
          >
            Excellence
          </span>
        </h1>
        
        <p 
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{
            color: 'color(display-p3 0.878 0.878 0.878)',
          }}
        >
          {BUSINESS_INFO.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            variant="accent"
            href={EXTERNAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Your Appointment
          </Button>
          <Button
            variant="secondary"
            href="#work"
          >
            View Our Work
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <StatCard
            value={BUSINESS_INFO.rating}
            label={`${BUSINESS_INFO.totalReviews} Reviews`}
          />
          <StatCard
            value={BUSINESS_INFO.totalBarbers}
            label="Expert Barbers"
          />
          <StatCard
            value={BUSINESS_INFO.totalServices}
            label="Services"
          />
        </div>
      </div>
    </section>
  );
}
