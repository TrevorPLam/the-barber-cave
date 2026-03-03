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

import { memo } from 'react';

export interface NavItem {
  /** URL or hash anchor for the link */
  href: string;
  /** Display label */
  label: string;
}

interface NavigationItemProps {
  /** Navigation item data */
  item: NavItem;
  /** Optional click handler for mobile menu close */
  onClick?: () => void;
}

const NavigationItem = memo(function NavigationItem({ item, onClick }: NavigationItemProps) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      className="text-gray-700 hover:text-black transition-colors font-medium"
    >
      {item.label}
    </a>
  );
});

NavigationItem.displayName = 'NavigationItem';

export default NavigationItem;
