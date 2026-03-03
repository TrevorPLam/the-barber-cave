/**
 * MobileMenuButton toggles the mobile navigation drawer.
 *
 * @example
 * ```tsx
 * <MobileMenuButton
 *   ref={buttonRef}
 *   isOpen={isMenuOpen}
 *   onToggle={handleMenuToggle}
 * />
 * ```
 *
 * @accessibility
 * - `aria-expanded` reflects current open/closed state
 * - `aria-controls` links button to the menu panel
 * - Visible at all viewport sizes below lg breakpoint
 */

import { memo, forwardRef } from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  /** Whether the mobile menu is currently open */
  isOpen: boolean;
  /** Called when the button is clicked */
  onToggle: () => void;
}

const MobileMenuButton = memo(forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  function MobileMenuButton({ isOpen, onToggle }, ref) {
    return (
      <button
        ref={ref}
        onClick={onToggle}
        className="lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        id="mobile-menu-button"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    );
  }
));

export default MobileMenuButton;
