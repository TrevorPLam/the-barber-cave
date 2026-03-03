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
                The Barber Cave is a luxury barbershop located in Dallas, Texas, offering premium grooming services 
                in an upscale urban environment. **As of 2026, the brand has expanded internationally with a second location in London, UK**, 
                positioning it as a global grooming destination.
              </p>
              <p>
                Owned and operated by <strong>Trevalyn M. Parker</strong> (professionally known as Trill LadiBarber), 
                a female barber and SMP (Scalp Micropigmentation) specialist, the shop maintains a strong reputation with 
                <strong>4.9 stars on Squire (194+ reviews)</strong> and <strong>4.7 stars on Birdeye (121+ reviews)</strong>.
              </p>
              <p>
                Our award-winning owner entered the male-dominated barbering industry facing significant challenges, 
                driven by "pure will and refusal to be shut down." Her grandmother, who passed away from cancer, 
                serves as her primary motivation and inspiration.
              </p>
              
              {/* Strategic Business Intelligence */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-xl font-bold text-black mb-4">Market Position & Competitive Edge</h4>
                <div className="space-y-3 text-gray-700">
                  <p className="font-medium text-black">🏆 <strong>Premium Differentiation:</strong></p>
                  <ul className="space-y-2 text-sm ml-6">
                    <li>• Only Black-owned luxury shop with adult bar amenities</li>
                    <li>• Community programming (Brotherhood Movement)</li>
                    <li>• Barber battle events (Bring Wha-Cha Got)</li>
                    <li>• SMP services & international expansion</li>
                    <li>• Female ownership story & music industry connections</li>
                  </ul>
                  
                  <p className="font-medium text-black mt-4">⚡ <strong>Strategic Paradox:</strong></p>
                  <p className="text-sm ml-6 italic">
                    "Most premium competitor with most extensive service ecosystem, yet only one without owned website."
                  </p>
                  
                  <p className="font-medium text-black mt-4">🎯 <strong>SEO Opportunities:</strong></p>
                  <ul className="space-y-1 text-sm ml-6">
                    <li>• "female barber Dallas" - High search volume, low competition</li>
                    <li>• "Black-owned barbershop Dallas" - Untapped market potential</li>
                    <li>• "scalp micropigmentation Dallas" - Premium service positioning</li>
                  </ul>
                </div>
              </div>
              
              {/* Revenue Intelligence */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h4 className="text-xl font-bold text-black mb-4">Revenue Expansion Intelligence</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-black mb-2">💰 <strong>Current Gaps:</strong></p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• No e-commerce for Magic Drip products</li>
                      <li>• No event ticketing infrastructure</li>
                      <li>• No SMP consultation automation</li>
                      <li>• Unclaimed Birdeye profile (121 reviews)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-black mb-2">📈 <strong>Opportunity Pipeline:</strong></p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Event ticketing: $20-50/ticket potential</li>
                      <li>• SMP consultations: $50-100/session</li>
                      <li>• Magic Drip e-commerce: National shipping</li>
                      <li>• Membership models: Brotherhood Movement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 space-y-8">
              {/* Risk Intelligence */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Business Intelligence & Risk Mitigation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="font-semibold text-red-800 mb-2">⚠️ Critical Vulnerabilities</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Platform dependency on Squire/Booksy</li>
                      <li>• Unclaimed Birdeye profile (121 reviews at risk)</li>
                      <li>• Zero owned customer data/email list</li>
                      <li>• No centralized communication system</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="font-semibold text-yellow-800 mb-2">🎯 Immediate Opportunities</div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• March 29 event creates deadline urgency</li>
                      <li>• SMP growth automation potential</li>
                      <li>• London location integration</li>
                      <li>• Brand-website alignment gap</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Owner Excellence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-black mb-2">Awards & Recognition</div>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Social Media Influencer of the Year Award</li>
                      <li>• Featured twice in Krave Magazine</li>
                      <li>• International brand expansion to London</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-black mb-2">Specializations</div>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Scalp Micropigmentation (SMP)</li>
                      <li>• Master Barber Services</li>
                      <li>• Magic Drip Product Line</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">SMP Services - Advanced Hair Loss Solutions</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    Non-surgical, painless hair loss solution using organic ink pigments to create the appearance of hair follicles.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>• 1-4 hour procedures</div>
                    <div>• 2-3 treatments required</div>
                    <div>• Custom ink blending</div>
                    <div>• Low maintenance</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Global Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-black mb-2">Dallas Flagship</div>
                    <div className="text-gray-600">
                      <div>2629 N Stemmons Fwy, Suite 104</div>
                      <div>Dallas, TX 75207</div>
                      <div>(682) 812-4154</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
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
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
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
                <div className="text-gray-600 text-sm">Squire Rating</div>
                <div className="text-2xl font-bold text-black mt-1 mb-2">4.7/5</div>
                <div className="text-gray-600 text-sm">Birdeye Rating</div>
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
            
            <div className="mt-8 bg-gradient-to-r from-black to-gray-800 p-6 rounded-2xl text-white">
              <h4 className="text-xl font-bold mb-3">Magic Drip Product Line</h4>
              <p className="text-gray-300 mb-4">
                Developed and launched by Trill LadiBarber, our premium grooming products deliver exceptional results.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Foam Wrap Solution</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Premium Pomade</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Beard Growth Oil</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">#{businessInfo.productLine?.hashtag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
