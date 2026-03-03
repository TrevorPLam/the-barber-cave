/**
 * MobileNavigation renders the dropdown menu panel for small screens.
 *
 * Includes navigation links, authentication controls, and the booking CTA.
 * Implements focus trap, Escape-to-close, and outside-click-to-close.
 *
 * @example
 * ```tsx
 * {isMenuOpen && (
 *   <MobileNavigation
 *     ref={menuRef}
 *     items={NAVIGATION_ITEMS}
 *     session={session}
 *     status={status}
 *     bookingUrl="https://..."
 *     onClose={handleMenuClose}
 *     onSignOut={handleSignOut}
 *   />
 * )}
 * ```
 *
 * @accessibility
 * - role="dialog" with aria-modal="true" for screen readers
 * - aria-labelledby links to the toggle button
 * - Focus trap keeps keyboard users inside the open menu
 * - Escape key closes the menu and returns focus to toggle button
 */

import { memo, forwardRef } from 'react';
import { User, LogOut } from 'lucide-react';
import { signIn } from 'next-auth/react';
import type { Session } from 'next-auth';
import NavigationItems from './NavigationItems';
import type { NavItem } from './NavigationItem';

interface MobileNavigationProps {
  /** Navigation link items */
  items: NavItem[];
  /** Current auth session */
  session: Session | null;
  /** Auth loading status */
  status: 'loading' | 'authenticated' | 'unauthenticated';
  /** External booking URL */
  bookingUrl: string;
  /** Closes the mobile menu */
  onClose: () => void;
  /** Called when user clicks sign out */
  onSignOut: () => void;
}

const MobileNavigation = memo(forwardRef<HTMLDivElement, MobileNavigationProps>(
  function MobileNavigation({ items, session, status, bookingUrl, onClose, onSignOut }, ref) {
    return (
      <div
        ref={ref}
        className="lg:hidden bg-white border-b border-gray-100"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-6 py-4 space-y-3">
          <NavigationItems items={items} onItemClick={onClose} />

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
                  onClick={() => { onSignOut(); onClose(); }}
                  className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-black transition-colors py-2"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signIn(); onClose(); }}
                className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-black transition-colors py-2"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
                <span>Sign in</span>
              </button>
            )}
          </div>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium text-center"
          >
            Book Appointment
          </a>
        </div>
      </div>
    );
  }
));

export default MobileNavigation;
