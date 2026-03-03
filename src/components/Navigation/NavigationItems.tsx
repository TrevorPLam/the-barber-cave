/**
 * NavigationItems renders a list of navigation links.
 *
 * Shared between desktop and mobile navigation views.
 *
 * @example
 * ```tsx
 * <NavigationItems items={NAVIGATION_ITEMS} onItemClick={handleClose} />
 * ```
 */

import { memo } from 'react';
import NavigationItem, { type NavItem } from './NavigationItem';

interface NavigationItemsProps {
  /** Array of navigation link items */
  items: NavItem[];
  /** Optional click handler passed to each item (used in mobile menu) */
  onItemClick?: () => void;
}

const NavigationItems = memo(function NavigationItems({ items, onItemClick }: NavigationItemsProps) {
  return (
    <>
      {items.map((item) => (
        <NavigationItem key={item.href} item={item} onClick={onItemClick} />
      ))}
    </>
  );
});

export default NavigationItems;
