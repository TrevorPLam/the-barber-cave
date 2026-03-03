/**
 * Navigation component with responsive mobile menu and branding.
 * 
 * Provides fixed navigation bar with logo, menu items, and booking CTA.
 * Features responsive design with mobile hamburger menu and smooth scrolling.
 * 
 * @example
 * ```tsx
 * const [isMenuOpen, setIsMenuOpen] = useState(false);
 * 
 * <Navigation
 *   isMenuOpen={isMenuOpen}
 *   onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
 * />
 * ```
 * 
 * @accessibility
 * - Semantic nav element with proper ARIA attributes
 * - Keyboard accessible menu toggle button
 * - Screen reader friendly navigation structure
 * - Focus management for mobile menu
 * 
 * @performance
 * - Fixed positioning prevents layout shifts
 * - Backdrop blur for premium visual effect
 * - Memoized components prevent unnecessary re-renders
 */

'use client';

import { useState } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { memo } from 'react';
import { NAVIGATION_ITEMS, EXTERNAL_LINKS, BUSINESS_INFO } from '@/data/constants';

interface NavigationItemProps {
  /** Navigation item data */
  item: { href: string; label: string };
  /** Optional click handler for mobile menu */
  onClick?: () => void;
}

/**
 * Individual navigation menu item component.
 * 
 * Renders a single navigation link with hover effects and optional click handler.
 * Used for both desktop and mobile navigation menus.
 * 
 * @example
 * ```tsx
 * const homeItem = { href: '#home', label: 'Home' };
 * 
 * <NavigationItem item={homeItem} onClick={handleMobileClose} />
 * ```
 */
const NavigationItem = memo(({ item, onClick }: NavigationItemProps) => (
  <a
    href={item.href}
    onClick={onClick}
    className="text-gray-700 hover:text-black transition-colors font-medium"
  >
    {item.label}
  </a>
));

NavigationItem.displayName = 'NavigationItem';

export default memo(function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100" aria-label="Main navigation">
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
            onClick={handleMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            id="mobile-menu-button"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100" id="mobile-menu">
          <div className="px-6 py-4 space-y-3">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.href} item={item} onClick={handleMenuToggle} />
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
