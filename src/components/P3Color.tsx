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

const supportsP3Color = () => {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }

  return CSS.supports('color', 'color(display-p3 1 1 1 / 1)');
};

/**
 * P3 Gradient wrapper component for Display P3 color space support
 * Provides enhanced color gradients on supported displays
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
  const useP3Gradient = supportsP3Color();

  return (
    <div
      className={className}
      style={{
        background: useP3Gradient
          ? `linear-gradient(${angle}, ${from}, ${to})`
          : `linear-gradient(${angle}, ${resolvedFallbackFrom}, ${resolvedFallbackTo})`,
      }}
    >
      {children}
    </div>
  );
}
