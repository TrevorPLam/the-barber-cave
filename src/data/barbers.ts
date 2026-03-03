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
  rating: string | null;
  reviews: string;
  available: string;
  image: string;
  specialties?: string[];
  achievements?: string[];
  instagram?: string;
  facebook?: string;
  personalBrand?: string;
  availability?: string;
  vipContact?: string;
  upcomingEvent?: string;
  spotify?: string;
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
    id: 'trill-ladibarber',
    name: 'Trill LadiBarber',
    title: 'Owner, Master Barber, SMP Artist',
    rating: '4.8',
    reviews: '82',
    available: 'Available Friday',
    image: '/images/barbers/trill-l.svg',
    specialties: ['Scalp Micropigmentation', 'Master Barber Services', 'Product Development'],
    achievements: ['Social Media Influencer of the Year', 'Featured in Krave Magazine'],
    instagram: '@trill_ladibarber91'
  },
  {
    id: 'lee-the-barber',
    name: 'Lee the Barber',
    title: 'VIP Services, Top Promoter',
    rating: '5.0',
    reviews: '13',
    available: 'Tomorrow',
    image: '/images/barbers/lee-thebarber.svg',
    specialties: ['VIP Monday Service', 'Brand Ambassador'],
    achievements: ['Award-winning barber', '#REDPRO, #MenbyGR, #Groomane ambassador'],
    instagram: '@lee_dabarber85',
    vipContact: '601-629-8972',
    upcomingEvent: 'Competing in "SHES MY BARBER 2026" - March 29, 2026'
  },
  {
    id: 'rob-pro-edge',
    name: 'Rob P (Pro Edge)',
    title: 'Precision Cuts',
    rating: '5.0',
    reviews: '16',
    available: 'Today',
    image: '/images/barbers/rob-pro-edge-cut.svg',
    specialties: ['Precision Cuts', 'Perfect 5.0 Rating'],
    achievements: ['Highest rating on team', 'Perfect 5.0 stars'],
    instagram: '@proedgecutz',
    availability: 'Tuesdays only'
  },
  {
    id: 'shay-the-barber',
    name: 'Shay the Barber',
    title: 'Locs Specialist, Kids Cuts',
    rating: '5.0',
    reviews: '16',
    available: 'Tomorrow',
    image: '/images/barbers/shay-25.svg',
    specialties: ['Locs maintenance', 'Kids haircuts', 'Diverse styling'],
    achievements: ['5.0 stars on Squire'],
    instagram: '@shaythebarber',
    personalBrand: '#katchingfadez',
    availability: 'Wednesdays only'
  },
  {
    id: 'charlofadez',
    name: 'Charlo (Charlofadez)',
    title: 'Precision Fades, Blades',
    rating: '5.0',
    reviews: '28',
    available: 'Tomorrow',
    image: '/images/barbers/charlo-f.svg',
    specialties: ['Premium fade work', 'Blade specialist'],
    achievements: ['Featured in "Barber Cave Chronicles"'],
    instagram: '@charlofadez',
    personalBrand: '#charlofadez',
    availability: 'Tue-Sat by appointment'
  },
  {
    id: 'tru-blendz',
    name: 'Tru Blendz',
    title: 'Sharp Lineups, Blends',
    rating: null,
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/tru-b.svg',
    specialties: ['Sharp lineups', 'Blends'],
    achievements: ['Newer team member'],
    instagram: '@tr.u_blendz'
  },
  {
    id: 'daplug-jcox',
    name: 'Daplug JCox',
    title: 'Veteran Barber',
    rating: '5.0',
    reviews: '39',
    available: 'Tomorrow',
    image: '/images/barbers/daplug-jcox.svg',
    specialties: ['20+ years experience', 'Old-school techniques'],
    achievements: ['Most experienced on team'],
    instagram: '@daplug_jcox',
    availability: 'Tue-Sat'
  },
  {
    id: 'dee-kutt-punisha',
    name: 'Dee Kutt-Punisha',
    title: 'Design/SMP Specialist',
    rating: null,
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/dee-kutt-punisha.svg',
    specialties: ['Complex designs', 'SMP backup'],
    achievements: ['SMP assistant to Trill'],
    instagram: '@kutt_punisha'
  },
  {
    id: 'jay-will-special',
    name: 'Jay Will Special',
    title: 'Barber & Music Artist',
    rating: null,
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/jay-will-special.svg',
    specialties: ['Music industry connections', 'Creative energy'],
    achievements: ['Spotify artist (42 monthly listeners)', 'Co-hosts barber battles'],
    instagram: '@jaywillspecial',
    spotify: '42 monthly listeners, 492 followers',
    availability: 'Open 7 days, walk-ins welcome'
  },
  {
    id: 'so-pretty-porter',
    name: 'So Pretty Porter',
    title: 'Stylist',
    rating: null,
    reviews: '0',
    available: 'Today',
    image: '/images/barbers/so-pretty-porter.svg',
    specialties: ['Styling services'],
    achievements: ['Books exclusively via Squire'],
    facebook: 'So.PrEtTy.PoRtEr'
  }
];
