/**
 * @file Hero static content (server component)
 * @description Server component containing the static heading, description, location badge,
 * and business statistics for the Hero section. Renders entirely on the server with no
 * client-side JavaScript.
 */

import { BUSINESS_INFO } from '@/data/constants';
import StatCard from '@/components/StatCard';

/**
 * Renders all static content for the hero section.
 *
 * Includes the location badge, headline, business description, and key statistics.
 * Rendered entirely on the server — no interactivity or hydration required.
 *
 * @returns Static hero badge, heading, description, and stats grid.
 */
export default function HeroContent() {
  return (
    <>
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
    </>
  );
}