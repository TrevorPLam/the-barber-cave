/**
 * @fileoverview Contact section component with location, hours, and booking information
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Provides complete contact information including address, phone, hours, and booking links.
 * Features dark theme design with call-to-action buttons and promotional messaging.
 */

/**
 * @component
 * @description Contact section component displaying business location and booking information
 *
 * Showcases three key contact areas (location, phone, hours) with prominent booking
 * call-to-action buttons. Features dark theme design with amber accent colors
 * and responsive three-column layout.
 *
 * @returns {JSX.Element} Contact section with business information and booking CTAs
 *
 * @example
 * ```tsx
 * import Contact from '@/components/Contact';
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
 * // With footer integration
 * <footer>
 *   <Contact />
 *   <SocialLinks />
 * </footer>
 * ```
 *
 * @accessibility
 * - High contrast text on dark background
 * - Semantic heading hierarchy
 * - Keyboard accessible booking links
 * - Screen reader friendly contact information
 * - Proper link relationships (noopener, noreferrer)
 *
 * @performance
 * - Static content with no dynamic data fetching
 * - Efficient CSS classes with minimal styling overhead
 * - Optimized icon loading from Lucide React
 *
 * @dependencies
 * - @/data/constants - Business information and external links
 * - lucide-react - Icon components for contact sections
 *
 * @business-logic
 * - Contact information sourced from centralized constants
 * - External booking links integrate with third-party booking system
 * - Promotional messaging highlights new client discount
 * - Responsive design adapts from single column to three columns
 */
import { MapPin, Phone, Clock } from 'lucide-react';
import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Visit The Cave</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready for your transformation? Book your appointment with one of our master barbers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-gray-300 whitespace-pre-line mb-2">{BUSINESS_INFO.address}</p>
            <p className="text-gray-300">{BUSINESS_INFO.fullLocation}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
            <p className="text-gray-300 mb-2">{BUSINESS_INFO.phone}</p>
            <a 
              href={EXTERNAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Book Online →
            </a>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Flexible Hours</h3>
            <p className="text-gray-300">Daily appointments<br />Early morning & evening available</p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href={EXTERNAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Book Your Appointment Now
          </a>
          <p className="text-gray-400 mt-4">New clients get {BUSINESS_INFO.newClientDiscount} off their first service!</p>
        </div>
      </div>
    </section>
  );
}
