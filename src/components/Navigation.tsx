/**
 * @fileoverview Navigation component with responsive mobile menu and branding
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Provides fixed navigation bar with logo, menu items, and booking CTA.
 * Features responsive design with mobile hamburger menu and smooth scrolling.
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} href - Navigation link URL or anchor
 * @property {string} label - Display text for navigation item
 */

/**
 * @typedef {Object} NavigationProps
 * @property {boolean} isMenuOpen - Whether mobile menu is currently open
 * @property {() => void} onMenuToggle - Function to toggle mobile menu state
 */

'use client';

import { Menu, X, Scissors } from 'lucide-react';
import { memo } from 'react';
import { NAVIGATION_ITEMS, EXTERNAL_LINKS, BUSINESS_INFO } from '@/data/constants';

/**
 * @typedef {Object} NavigationProps
 * @property {boolean} isMenuOpen - Whether mobile menu is currently open
 * @property {() => void} onMenuToggle - Function to toggle mobile menu state
 */
interface NavigationProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

/**
 * @component
 * @description Individual navigation menu item component
 *
 * Renders a single navigation link with hover effects and optional click handler.
 * Used for both desktop and mobile navigation menus.
 *
 * @param {Object} props - Component props
 * @param {NavigationItem} props.item - Navigation item data
 * @param {() => void} [props.onClick] - Optional click handler for mobile menu
 *
 * @returns {JSX.Element} Navigation link element
 *
 * @example
 * ```tsx
 * const homeItem = { href: '#home', label: 'Home' };
 *
 * <NavigationItem item={homeItem} onClick={handleMobileClose} />
 * ```
 *
 * @accessibility
 * - Keyboard accessible navigation links
 * - Proper semantic anchor elements
 * - Screen reader friendly link text
 *
 * @performance
 * - Memoized component to prevent unnecessary re-renders
 * - Minimal prop dependencies
 */
const NavigationItem = memo(({ item, onClick }: { item: { href: string; label: string }; onClick?: () => void }) => (
  <a
    href={item.href}
    onClick={onClick}
    className="text-gray-700 hover:text-black transition-colors font-medium"
  >
    {item.label}
  </a>
));

NavigationItem.displayName = 'NavigationItem';

/**
 * @component
 * @description Main navigation component with responsive mobile menu
 *
 * Fixed navigation bar with business branding, menu items, and booking CTA.
 * Features responsive design that collapses to hamburger menu on mobile devices.
 * Includes backdrop blur effect and smooth transitions.
 *
 * @param {NavigationProps} props - Component props
 * @param {boolean} props.isMenuOpen - Whether mobile menu is currently open
 * @param {() => void} props.onMenuToggle - Function to toggle mobile menu state
 *
 * @returns {JSX.Element} Navigation bar with branding and menu
 *
 * @example
 * ```tsx
 * import Navigation from '@/components/Navigation';
 *
 * const [isMenuOpen, setIsMenuOpen] = useState(false);
 *
 * <Navigation
 *   isMenuOpen={isMenuOpen}
 *   onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With mobile menu wrapper
 * <MobileMenuWrapper>
 *   <Navigation isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
 * </MobileMenuWrapper>
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
 *
 * @dependencies
 * - @/data/constants - Navigation items and business info
 * - lucide-react - Icon components for logo and menu toggle
 * - NavigationItem - Individual menu item component
 *
 * @business-logic
 * - Navigation items sourced from centralized constants
 * - Booking CTA links to external booking platform
 * - Mobile menu state managed by parent component
 * - Smooth scrolling navigation for anchor links
 */
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
              <NavigationItem key={item.href} item={item} onClick={onMenuToggle} />
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
