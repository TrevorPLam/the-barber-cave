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
 * - Focus management for mobile menu with focus trap
 * - Escape key closes mobile menu
 * - Outside-click closes mobile menu
 * - WCAG 2.1 AA compliant keyboard navigation
 * 
 * @performance
 * - Fixed positioning prevents layout shifts
 * - Backdrop blur for premium visual effect
 * - Memoized components prevent unnecessary re-renders
 * - Efficient event listeners with proper cleanup
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import Scissors from 'lucide-react/dist/esm/icons/scissors';
import User from 'lucide-react/dist/esm/icons/user';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import { memo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Focus trap implementation for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key closes menu
      if (event.key === 'Escape') {
        event.preventDefault();
        handleMenuClose();
        mobileMenuButtonRef.current?.focus();
        return;
      }

      // Tab navigation within menu
      if (event.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        handleMenuClose();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    // Focus first menu item when menu opens
    const firstFocusableElement = mobileMenuRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (firstFocusableElement) {
      // Small delay to ensure DOM is ready
      setTimeout(() => firstFocusableElement.focus(), 10);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100" role="banner">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <a href="#home" className="flex items-center space-x-3" aria-label={`${BUSINESS_INFO.name} - Back to home`}>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-black">{BUSINESS_INFO.name}</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.href} item={item} />
            ))}
            
            {/* Authentication Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
                <span>Sign in</span>
              </button>
            )}
            
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
            ref={mobileMenuButtonRef}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-b border-gray-100"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-button"
        >
          <div className="px-6 py-4 space-y-3">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.href} item={item} onClick={handleMenuClose} />
            ))}
            
            {/* Mobile Authentication */}
            <div className="border-t border-gray-200 pt-3">
              {status === 'loading' ? (
                <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
              ) : session ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{session.user?.name || session.user?.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      handleMenuClose();
                    }}
                    className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-black transition-colors py-2"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    handleMenuClose();
                  }}
                  className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-black transition-colors py-2"
                  aria-label="Sign in"
                >
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </button>
              )}
            </div>
            
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
    </header>
  );
});
