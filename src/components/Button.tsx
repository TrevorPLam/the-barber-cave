/**
 * Flexible button component with link support and multiple variants.
 * 
 * Renders as either a button or anchor element based on href prop presence.
 * Includes hover effects, focus states, and consistent styling across variants.
 * Supports all standard button attributes and accessibility features.
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // Link-style button
 * <Button variant="secondary" href="/contact">
 *   Contact Us
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // External link with proper attributes
 * <Button
 *   variant="primary"
 *   href="https://booking.example.com"
 *   target="_blank"
 *   rel="noopener noreferrer"
 * >
 *   Book Appointment
 * </Button>
 * ```
 * 
 * @accessibility
 * - Proper focus indicators with visible ring
 * - Keyboard accessible for both button and link variants
 * - Screen reader friendly with semantic elements
 * - High contrast focus states
 * 
 * @performance
 * - Forwarded refs for optimal performance
 * - Minimal re-renders with stable prop handling
 * - Efficient CSS class concatenation
 */
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'accent';
  /** URL for link variant (makes component render as anchor) */
  href?: string;
  /** Link target attribute for anchor variant */
  target?: string;
  /** Link rel attribute for anchor variant */
  rel?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', href, target, rel, ...props }, ref) => {
    const baseClasses = 'px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantClasses = {
      primary: 'bg-black text-white hover:bg-gray-900 focus-visible:ring-black',
      secondary: 'border-2 border-black text-black hover:bg-black hover:text-white focus-visible:ring-black',
      accent: 'bg-accent text-foreground hover:bg-amber-600 focus-visible:ring-amber-500',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {props.children}
        </a>
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
