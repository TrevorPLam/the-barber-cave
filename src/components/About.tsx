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
                The Barber Cave is Dallas' premier luxury barbershop, offering premium grooming services 
                in an upscale urban environment. Founded by Trill LadiBarber, we've expanded internationally 
                with locations in Dallas and London.
              </p>
              <p>
                Our award-winning owner, a female barber and SMP specialist, has built a reputation for excellence 
                with <strong>4.9 stars on Squire (194+ reviews)</strong>. We specialize in precision cuts, 
                scalp micropigmentation, and creating exceptional grooming experiences.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-black mb-4">Why Choose The Barber Cave?</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-medium text-black">Premium Experience</p>
                      <p className="text-sm">Luxury barbershop with adult amenities and upscale environment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">👩‍💼</span>
                    <div>
                      <p className="font-medium text-black">Expert Ownership</p>
                      <p className="text-sm">Female-owned and operated with award-winning service</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-medium text-black">International Quality</p>
                      <p className="text-sm">Dallas flagship location with London expansion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-black mb-6">Our Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="font-semibold text-black mb-2">Dallas Flagship</div>
                  <div className="text-gray-600">
                    <div>2629 N Stemmons Fwy, Suite 104</div>
                    <div>Dallas, TX 75207</div>
                    <div>(682) 812-4154</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="font-semibold text-black mb-2">London Expansion</div>
                  <div className="text-gray-600">
                    <div>10A Homsey Green, Beck Row</div>
                    <div>Bury St. Edmunds, IP28 8AJ</div>
                    <div>United Kingdom</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200">
              <Image 
                src="/images/about/shop-interior.svg"
                alt="The Barber Cave Interior - Luxury Barber Shop Environment"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.rating}/5</div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalBarbers}+</div>
                <div className="text-gray-600 text-sm">Expert Barbers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalServices}</div>
                <div className="text-gray-600 text-sm">Services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
