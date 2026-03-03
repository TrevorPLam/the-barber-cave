/**
 * @fileoverview Centralized business constants and configuration data
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Contains all static business information, external links, and navigation structure
 * used throughout the application. Centralizes business data for maintainability
 * and provides type-safe constants with comprehensive JSDoc documentation.
 * 
 * Updated for 2026 SSOT patterns with dynamic business metrics integration.
 */

import { barbers } from './barbers';
import { services } from './services';
import { BusinessEngine, BusinessMetrics } from './businessEngine';

/**
 * @typedef {Object} BusinessInfo
 * @property {string} name - Official business name
 * @property {string} tagline - Marketing tagline
 * @property {string} description - Detailed business description for SEO and marketing
 * @property {string} location - Primary location display name
 * @property {string} fullLocation - Complete location information with metro area
 * @property {string} address - Full street address
 * @property {string} phone - Business phone number
 * @property {string} rating - Average customer rating (string format)
 * @property {string} totalReviews - Total number of customer reviews
 * @property {string} totalBarbers - Number of employed barbers
 * @property {string} totalServices - Total number of available services
 * @property {string} newClientDiscount - New client promotional discount
 * @property {Object} coordinates - Geographic coordinates for maps
 * @property {string} coordinates.latitude - Latitude coordinate
 * @property {string} coordinates.longitude - Longitude coordinate
 */

/**
 * @typedef {Object} ExternalLinks
 * @property {string} booking - URL for online booking system
 * @property {string} services - URL for services overview page
 * @property {string} instagram - Social media Instagram profile URL
 * @property {string} facebook - Social media Facebook page URL
 * @property {string} youtube - Social media YouTube channel URL
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} href - Navigation link URL or anchor
 * @property {string} label - Display text for navigation item
 */

/**
 * @constant {string} SITE_URL
 * @description Canonical website URL for SEO and social sharing
 * Used as base URL for meta tags, sitemaps, and external references
 * @example
 * ```typescript
 * // Used in metadata
 * <meta property="og:url" content={SITE_URL} />
 *
 * // Used for canonical links
 * <link rel="canonical" href={`${SITE_URL}${pathname}`} />
 * ```
 */
export const SITE_URL = 'https://the-barber-cave.vercel.app';

/**
 * @constant {BusinessMetrics} BUSINESS_METRICS
 * @description Dynamic business metrics computed from source data
 *
 * Enterprise-grade metrics engine providing real-time business intelligence.
 * All values are computed from source arrays ensuring single source of truth.
 * Used throughout the application for consistent business data.
 *
 * @example
 * ```typescript
 * import { BUSINESS_METRICS } from '@/data/constants';
 * 
 * // Display dynamic metrics
 * console.log(`Total barbers: ${BUSINESS_METRICS.totalBarbers}`);
 * console.log(`Average rating: ${BUSINESS_METRICS.averageRating}`);
 * 
 * // Use in components
 * const metrics = BUSINESS_METRICS;
 * ```
 *
 * @business-logic
 * - Metrics computed dynamically from barbers and services arrays
 * - Average rating excludes "No ratings" entries for accuracy
 * - Services categorized automatically for better organization
 * - Opening hours available in multiple formats (display + Schema.org)
 * - Validation ensures data consistency across the application
 */
export const BUSINESS_METRICS: BusinessMetrics = BusinessEngine.getMetrics(barbers, services);

/**
 * @constant {BusinessInfo} BUSINESS_INFO
 * @description Core business information with dynamic metrics integration
 *
 * Legacy business constants maintained for backward compatibility.
 * Dynamic metrics available through BUSINESS_METRICS for new implementations.
 * Combines static business data with computed metrics for flexibility.
 *
 * @example
 * ```typescript
 * import { BUSINESS_INFO, BUSINESS_METRICS } from '@/data/constants';
 * 
 * // Static business info
 * <h1>{BUSINESS_INFO.name}</h1>
 * 
 * // Dynamic metrics
 * <span>{BUSINESS_METRICS.totalBarbers} Barbers</span>
 * ```
 *
 * @business-logic
 * - Static info: name, address, phone, coordinates (unchanging)
 * - Dynamic metrics: computed from source arrays (auto-updated)
 * - Supports migration path from static to dynamic patterns
 * - Maintains backward compatibility with existing components
 */
