/**
 * @fileoverview About section component showcasing barber shop information and credentials
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Presents the barber shop's story, credentials, and visual representation.
 * Features responsive two-column layout with business statistics and interior imagery.
 */

/**
 * @component
 * @description About section component displaying barber shop information and credentials
 *
 * Showcases the business story, expert credentials, service offerings, and visual appeal
 * through a responsive two-column layout. Includes key business metrics and interior imagery.
 *
 * @returns {JSX.Element} About section with business information and statistics
 *
 * @example
 * ```tsx
 * import About from '@/components/About';
 *
 * function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <Services />
 *       <About />
 *       <Contact />
 *     </main>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With section anchor for smooth scrolling navigation
 * <section id="about-section">
 *   <About />
 * </section>
 * ```
 *
 * @accessibility
 * - Semantic heading hierarchy (h2 for main heading)
 * - High contrast text colors for readability
 * - Screen reader friendly content structure
 * - Proper alt text for interior image
 *
 * @performance
 * - Optimized image loading with Next.js Image component
 * - Responsive image sizing for different viewports
 * - Efficient aspect ratio maintenance
 *
 * @dependencies
 * - @/data/constants - Business information and statistics
 * - Next.js Image - Optimized image rendering
 *
 * @business-logic
 * - Business information sourced from centralized constants
 * - Statistics dynamically displayed from business data
 * - Interior image represents the shop's premium environment
 * - Content emphasizes expertise and community focus
 */
import { BUSINESS_INFO } from '@/data/constants';
import Image from 'next/image';

export default function About() {
  const businessInfo = BUSINESS_INFO;
  
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">The Barber Cave Experience</h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Located in the heart of Dallas, The Barber Cave isn't just a barbershop—it's a destination 
                where craftsmanship meets community. With {businessInfo.totalReviews} five-star reviews and a team of {businessInfo.totalBarbers} master barbers, 
                we've established ourselves as Dallas' premier grooming destination.
              </p>
              <p>
                Our barbers specialize in everything from classic cuts to modern fades, luxury shaves to 
                complete grooming transformations. We offer {businessInfo.totalServices} specialized services to ensure every client 
                leaves looking and feeling their absolute best.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.rating}/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalBarbers}+</div>
                <div className="text-gray-600">Expert Barbers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalServices}</div>
                <div className="text-gray-600">Services</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
              <Image 
                src="/images/about/shop-interior.svg"
                alt="The Barber Cave Interior"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
