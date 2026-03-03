import { ChevronRight, Star } from 'lucide-react';
import { barbers } from '@/data/barbers';
import { EXTERNAL_LINKS } from '@/data/constants';
import Image from 'next/image';
import SectionHeader from './SectionHeader';
import LinkWithIcon from './LinkWithIcon';

export default function Barbers() {
  // TODO: Replace with unique barber photos when available
  // Currently all barbers use the same placeholder image
  // Future: Add individual photos for each barber to showcase their work
  const barbersData = barbers;
  
  return (
    <section id="barbers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="Master Barbers"
          description="Meet our team of expert barbers, each with their own unique style and expertise"
        />
        
        <div 
          style={{ containerType: 'inline-size' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {barbersData.map((barber) => (
            <div key={barber.id} className="barber-card text-center group container-card">
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-200 aspect-square">
                <Image 
                  src={barber.image}
                  alt={barber.name}
                  fill
                  placeholder="blur"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-green-600 font-semibold">Available {barber.available}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-1">{barber.name}</h3>
              <p className="text-gray-600 mb-2">{barber.title}</p>
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-4 w-4 text-amber-500 fill-current" />
                <span className="text-sm font-semibold">
                  {barber.rating === 'No ratings' ? 'New' : barber.rating}
                </span>
                <span className="text-sm text-gray-500">
                  {barber.reviews === '0' ? '' : `(${barber.reviews})`}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <LinkWithIcon
            href={EXTERNAL_LINKS.services}
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet All {barbersData.length} Barbers
          </LinkWithIcon>
        </div>
      </div>
    </section>
  );
}
