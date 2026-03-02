import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Replace with actual shop photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40">
        <img 
          src="https://images.unsplash.com/photo-1583947581925-7cbff5e7323d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="The Barber Cave Interior"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            DALLAS • PREMIER BARBER DESTINATION
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Where Style Meets
          <span className="block text-amber-400">Excellence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          {BUSINESS_INFO.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href={EXTERNAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Book Your Appointment
          </a>
          <a 
            href="#work" 
            className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            View Our Work
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{BUSINESS_INFO.rating}</div>
            <div className="text-sm text-gray-300">{BUSINESS_INFO.totalReviews} Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{BUSINESS_INFO.totalBarbers}</div>
            <div className="text-sm text-gray-300">Expert Barbers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{BUSINESS_INFO.totalServices}</div>
            <div className="text-sm text-gray-300">Services</div>
          </div>
        </div>
      </div>
    </section>
  );
}
