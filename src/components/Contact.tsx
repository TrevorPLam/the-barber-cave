import { MapPin, Phone, Clock } from 'lucide-react';
import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Visit The Cave</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready for your transformation? Book your appointment with one of our master barbers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-gray-300 whitespace-pre-line">{BUSINESS_INFO.fullLocation}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Book Online</h3>
            <p className="text-gray-300 mb-4">Available 24/7</p>
            <a 
              href={EXTERNAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Schedule Now →
            </a>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Flexible Hours</h3>
            <p className="text-gray-300">Daily appointments<br />Early morning & evening available</p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href={EXTERNAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Book Your Appointment Now
          </a>
          <p className="text-gray-400 mt-4">New clients get {BUSINESS_INFO.newClientDiscount} off their first service!</p>
        </div>
      </div>
    </section>
  );
}
