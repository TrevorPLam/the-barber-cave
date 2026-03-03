/**
 * Flexible button component with link support and multiple variants.
 * 
 * Renders as either a button or anchor element based on href prop presence.
 * Uses React 19 ref-as-prop pattern with discriminated union for type safety.
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
 * @accessibility
 * - Proper focus indicators with visible ring
 * - Keyboard accessible for both button and link variants
 * - Screen reader friendly with semantic elements
 * - High contrast focus states
 * 
 * @performance
 * - React 19 ref prop pattern (forwardRef deprecated)
 * - Minimal re-renders with stable prop handling
 */

import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'accent';

interface BaseButtonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

interface ButtonElementProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'variant'> {
  ref?: React.Ref<HTMLButtonElement>;
}

interface AnchorElementProps extends BaseButtonProps {
  href: string;
  target?: string;
  rel?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

type ButtonProps = ButtonElementProps | AnchorElementProps;

export default function Button(props: ButtonProps) {
  const { className, variant = 'primary', children } = props;
  
  const baseClasses = 'px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-900 focus-visible:ring-black',
    secondary: 'border-2 border-black text-black hover:bg-black hover:text-white focus-visible:ring-black',
    accent: 'bg-accent text-foreground hover:bg-amber-600 focus-visible:ring-amber-500',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

  // Anchor variant (href present)
  if ('href' in props && props.href) {
    const { href, target, rel, ref } = props;
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target={target}
          rel={rel || 'noopener noreferrer'}
          className={classes}
          ref={ref}
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        href={href}
        className={classes}
        ref={ref}
      >
        {children}
      </Link>
    );
  }

  // Button variant
  const { ref, ...buttonProps } = props;
  return (
    <button
      className={classes}
      ref={ref}
      {...buttonProps}
    />
  );
}
