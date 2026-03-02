/**
 * @fileoverview Reusable Button component with multiple variants and link support
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Flexible button component that can render as either a button or anchor element.
 * Supports multiple visual variants and accessibility features for consistent UI.
 */

/**
 * @typedef {'primary' | 'secondary' | 'accent'} ButtonVariant
 * Button visual style variants
 */

/**
 * @typedef {Object} ButtonProps
 * @property {ButtonVariant} [variant='primary'] - Visual style variant
 * @property {string} [href] - URL for link variant (makes component render as anchor)
 * @property {string} [target] - Link target attribute for anchor variant
 * @property {string} [rel] - Link rel attribute for anchor variant
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Button/link content
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [props] - Standard button attributes
 */

import { forwardRef } from 'react';

/**
 * @typedef {Object} ButtonProps
 * @property {ButtonVariant} [variant='primary'] - Visual style variant
 * @property {string} [href] - URL for link variant (makes component render as anchor)
 * @property {string} [target] - Link target attribute for anchor variant
 * @property {string} [rel] - Link rel attribute for anchor variant
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Button/link content
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [props] - Standard button attributes
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * @component
 * @description Flexible button component with link support and multiple variants
 *
 * Renders as either a button or anchor element based on href prop presence.
 * Includes hover effects, focus states, and consistent styling across variants.
 * Supports all standard button attributes and accessibility features.
 *
 * @param {ButtonProps} props - Component props
 * @param {ButtonVariant} [props.variant='primary'] - Visual style variant
 * @param {string} [props.href] - URL for link behavior (renders as anchor)
 * @param {string} [props.target] - Link target for anchor variant
 * @param {string} [props.rel] - Link rel for anchor variant
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button/link content
 *
 * @returns {JSX.Element} Button or anchor element with consistent styling
 *
 * @example
 * ```tsx
 * import Button from '@/components/Button';
 *
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Link-style button
 * <Button variant="secondary" href="/contact">
 *   Contact Us
 * </Button>
 *
 * // Accent button for CTAs
 * <Button variant="accent" onClick={handleCTA}>
 *   Get Started
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
 *
 * @dependencies
 * - React.forwardRef - For ref forwarding
 * - Tailwind CSS - For styling and responsive design
 *
 * @business-logic
 * - Conditionally renders as button or anchor based on href prop
 * - Applies variant-specific styling for consistent brand experience
 * - Supports external link attributes for proper security
 * - Hover scale effect for interactive feedback
 */
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
