'use client';

import { forwardRef, useState, useEffect } from 'react';

export interface ContainerQueriesProps 
  extends React.HTMLAttributes<HTMLDivElement> {
  /** React components that will respond to container size changes */
  children: React.ReactNode;
  /** Optional name for targeting specific containers */
  containerName?: string;
  /** Type of containment (default: 'inline-size') */
  containerType?: 'size' | 'inline-size' | 'normal';
}

/**
 * ContainerQueries component provides a wrapper for implementing CSS container queries.
 * 
 * @example
 * ```tsx
 * <ContainerQueries containerName="sidebar" containerType="inline-size">
 *   <div className="grid">
 *     <div className="@container (min-width: 200px) grid-cols-2">
 *       Content that adapts to container size
 *     </div>
 *   </div>
 * </ContainerQueries>
 * ```
 */
export const ContainerQueries = forwardRef<HTMLDivElement, ContainerQueriesProps>(
  ({ children, className = '', containerName, containerType = 'inline-size', style, ...props }, ref) => {
    const containerStyles: React.CSSProperties = {
      containerType,
      containerName: containerName || 'none',
      ...style,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContainerQueries.displayName = 'ContainerQueries';

/**
 * Hook for detecting container query support
 */
export const useContainerQuerySupport = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof CSS !== 'undefined' && CSS.supports('container-type', 'inline-size'));
  }, []);

  return isSupported;
};

export default ContainerQueries;
