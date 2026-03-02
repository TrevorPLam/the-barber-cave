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
