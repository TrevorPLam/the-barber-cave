/**
 * @file Hero section component for the barber shop homepage
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Displays the main hero section with business branding, call-to-action buttons,
 * and key statistics. Features premium visual design with P3 color gradients
 * and optimized background imagery.
 */

/**
 * Main hero section component for the barber shop homepage.
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
 * @returns The hero section with branding, CTAs, and statistics.
 *
 * Accessibility notes:
 * - High contrast text on gradient background
 * - Semantic heading hierarchy
 * - Keyboard navigable buttons
 * - Screen reader friendly content
 *
 * Performance notes:
 * - Optimized background image loading with priority
 * - WebP/AVIF format support via Next.js Image
 * - Efficient CSS gradients with P3 color space
 */

import { P3Gradient } from './P3Color';
import Image from 'next/image';
import HeroContent from './Hero/HeroContent';
import HeroCTAs from './Hero/HeroCTAs';

/**
 * Renders the homepage hero section with the prioritized background image.
 *
 * @returns Hero section content.
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Replace with actual shop photo */}
      <P3Gradient 
        className="absolute inset-0"
        angle="165deg"
        from="color(display-p3 0 0 0 / 0.6)"
        to="color(display-p3 0 0 0 / 0.4)"
        fallbackFrom="rgba(0, 0, 0, 0.6)"
        fallbackTo="rgba(0, 0, 0, 0.4)"
      >
        <Image 
          src="/images/hero/hero-bg.svg"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </P3Gradient>
      
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <HeroContent />

          <HeroCTAs />
        </div>
    </section>
  );
}
