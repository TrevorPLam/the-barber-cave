/**
 * @fileoverview Barber services data and type definitions
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Contains comprehensive barber service offerings with pricing, descriptions,
 * durations, and icon mappings. Used throughout the application for service
 * displays, booking integration, and business logic.
 */

/**
 * @typedef {Object} Service
 * @property {string} id - Unique identifier for the service (used for booking and analytics)
 * @property {string} title - Display name of the service
 * @property {string} description - Detailed description of what the service includes
 * @property {string} price - Formatted price string for display (e.g., "$50", "$40-$60", "$10 OFF")
 * @property {number} [priceMin] - Minimum price in USD for Schema.org PriceSpecification (numeric only)
 * @property {number} [priceMax] - Maximum price in USD for Schema.org PriceSpecification (numeric only)
 * @property {string} duration - Estimated service duration (e.g., "1 hour", "45 min")
 * @property {string} icon - Icon name from Lucide React for visual representation
 */

/**
 * @interface Service
 * @description TypeScript interface for barber service data structure
 *
 * Defines the contract for service objects used throughout the application.
 * Supports both display strings and structured numeric prices for Schema.org compliance.
 *
 * @example
 * ```typescript
 * const newService: Service = {
 *   id: 'example-service',
 *   title: 'Example Service',
 *   description: 'Service description',
 *   price: '$50',
 *   priceMin: 50,
 *   priceMax: 50,
 *   duration: '1 hour',
 *   icon: 'Scissors'
 * };
 *
 * // For price ranges
 * const rangeService: Service = {
 *   id: 'range-service',
 *   title: 'Range Service',
 *   description: 'Service with price range',
 *   price: '$40-$60',
 *   priceMin: 40,
 *   priceMax: 60,
 *   duration: '45 min',
 *   icon: 'Star'
 * };
 * ```
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  priceMin?: number;
  priceMax?: number;
  duration: string;
  icon: string;
  category?: string;
  popular?: boolean;
  note?: string;
}

/**
 * @constant {Service[]} services
 * @description Complete catalog of barber services offered at The Barber Cave
 *
 * Contains all 28 available services with comprehensive details for display,
 * booking integration, and business operations. Services are ordered by
 * popularity and complexity, with promotional services highlighted.
 *
 * @example
 * ```typescript
 * import { services } from '@/data/services';
 *
 * // Get all services
 * console.log(`Total services: ${services.length}`);
 *
 * // Find premium services
 * const premiumServices = services.filter(service =>
 *   service.price.includes('$100') || service.price.includes('$120')
 * );
 *
 * // Get service by ID
 * const haircutService = services.find(service => service.id === 'mens-haircut');
 * ```
 *
 * @example
 * ```tsx
 * // Render services in component
 * import { services } from '@/data/services';
 *
 * function ServicesList() {
 *   return (
 *     <div>
 *       {services.map(service => (
 *         <div key={service.id}>
 *           <h3>{service.title}</h3>
 *           <p>{service.description}</p>
 *           <span>{service.price}</span>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @business-logic
 * - Services are ordered by popularity and service complexity
 * - Promotional services (new-client-special) get special UI treatment
 * - Pricing includes ranges for variable services (e.g., bald & bearded)
 * - Duration estimates are conservative to manage customer expectations
 * - Icon assignments correspond to Lucide React icon names
 * - Service IDs are URL-safe and used for booking system integration
 *
 * @pricing-strategy
 * - Premium services: $80-$120 (Ultimate Grooming, Presidential, Trill Sophisticated)
 * - Standard services: $40-$70 (Haircuts, Bald & Bearded packages)
 * - Basic services: $25-$40 (Edge ups, Beard lineups)
 * - Promotional: $10 OFF (New client discount)
 * - Specialty: $75-$115 (Loc services, Women's cuts, VIP)
 *
 * @service-categories
 * - Haircuts: Men's cuts with/without beard services
 * - Bald & Bearded: Specialized head shaving and beard grooming
 * - Premium Packages: Multi-service luxury experiences
 * - Loc Services: Dreadlock maintenance and styling
 * - Specialty: Women's cuts, kids cuts, after-hours
 * - Promotional: New client discounts and specials
 */
