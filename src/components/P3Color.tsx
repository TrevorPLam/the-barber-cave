'use client';

import { ReactNode } from 'react';

interface P3GradientProps {
  children: ReactNode;
  className?: string;
  from: string;
  to: string;
  angle?: string;
  fallbackFrom?: string;
  fallbackTo?: string;
}

/**
 * P3 Gradient wrapper component for Display P3 color space support.
 * Uses CSS progressive enhancement by declaring an sRGB fallback background,
 * then a Display-P3 background-image that compatible browsers apply.
 * @returns Wrapper element with a gradient background and rendered children.
 */
export function P3Gradient({
  children,
  className = '',
  from,
  to,
  angle = 'to bottom',
  fallbackFrom,
  fallbackTo,
}: P3GradientProps) {
  const resolvedFallbackFrom = fallbackFrom ?? from;
  const resolvedFallbackTo = fallbackTo ?? to;

  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(${angle}, ${resolvedFallbackFrom}, ${resolvedFallbackTo})`,
        backgroundImage: `linear-gradient(${angle}, ${from}, ${to})`,
      }}
    >
      {children}
    </div>
  );
}
