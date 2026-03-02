'use client';

import { Menu, X, Scissors } from 'lucide-react';
import { memo } from 'react';
import { NAVIGATION_ITEMS, EXTERNAL_LINKS, BUSINESS_INFO } from '@/data/constants';

interface NavigationProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const NavigationItem = memo(({ item }: { item: { href: string; label: string } }) => (
  <a
    href={item.href}
    className="text-gray-700 hover:text-black transition-colors font-medium"
  >
    {item.label}
  </a>
));

NavigationItem.displayName = 'NavigationItem';

export default memo(function Navigation({ isMenuOpen, onMenuToggle }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">{BUSINESS_INFO.name}</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.href} item={item} />
            ))}
            <a 
              href={EXTERNAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100">
          <div className="px-6 py-4 space-y-3">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.href} item={item} />
            ))}
            <a 
              href={EXTERNAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium text-center"
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </nav>
  );
});
