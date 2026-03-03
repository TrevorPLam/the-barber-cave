/**
 * @fileoverview Community and Events section component
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Displays community programming, barber battle events, and social initiatives
 * at The Barber Cave. Features monthly meetups, competition events, and
 * community engagement activities.
 */

import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';

export default function Community() {
  return (
    <section id="community" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Community & Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond haircuts, we're building a community. Join our programs and events 
            that connect, inspire, and celebrate barber culture.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brotherhood Movement */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">Brotherhood Movement</h3>
                <p className="text-gray-600">Monthly Men's Meet & Greet</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                A safe space for men to discuss life, mental health, and community issues. 
                Our "No Judgement Zone" philosophy creates an environment where authentic 
                conversations can flourish.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">Schedule</div>
                <div className="space-y-1 text-sm">
                  <div>• Every first Sunday of the month</div>
                  <div>• Meet & Greet: 5:30 PM</div>
                  <div>• Meeting starts: 6:00 PM</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">What to Expect</div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Open discussions about life challenges</li>
                  <li>• Mental health awareness</li>
                  <li>• Community networking</li>
                  <li>• Supportive brotherhood environment</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">Join Our Community</div>
                <p className="text-sm text-gray-700 mb-3">
                  Become part of something bigger than just a haircut. Build connections, 
                  find support, and grow with your community.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`tel:682-812-4154`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Call to Join
                  </a>
                  <a
                    href={EXTERNAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors text-center"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bring Wha-Cha Got Barber Battles */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">Bring Wha-Cha Got</h3>
                <p className="text-gray-600">Barber Battle Series</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Showcasing DFW barber talent through competitive events. Our barber battle 
                series builds community, showcases skills, and celebrates the art of barbering.
              </p>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">Upcoming Event</div>
                <div className="space-y-1 text-sm">
                  <div>• <strong>March Madness Barber Battle</strong></div>
                  <div>• March 29, 2026</div>
                  <div>• Unique Visions, DeSoto, TX</div>
                  <div>• 2 shows in 1 night (double feature)</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">Competition Categories</div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• "SHES MY BARBER 2026" - Lee the Barber competing</li>
                  <li>• Multiple brackets and skill levels</li>
                  <li>• Promo Code: LP601 (discount for tickets)</li>
                  <li>• Hosted by Trill LadiBarber & Jay Will Special</li>
                </ul>
              </div>
              
              <div className="flex gap-4 mt-6">
                <a
                  href={EXTERNAL_LINKS.bringWhaChaGot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Follow @bringwhachagot
                </a>
                <a
                  href={`tel:601-629-8972`}
                  className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Competitor Info
                </a>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <div className="font-semibold text-black mb-2">Event Production</div>
                <div className="text-sm text-gray-700">
                  <div>• Production: IMOC Productions (@imoc_productions)</div>
                  <div>• Venue: Unique Visions, DeSoto, TX</div>
                  <div>• Format: 2 shows in 1 night</div>
                  <div>• Purpose: Showcase DFW barber talent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Series */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-black mb-8 text-center">Digital Content Series</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-black mb-2">Barber Cave Chronicles</h4>
              <p className="text-gray-600 text-sm">
                Comedy/behind-the-scenes video series showcasing shop culture, 
                barber-client interactions, and daily operations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-black mb-2">Paper Ball Chronicles</h4>
              <p className="text-gray-600 text-sm">
                Unique content series featuring games, challenges, and 
                interactive entertainment with our barbers and clients.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-black mb-2">Client Transformations</h4>
              <p className="text-gray-600 text-sm">
                Regular before/after haircut features with strong engagement 
                on Instagram Reels and TikTok.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Integration */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-black mb-6">Follow Our Journey</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={EXTERNAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              @the_barbercave_
            </a>
            <a
              href={EXTERNAL_LINKS.ownerInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              @trill_ladibarber91
            </a>
            <a
              href={EXTERNAL_LINKS.londonInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              @the_barbercave_uk
            </a>
            <a
              href={EXTERNAL_LINKS.ownerTiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
