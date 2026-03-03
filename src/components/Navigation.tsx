/**
 * Navigation component with responsive mobile menu and branding.
 *
 * Provides fixed navigation bar with logo, menu items, and booking CTA.
 * Features responsive design with mobile hamburger menu and smooth scrolling.
 *
 * @example
 * ```tsx
 * <Navigation />
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
 * - Memoized sub-components prevent unnecessary re-renders
 * - Efficient event listeners with proper cleanup
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { NAVIGATION_ITEMS, EXTERNAL_LINKS, BUSINESS_INFO } from '@/data/constants';
import NavigationBrand from './Navigation/NavigationBrand';
import DesktopNavigation from './Navigation/DesktopNavigation';
import MobileMenuButton from './Navigation/MobileMenuButton';
import MobileNavigation from './Navigation/MobileNavigation';

export default memo(function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();

  const handleMenuToggle = () => setIsMenuOpen((open) => !open);
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  // Focus trap implementation for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleMenuClose();
        mobileMenuButtonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
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

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    const firstFocusable = mobileMenuRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 10);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100" role="banner">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          <NavigationBrand businessName={BUSINESS_INFO.name} />

          <DesktopNavigation
            items={NAVIGATION_ITEMS}
            session={session}
            status={status}
            bookingUrl={EXTERNAL_LINKS.booking}
            onSignOut={handleSignOut}
          />

          <MobileMenuButton
            ref={mobileMenuButtonRef}
            isOpen={isMenuOpen}
            onToggle={handleMenuToggle}
          />
        </div>

        {isMenuOpen && (
          <MobileNavigation
            ref={mobileMenuRef}
            items={NAVIGATION_ITEMS}
            session={session}
            status={status}
            bookingUrl={EXTERNAL_LINKS.booking}
            onClose={handleMenuClose}
            onSignOut={handleSignOut}
          />
        )}
      </nav>
    </header>
  );
});
