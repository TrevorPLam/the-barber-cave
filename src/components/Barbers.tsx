import { ChevronRight, Star } from 'lucide-react';
import { barbers } from '@/data/barbers';
import { EXTERNAL_LINKS } from '@/data/constants';
import { getBarbersData } from '@/utils/cached-barbers';
import ContainerQueries from './ContainerQueries';
import Image from 'next/image';

export default function Barbers() {
  const barbersData = barbers.map((barber, index) => ({
    ...barber,
    image: `/images/barbers/barber-${(index % 1) + 1}.svg` // Use barber-1.svg for all barbers temporarily
  }));
  
  return (
    <section id="barbers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Master Barbers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our team of expert barbers, each with their own unique style and expertise
          </p>
        </div>
        
        <ContainerQueries 
          containerName="barber-grid" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 container-queries-fallback"
        >
          {barbersData.map((barber) => (
            <div key={barber.id} className="barber-card text-center group container-card">
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-200 aspect-square">
                <Image 
                  src={barber.image}
                  alt={barber.name}
                  fill
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
        </ContainerQueries>
        
        <div className="text-center mt-12">
          <a 
            href={EXTERNAL_LINKS.services}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-black hover:text-amber-500 font-semibold transition-colors"
          >
            Meet All {barbersData.length} Barbers
            <ChevronRight className="h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
