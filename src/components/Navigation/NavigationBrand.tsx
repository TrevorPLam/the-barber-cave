/**
 * NavigationBrand component displaying the shop logo and name.
 *
 * @example
 * ```tsx
 * <NavigationBrand businessName="The Barber Cave" />
 * ```
 *
 * @accessibility
 * - Logo link includes descriptive aria-label for screen readers
 * - Decorative icon marked aria-hidden
 */

import { Scissors } from 'lucide-react';
import { memo } from 'react';

interface NavigationBrandProps {
  /** Display name of the business */
  businessName: string;
}

const NavigationBrand = memo(function NavigationBrand({ businessName }: NavigationBrandProps) {
  return (
    <div className="flex items-center space-x-3">
      <a href="#home" className="flex items-center space-x-3" aria-label={`${businessName} - Back to home`}>
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <Scissors className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-xl font-bold text-black">{businessName}</span>
      </a>
    </div>
  );
});

export default NavigationBrand;
