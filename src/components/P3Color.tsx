'use client';

import { ReactNode } from 'react';

interface P3GradientProps {
  children: ReactNode;
  className?: string;
  from: string;
  to: string;
}

/**
 * P3 Gradient wrapper component for Display P3 color space support
 * Provides enhanced color gradients on supported displays
 */
export function P3Gradient({ children, className = '', from, to }: P3GradientProps) {
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
    >
      {children}
    </div>
  );
}
