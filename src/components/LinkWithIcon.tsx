/**
 * Link with icon component - Smart internal/external navigation.
 * 
 * Automatically detects internal vs external URLs:
 * - Internal: Uses Next.js Link (SPA navigation, prefetching)
 * - External: Uses native <a> (proper security attributes)
 * 
 * Uses React 19 ref-as-prop pattern.
 * 
 * @example
 * ```tsx
 * // Internal navigation (automatic)
 * <LinkWithIcon href="/about">Learn More</LinkWithIcon>
 * 
 * // External link (automatic detection)
 * <LinkWithIcon href="https://example.com">External Site</LinkWithIcon>
 * 
 * // Mailto link (automatic detection)
 * <LinkWithIcon href="mailto:test@example.com">Email Us</LinkWithIcon>
 * 
 * // Force external treatment
 * <LinkWithIcon href="/internal" external>Force External</LinkWithIcon>
 * ```
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type LinkVariant = 'default' | 'accent';

interface LinkWithIconProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: LinkVariant;
  className?: string;
  target?: string;
  rel?: string;
  /** Force external link behavior (bypass auto-detection) */
  external?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

function isExternalUrl(href: string): boolean {
  return (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    href.startsWith('//')
  );
}

export default function LinkWithIcon({
  href,
  children,
  icon: Icon = ChevronRight,
  variant = 'default',
  className,
  target,
  rel,
  external,
  ref,
}: LinkWithIconProps) {
  const baseClasses = 'inline-flex items-center font-semibold transition-colors';

  const variantClasses = {
    default: 'text-black hover:text-amber-500',
    accent: 'text-amber-500 hover:text-black',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

  const isExternal = external ?? isExternalUrl(href);

  // External links use native <a> with security attributes
  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        className={classes}
      >
        {children}
        <Icon className="h-5 w-5 ml-2" />
      </a>
    );
  }

  // Internal links use Next.js Link for SPA navigation
  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={classes}
    >
      {children}
      <Icon className="h-5 w-5 ml-2" />
    </Link>
  );
}
