import { BUSINESS_INFO } from '@/data/constants';
import Image from 'next/image';

export default function About() {
  const businessInfo = BUSINESS_INFO;
  
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">The Barber Cave Experience</h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Located in the heart of Dallas, The Barber Cave isn't just a barbershop—it's a destination 
                where craftsmanship meets community. With {businessInfo.totalReviews} five-star reviews and a team of {businessInfo.totalBarbers} master barbers, 
                we've established ourselves as Dallas' premier grooming destination.
              </p>
              <p>
                Our barbers specialize in everything from classic cuts to modern fades, luxury shaves to 
                complete grooming transformations. We offer {businessInfo.totalServices} specialized services to ensure every client 
                leaves looking and feeling their absolute best.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.rating}/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalBarbers}+</div>
                <div className="text-gray-600">Expert Barbers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black mb-2">{businessInfo.totalServices}</div>
                <div className="text-gray-600">Services</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
              <Image 
                src="/images/about/shop-interior.svg"
                alt="The Barber Cave Interior"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