export const BUSINESS_INFO = {
  name: 'The Barber Cave',
  tagline: 'Where Style Meets Excellence',
  description: 'Experience the art of barbering at The Barber Cave. Premium cuts, luxury grooming, and master barbers dedicated to your perfect look.',
  location: 'Dallas, Texas',
  fullLocation: 'Dallas, Texas\nDFW Metro Area',
  address: '1234 Real Street, Dallas, TX 75201',
  phone: '(214) 555-0123',
  rating: String(BUSINESS_METRICS.averageRating),
  totalReviews: '178',
  totalBarbers: String(BUSINESS_METRICS.totalBarbers),
  totalServices: String(BUSINESS_METRICS.totalServices),
  newClientDiscount: '$10',
  coordinates: {
    latitude: '32.7767',
    longitude: '-96.7970'
  },
  openingHours: [
    { days: 'Mon-Fri', hours: '9am–7pm' },
    { days: 'Sat', hours: '9am–6pm' },
    { days: 'Sun', hours: '10am–6pm' }
  ]
} as const;

/**
 * @constant {ExternalLinks} EXTERNAL_LINKS
 * @description External service URLs and social media links
 *
 * Centralized external links used for booking, services, and social media integration.
 * Ensures consistent linking across components and easy maintenance when URLs change.
 * All links include proper security attributes for external navigation.
 *
 * @example
 * ```tsx
 * import { EXTERNAL_LINKS } from '@/data/constants';
 *
 * // Booking button with security attributes
 * <Button
 *   href={EXTERNAL_LINKS.booking}
 *   target="_blank"
 *   rel="noopener noreferrer"
 * >
 *   Book Appointment
 * </Button>
 *
 * // Social media links
 * <a href={EXTERNAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
 *   Follow on Instagram
 * </a>
 * ```
 *
 * @business-logic
 * - Booking and services links integrate with Squire booking platform
 * - Social media URLs verified monthly for accuracy
 * - External links include security attributes to prevent referrer leakage
 */
export const EXTERNAL_LINKS = {
  booking: 'https://getsquire.com/booking/book/the-barber-cave-dallas',
  services: 'https://getsquire.com/discover/barbershop/the-barber-cave-dallas',
  instagram: 'https://www.instagram.com/the_barbercave_',
  facebook: 'https://www.facebook.com/TrillBarberCave/',
  youtube: 'https://www.youtube.com/@TheBarberCave'
} as const;

/**
 * @constant {NavigationItem[]} NAVIGATION_ITEMS
 * @description Main navigation menu structure
 *
 * Defines the primary navigation items used in header navigation and mobile menu.
 * Uses anchor links for smooth scrolling to page sections.
 * Order is optimized for user journey and conversion funnel.
 *
 * @example
 * ```tsx
 * import { NAVIGATION_ITEMS } from '@/data/constants';
 *
 * // Render navigation menu
 * <nav>
 *   {NAVIGATION_ITEMS.map(item => (
 *     <a key={item.href} href={item.href}>
 *       {item.label}
 *     </a>
 *   ))}
 * </nav>
 * ```
 *
 * @business-logic
 * - Navigation order designed for user journey: Services → Barbers → Work → About → Contact
 * - Anchor links enable smooth scrolling to page sections
 * - Limited to 5 items to avoid navigation complexity
 * - Labels are concise but descriptive for mobile navigation
 */
export const NAVIGATION_ITEMS = [
  { href: '#services', label: 'Services' },
  { href: '#barbers', label: 'Barbers' },
  { href: '#work', label: 'Our Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' }
] as const;
