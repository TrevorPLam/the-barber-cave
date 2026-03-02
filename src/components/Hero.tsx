import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';
import { P3Gradient } from './P3Color';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Replace with actual shop photo */}
      <P3Gradient 
        className="absolute inset-0"
        from="color(display-p3 0 0 0 / 0.6)"
        to="color(display-p3 0 0 0 / 0.4)"
      >
        <Image 
          src="/images/hero/hero-bg.svg"
          alt="The Barber Cave Interior"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </P3Gradient>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
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
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href={EXTERNAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--accent-bright)',
              color: 'var(--foreground)',
              boxShadow: '0 4px 12px color(display-p3 0.831 0.647 0.455 / 0.4)',
            }}
          >
            Book Your Appointment
          </a>
          <a 
            href="#work" 
            className="border-2 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            style={{
              borderColor: 'var(--background)',
              color: 'var(--background)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--background)';
            }}
          >
            View Our Work
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{
                color: 'var(--accent-bright)',
                textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
              }}
            >
              {BUSINESS_INFO.rating}
            </div>
            <div 
              className="text-sm"
              style={{
                color: 'color(display-p3 0.878 0.878 0.878)',
              }}
            >
              {BUSINESS_INFO.totalReviews} Reviews
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{
                color: 'var(--accent-bright)',
                textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
              }}
            >
              {BUSINESS_INFO.totalBarbers}
            </div>
            <div 
              className="text-sm"
              style={{
                color: 'color(display-p3 0.878 0.878 0.878)',
              }}
            >
              Expert Barbers
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{
                color: 'var(--accent-bright)',
                textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
              }}
            >
              {BUSINESS_INFO.totalServices}
            </div>
            <div 
              className="text-sm"
              style={{
                color: 'color(display-p3 0.878 0.878 0.878)',
              }}
            >
              Services
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
