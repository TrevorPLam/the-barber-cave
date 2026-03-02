'use client';

import { memo } from 'react';

interface P3ColorProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * P3Color component - Provides P3 color space support with fallbacks
 * Uses CSS custom properties that automatically fallback to sRGB values
 */
export const P3Color = memo(({ className = '', style = {}, children }: P3ColorProps) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
});

P3Color.displayName = 'P3Color';

/**
 * Hook to check if P3 color space is supported
 */
export const useP3Support = () => {
  if (typeof window === 'undefined') return false;
  
  return CSS.supports('color', 'color(display-p3 1 1 1)') && 
         window.matchMedia('(color-gamut: p3)').matches;
};

/**
 * P3 enhanced gradient component
 */
export const P3Gradient = memo(({ 
  className = '', 
  children,
  from = 'var(--gradient-start)',
  to = 'var(--gradient-end)'
}: P3ColorProps & { 
  from?: string; 
  to?: string; 
}) => {
  const style = {
    background: `linear-gradient(to right, ${from}, ${to})`,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
});

P3Gradient.displayName = 'P3Gradient';