export const services: Service[] = [
  {
    id: 'ultimate-grooming',
    title: 'Ultimate Grooming (with beard)',
    description: 'Deep cleanse exfoliating facial, shampoo, beard wash, haircut of choice, magic drip',
    price: '$100',
    priceMin: 100,
    priceMax: 100,
    duration: '2 hours',
    icon: 'Crown'
  },
  {
    id: 'presidential-service',
    title: 'Presidential Service (no beard)',
    description: 'Deep cleanse hot towel Facial, shampoo, haircut of choice, magic drip, razor, enhancements (if you have a beard please book ultimate grooming service)',
    price: '$80',
    priceMin: 80,
    priceMax: 80,
    duration: '1.5 hours',
    icon: 'Scissors'
  },
  {
    id: 'bald-bearded-deluxe',
    title: 'Bald & Bearded DELUXE',
    description: 'Warm lather hot towel head razor shave, beard wash, lining and shaping for the complete look',
    price: '$50-$70',
    priceMin: 50,
    priceMax: 70,
    duration: '1 hour',
    icon: 'Star'
  },
  {
    id: 'bald-bearded-standard',
    title: 'Bald & Bearded STANDARD',
    description: 'Clipper head shave & hot towel razor beard lining & shaping',
    price: '$40-$55',
    priceMin: 40,
    priceMax: 55,
    duration: '45 min',
    icon: 'Zap'
  },
  {
    id: 'mens-haircut',
    title: "Men's Haircut",
    description: 'Professional haircut without beard service, precision cutting and styling',
    price: '$40-$60',
    priceMin: 40,
    priceMax: 60,
    duration: '45-60 min',
    icon: 'Users'
  },
  {
    id: 'haircut-beard',
    title: 'Men\'s Haircut with Beard',
    description: 'Complete service including haircut and beard grooming with or without enhancements',
    price: '$45-$65',
    priceMin: 45,
    priceMax: 65,
    duration: '60-75 min',
    icon: 'Award'
  },
  {
    id: 'haircut-beard-wash',
    title: 'Men\'s Haircut with Beard Wash & grooming',
    description: 'Haircut with beard wash, line up, products & enhancements',
    price: '$50-$65',
    priceMin: 50,
    priceMax: 65,
    duration: '1-1.25 hours',
    icon: 'Sparkles'
  },
  {
    id: 'new-client-special',
    title: 'New Client Special $10 Off',
    description: '$10 off any service except edge ups. Price will be adjusted in person. 1st timers only!',
    price: '$10 OFF',
    // Special pricing, no numeric min/max
    duration: 'First visit',
    icon: 'ChevronRight'
  },
  {
    id: 'trill-sophisticated',
    title: 'Trill Sophisticated Package',
    description: 'Shampoo, Haircut, Hot Towel & Lather Razor Line Up & Mustache/Goatee, Enhancements, Exfoliating Facial and Massage',
    price: '$100',
    priceMin: 100,
    priceMax: 100,
    duration: '1.25 hours',
    icon: 'Gem'
  },
  {
    id: 'trill-sophisticated-beard',
    title: 'Trill Sophisticated Package W/ Beard',
    description: 'Shampoo, Haircut, Hot Towel & Lather Razor Line Up, Beard Wash, Beard Hot Comb, Enhancements, Exfoliating Facial and Massage',
    price: '$120',
    priceMin: 120,
    priceMax: 120,
    duration: '1.5 hours',
    icon: 'Crown'
  },
  {
    id: 'beard-grooming-facial',
    title: 'Beard Grooming + Facial Mask',
    description: 'Beard grooming with facial mask treatment',
    price: '$40',
    priceMin: 40,
    priceMax: 40,
    duration: '45 min',
    icon: 'Heart'
  },
  {
    id: 'edge-up-only',
    title: 'Edge Up hairline ONLY',
    description: 'Edge up hair & neck line only',
    price: '$25-$30',
    priceMin: 25,
    priceMax: 30,
    duration: '30 min',
    icon: 'Target',
    category: 'express',
    popular: false
  },
  {
    id: 'beard-lineup',
    title: 'Beard Line up (no wash)',
    description: 'Beard Line up only hot towel treatment with razor & enhancements',
    price: '$30-$40',
    priceMin: 30,
    priceMax: 40,
    duration: '30 min',
    icon: 'Move',
    category: 'express',
    popular: false
  },
  {
    id: 'kids-haircut',
    title: 'Kids Haircut',
    description: 'Professional haircut for children K-17',
    price: '$30',
    priceMin: 30,
    priceMax: 30,
    duration: '30 min',
    icon: 'Smile',
    category: 'kids',
    popular: false
  },
  {
    id: 'womens-haircut',
    title: 'Women\'s haircut',
    description: 'Professional women\'s haircut service',
    price: '$50',
    priceMin: 50,
    priceMax: 50,
    duration: '1 hour',
    icon: 'Flower',
    category: 'women',
    popular: false
  },
  {
    id: 'loc-retwist',
    title: 'Loc Retwist',
    description: 'Professional loc retwisting service',
    price: '$75',
    priceMin: 75,
    priceMax: 75,
    duration: '1 hour',
    icon: 'RefreshCw',
    category: 'loc',
    popular: false
  },
  {
    id: 'loc-retwist-style',
    title: 'Loc Retwist/Style',
    description: 'Loc retwist with styling service',
    price: '$85',
    priceMin: 85,
    priceMax: 85,
    duration: '1h 15min',
    icon: 'Sparkles',
    category: 'loc',
    popular: false
  },
  {
    id: 'loc-detox',
    title: 'Loc Detox',
    description: 'Deep cleansing loc detox treatment',
    price: '$40',
    priceMin: 40,
    priceMax: 40,
    duration: '30 min',
    icon: 'Wind',
    category: 'loc',
    popular: false
  },
  {
    id: 'loc-bleach',
    title: 'Loc Bleach (Semi Color On Ends)',
    description: 'Semi color application on loc ends',
    price: '$75',
    priceMin: 75,
    priceMax: 75,
    duration: '2 hours',
    icon: 'Droplet',
    category: 'loc',
    popular: false
  },
  {
    id: 'loc-retie-interlock',
    title: 'Loc retie/interlock',
    description: 'Loc retie/interlock service - price varies by loc size',
    price: '$85+',
    priceMin: 85,
    priceMax: undefined,
    duration: '1h 30min',
    icon: 'Link',
    category: 'loc',
    popular: false
  },
  {
    id: 'starter-locks',
    title: 'Starter Locks',
    description: 'Professional starter loc installation',
    price: '$85',
    priceMin: 85,
    priceMax: 85,
    duration: '1 hour',
    icon: 'Plus',
    category: 'loc',
    popular: false
  },
  {
    id: 'two-strand-twist',
    title: '2 Strand Twist with shampoo',
    description: 'Two-strand twist with shampoo service',
    price: '$85',
    priceMin: 85,
    priceMax: 85,
    duration: '1h 15min',
    icon: 'RotateCcw',
    category: 'twist',
    popular: false
  },
  {
    id: 'two-strand-twist-blowout',
    title: '2 strand twist with shampoo and blow out',
    description: 'Two-strand twist with shampoo and blowout styling',
    price: '$115',
    priceMin: 115,
    priceMax: 115,
    duration: '2h 15min',
    icon: 'Wind'
  }
];
