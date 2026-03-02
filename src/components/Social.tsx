import { Instagram, Facebook, Youtube } from 'lucide-react';
import { EXTERNAL_LINKS } from '@/data/constants';

export default function Social() {
  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-black mb-4">Follow The Cave</h3>
          <p className="text-gray-600">Join our community for styles, tips, and behind-the-scenes content</p>
        </div>
        <div className="flex justify-center space-x-6">
          <a 
            href={EXTERNAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            aria-label="Follow on Instagram"
          >
            <Instagram className="h-6 w-6 text-white" />
          </a>
          <a 
            href={EXTERNAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            aria-label="Follow on Facebook"
          >
            <Facebook className="h-6 w-6 text-white" />
          </a>
          <a 
            href={EXTERNAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            aria-label="Subscribe on YouTube"
          >
            <Youtube className="h-6 w-6 text-white" />
          </a>
        </div>
      </div>
    </section>
  );
}
