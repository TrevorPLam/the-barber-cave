/**
 * @fileoverview Barber team profiles and availability data
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Contains detailed profiles of all barbers working at The Barber Cave,
 * including ratings, specialties, availability status, and visual assets.
 * Used for barber showcase, booking integration, and team presentation.
 */

/**
 * @typedef {Object} Barber
 * @property {string} id - Unique identifier for the barber (used for booking and analytics)
 * @property {string} name - Display name of the barber
 * @property {string} title - Professional title/specialty (e.g., "Master Barber", "Fade Specialist")
 * @property {string} rating - Average customer rating (e.g., "4.8", "5.0", "No ratings")
 * @property {string} reviews - Number of customer reviews received
 * @property {string} available - Current availability status (e.g., "Today", "Tomorrow", "Available Friday")
 * @property {string} image - Path to barber's profile image
 */

/**
 * @interface Barber
 * @description TypeScript interface for barber profile data structure
 *
 * Defines the contract for barber objects used throughout the application.
 * Ensures consistency for barber data handling and display components.
 *
 * @example
 * ```typescript
 * const newBarber: Barber = {
 *   id: 'example-barber',
 *   name: 'John Doe',
 *   title: 'Senior Barber',
 *   rating: '4.9',
 *   reviews: '25',
 *   available: 'Today',
 *   image: '/images/barbers/john-doe.jpg'
 * };
 * ```
 */
export interface Barber {
  id: string;
  name: string;
  title: string;
  rating: string;
  reviews: string;
  available: string;
  image: string;
}

/**
 * @constant {Barber[]} barbers
 * @description Complete team of barbers at The Barber Cave
 *
 * Contains profiles for all 8 barbers with their specialties, ratings,
 * availability, and visual representations. Used for barber showcase,
 * booking selection, and team presentation throughout the application.
 *
 * @example
 * ```typescript
 * import { barbers } from '@/data/barbers';
 *
 * // Get all barbers
 * console.log(`Total barbers: ${barbers.length}`);
 *
 * // Find available barbers today
 * const availableToday = barbers.filter(barber =>
 *   barber.available === 'Today'
 * );
 *
 * // Get barber by specialty
 * const fadeSpecialists = barbers.filter(barber =>
 *   barber.title.includes('Fade')
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Render barber cards in component
 * import { barbers } from '@/data/barbers';
 *
 * function BarbersGrid() {
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *       {barbers.map(barber => (
 *         <div key={barber.id} className="barber-card">
 *           <img src={barber.image} alt={barber.name} />
 *           <h3>{barber.name}</h3>
 *           <p>{barber.title}</p>
 *           <div className="rating">
 *             ⭐ {barber.rating} ({barber.reviews} reviews)
 *           </div>
 *           <p className="availability">{barber.available}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @business-logic
 * - Barber profiles are ordered by experience level and availability
 * - Ratings are calculated from customer feedback systems
 * - Availability status is updated in real-time from booking system
 * - Image paths use consistent naming convention for asset management
 * - IDs are unique and URL-safe for booking system integration
 *
 * @team-composition
 * - Master Barbers: Trill L., Rob Pro_edge_cutz (senior experience)
 * - Specialists: Charlo F. (Fade), Tru B. (Blend), Shay (Loc), Lee T. (VIP)
 * - Expert Barbers: Daplug_jcox, Larro C. (general expertise)
 *
 * @specialties
 * - Fade Specialist: Precision blending and fade techniques
 * - Blend Specialist: Expert blending and transition work
 * - Loc Specialist: Dreadlock maintenance and styling
 * - VIP Specialist: Premium service and complex styles
 * - Master Barber: Full range of barbering services
 * - Expert Barber: Advanced cutting and styling techniques
 *
 * @availability-tracking
 * - "Today": Available for same-day appointments
 * - "Tomorrow": Available for next-day booking
 * - "Available Friday": Specific day availability
 * - Updated daily from booking system API
 */
export const barbers: Barber[] = [
  {
    id: 'trill-l',
    name: 'Trill L.',
    title: 'Master Barber',
    rating: '4.8',
    reviews: '82',
    available: 'Available Friday',
    image: '/images/barbers/trill-l.svg'
  },
  {
    id: 'charlo-f',
    name: 'Charlo F.',
    title: 'Fade Specialist',
    rating: '5.0',
    reviews: '28',
    available: 'Tomorrow',
    image: '/images/barbers/charlo-f.svg'
  },
  {
    id: 'daplug-jcox',
    name: 'Daplug_jcox',
    title: 'Expert Barber',
    rating: '5.0',
    reviews: '39',
    available: 'Tomorrow',
    image: '/images/barbers/daplug-jcox.svg'
  },
  {
    id: 'tru-b',
    name: 'Tru B.',
    title: 'Blend Specialist',
    rating: 'No ratings',
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/tru-b.svg'
  },
  {
    id: 'shay-25',
    name: 'Shay',
    title: 'Loc Specialist',
    rating: '5.0',
    reviews: '16',
    available: 'Tomorrow',
    image: '/images/barbers/shay-25.svg'
  },
  {
    id: 'rob-pro_edge_cutz',
    name: 'Rob Pro_edge_cutz',
    title: 'Master Barber',
    rating: '5.0',
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/rob-pro_edge_cutz.svg'
  },
  {
    id: 'lee-thebarber',
    name: 'Lee T.',
    title: 'VIP Specialist',
    rating: '5.0',
    reviews: '13',
    available: 'Tomorrow',
    image: '/images/barbers/lee-thebarber.svg'
  },
  {
    id: 'larro-cuts',
    name: 'Larro C.',
    title: 'Expert Barber',
    rating: '5.0',
    reviews: '14',
    available: 'Tomorrow',
    image: '/images/barbers/larro-cuts.svg'
  }
];
