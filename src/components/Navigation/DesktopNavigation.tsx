/**
 * DesktopNavigation renders the horizontal navigation bar visible on large screens.
 *
 * Includes navigation links, authentication controls, and the booking CTA.
 *
 * @example
 * ```tsx
 * <DesktopNavigation
 *   items={NAVIGATION_ITEMS}
 *   session={session}
 *   status={status}
 *   bookingUrl="https://..."
 *   onSignOut={handleSignOut}
 * />
 * ```
 */

import { memo } from 'react';
import type { Session } from 'next-auth';
import NavigationItems from './NavigationItems';
import AuthenticationSection from './AuthenticationSection';
import type { NavItem } from './NavigationItem';

interface DesktopNavigationProps {
  /** Navigation link items */
  items: NavItem[];
  /** Current auth session */
  session: Session | null;
  /** Auth loading status */
  status: 'loading' | 'authenticated' | 'unauthenticated';
  /** External booking URL */
  bookingUrl: string;
  /** Called when user clicks sign out */
  onSignOut: () => void;
}

const DesktopNavigation = memo(function DesktopNavigation({
  items,
  session,
  status,
  bookingUrl,
  onSignOut,
}: DesktopNavigationProps) {
  return (
    <div className="hidden lg:flex items-center space-x-8">
      <NavigationItems items={items} />
      <AuthenticationSection session={session} status={status} onSignOut={onSignOut} />
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium"
      >
        Book Appointment
      </a>
    </div>
  );
});

export default DesktopNavigation;
