/**
 * @fileoverview Services section component displaying available barber services
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Showcases all barber services with pricing, descriptions, and booking integration.
 * Features responsive grid layout with container queries, special service highlighting,
 * and direct booking links to external booking system.
 */

/**
 * @typedef {Object} Service
 * @property {string} id - Unique identifier for the service
 * @property {string} title - Display name of the service
 * @property {string} description - Detailed description of the service
 * @property {string} price - Formatted price string (e.g., "$25", "$10 OFF")
 * @property {string} duration - Estimated service duration
 * @property {string} icon - Icon name from Lucide React icon set
 */

/**
 * @typedef {Object} ServiceCardProps
 * @property {Service} service - Service data object to display
 */

import { ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { services } from '@/data/services';
import { EXTERNAL_LINKS } from '@/data/constants';
import { Crown, Scissors, Star, Users, Award, Zap, Sparkles, Gem, Heart, Target, Move, Smile, Flower, Diamond, Sun, Moon, RefreshCw, Wind, Droplet, Link, Plus, RotateCcw } from 'lucide-react';
import ContainerQueries from './ContainerQueries';
import SectionHeader from './SectionHeader';
import IconContainer from './IconContainer';
import Button from './Button';
import LinkWithIcon from './LinkWithIcon';

/**
 * @constant {Object<string, React.ComponentType>} iconMap
 * @description Mapping of icon names to Lucide React icon components
 * Used to dynamically render appropriate icons for each service based on service.icon property
 */
const iconMap = {
  Crown,
  Scissors,
  Star,
  Users,
  Award,
  Zap,
  Sparkles,
  Gem,
  Heart,
  Target,
  Move,
  Smile,
  Flower,
  Diamond,
  Sun,
  Moon,
  RefreshCw,
  Wind,
  Droplet,
  Link,
  Plus,
  RotateCcw,
  ChevronRight
};

/**
 * Individual service card component with booking integration.
 * 
 * Displays a single service with icon, title, description, price, and booking button.
 * Features special styling for promotional services and responsive design.
 * 
 * @example
 * ```tsx
 * const haircutService = {
 *   id: 'haircut',
 *   title: 'Classic Haircut',
 *   description: 'Professional haircut with styling',
 *   price: '$25',
 *   duration: '30 min',
 *   icon: 'Scissors'
 * };
 * 
 * <ServiceCard service={haircutService} />
 * ```
 */
const ServiceCard = memo(({ service }: { service: typeof services[0] }) => {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap];
  const isSpecial = service.id === 'new-client-special';
  
  return (
    <div className={`service-card container-card relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
      isSpecial 
        ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {isSpecial && (
        <div className="absolute -top-3 -right-3 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
          POPULAR
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <IconContainer bg={isSpecial ? 'amber' : 'black'}>
          <IconComponent className="w-6 h-6" />
        </IconContainer>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-black">{service.title}</h3>
          <p className="text-gray-600">{service.duration}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">{service.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-black">{service.price}</span>
        <Button
          variant="primary"
          href={EXTERNAL_LINKS.booking}
          target="_blank"
          rel="noopener noreferrer"
          className={isSpecial ? 'bg-amber-500 text-black hover:bg-amber-400' : ''}
        >
          Book Now
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

/**
 * @component
 * @description Main services section component displaying all available barber services
 *
 * Renders a responsive grid of service cards with container queries for optimal layout
 * across different screen sizes. Includes promotional service highlighting and direct
 * booking integration with external booking system.
 *
 * @returns {JSX.Element} Services section with grid layout and booking functionality
 *
 * @example
 * ```tsx
 * import Services from '@/components/Services';
 *
 * function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <Services />
 *       <About />
 *     </main>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With section anchor for navigation
 * <section>
 *   <Services />
 * </section>
 * ```
 *
 * @accessibility
 * - Semantic section element with proper ID for navigation
 * - Screen reader friendly service descriptions
 * - Keyboard accessible booking buttons
 * - High contrast service cards
 *
 * @performance
 * - Memoized components to prevent unnecessary re-renders
 * - Container queries for efficient responsive behavior
 * - Optimized icon loading and rendering
 * - Efficient data mapping without additional processing
 *
 * @dependencies
 * - @/data/services - Static service data
 * - @/data/constants - External links for booking
 * - ContainerQueries - Responsive grid layout
 * - SectionHeader - Consistent section styling
 * - ServiceCard - Individual service display
 *
 * @business-logic
 * - Services are sourced from static data file
 * - Special promotional services get highlighted styling
 * - Booking links redirect to external booking platform
 * - Responsive grid adapts from 1 column to 3 columns
 */
export default memo(function Services() {
  const servicesData = services; // Using static data directly
  
  return (
    <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Services"
            description="Premium grooming services tailored to your style"
          />
          
          <ContainerQueries 
            containerName="services-grid" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container-queries-fallback"
          >
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ContainerQueries>
          
          <div className="text-center mt-12">
            <LinkWithIcon
              href={EXTERNAL_LINKS.services}
              target="_blank"
              rel="noopener noreferrer"
            >
              View All {servicesData.length} Services
            </LinkWithIcon>
          </div>
        </div>
      </section>
  );
});
