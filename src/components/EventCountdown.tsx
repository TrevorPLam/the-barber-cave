/**
 * @fileoverview Event countdown section for upcoming barber battles
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Displays countdown timer and details for upcoming Bring Wha-Cha Got barber battle events.
 * Features ticket integration, competitor information, and promotional elements.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EXTERNAL_LINKS } from '@/data/constants';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventCountdown() {
  // Render nothing server-side — countdown is inherently client-only
  const [isClient, setIsClient] = useState(false)

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setIsClient(true)
  }, [])

  const targetDate = useMemo(() => new Date('March 29, 2026 19:00:00 CST').getTime(), []);

  const calculateTimeLeft = useCallback(() => {
    const now = Date.now();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [targetDate]);

  useEffect(() => {
    if (!isClient) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isClient]);

  // SSR skeleton — exact same dimensions as the rendered countdown
  // prevents CLS (Cumulative Layout Shift)
  if (!isClient) {
    return (
      <section id="event-countdown" className="py-20 bg-gradient-to-br from-red-600 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full mr-2">LIVE EVENT</span>
              <span className="text-sm font-semibold">March 29, 2026</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              March Madness Barber Battle
            </h2>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Join us for an epic showcase of DFW's finest barber talent.
              Two shows in one night featuring the "SHES MY BARBER 2026" competition.
            </p>
          </div>

          {/* SSR skeleton with same dimensions */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-800" aria-hidden="true" />
              <div className="text-sm uppercase tracking-wider text-gray-300 mt-2">Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-800" aria-hidden="true" />
              <div className="text-sm uppercase tracking-wider text-gray-300 mt-2">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-800" aria-hidden="true" />
              <div className="text-sm uppercase tracking-wider text-gray-300 mt-2">Minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-800" aria-hidden="true" />
              <div className="text-sm uppercase tracking-wider text-gray-300 mt-2">Seconds</div>
            </div>
          </div>

          {/* Rest of the component renders normally */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Venue & Time */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Venue</h3>
                  <p className="text-gray-300">Unique Visions, DeSoto, TX</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Doors open: 6:00 PM</div>
                <div>• Show 1: 7:00 PM</div>
                <div>• Show 2: 9:00 PM</div>
                <div>• Double feature event</div>
              </div>
            </div>

            {/* Lee's Competition */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Featured Competitor</h3>
                  <p className="text-gray-300">Lee the Barber</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Competing: "SHES MY BARBER 2026"</div>
                <div>• VIP Services Specialist</div>
                <div>• Award-winning barber</div>
                <div>• Multiple brand ambassador</div>
              </div>
            </div>

            {/* Hosts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Hosted By</h3>
                <p className="text-gray-300">Trill & Jay Will</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>• Trill LadiBarber (Owner)</div>
              <div>• Jay Will Special (Co-host)</div>
              <div>• Music & barber fusion</div>
              <div>• Industry professionals</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="event-countdown" className="py-20 bg-gradient-to-br from-red-600 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full mr-2">LIVE EVENT</span>
            <span className="text-sm font-semibold">March 29, 2026</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            March Madness Barber Battle
          </h2>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Join us for an epic showcase of DFW's finest barber talent. 
            Two shows in one night featuring the "SHES MY BARBER 2026" competition.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{timeLeft.days}</div>
            <div className="text-sm uppercase tracking-wider text-gray-300">Days</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{timeLeft.hours}</div>
            <div className="text-sm uppercase tracking-wider text-gray-300">Hours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{timeLeft.minutes}</div>
            <div className="text-sm uppercase tracking-wider text-gray-300">Minutes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{timeLeft.seconds}</div>
            <div className="text-sm uppercase tracking-wider text-gray-300">Seconds</div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Venue & Time */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Venue</h3>
                <p className="text-gray-300">Unique Visions, DeSoto, TX</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>• Doors open: 6:00 PM</div>
              <div>• Show 1: 7:00 PM</div>
              <div>• Show 2: 9:00 PM</div>
              <div>• Double feature event</div>
            </div>
          </div>

          {/* Lee's Competition */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Featured Competitor</h3>
                <p className="text-gray-300">Lee the Barber</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>• Competing: "SHES MY BARBER 2026"</div>
              <div>• VIP Services Specialist</div>
              <div>• Award-winning barber</div>
              <div>• Multiple brand ambassador</div>
            </div>
          </div>

          {/* Hosts */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Hosted By</h3>
                <p className="text-gray-300">Trill & Jay Will</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>• Trill LadiBarber (Owner)</div>
              <div>• Jay Will Special (Co-host)</div>
              <div>• Music & barber fusion</div>
              <div>• Industry professionals</div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="text-center">
          <div className="bg-yellow-400 text-black rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Get Your Tickets Now!</h3>
            <p className="text-lg mb-6">
              Use promo code <span className="font-bold">LP601</span> for exclusive discount
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={EXTERNAL_LINKS.bringWhaChaGot}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                Buy Tickets
              </a>
              <a
                href={`tel:601-629-8972`}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Call for VIP Info
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              Follow <span className="font-bold">@bringwhachagot</span> for updates and behind-the-scenes content
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={EXTERNAL_LINKS.bringWhaChaGot}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Instagram
              </a>
              <a
                href={EXTERNAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                The Barber Cave
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
