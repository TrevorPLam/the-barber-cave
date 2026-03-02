import { forwardRef } from 'react';

export interface ContainerQueriesProps 
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerName?: string;
  containerType?: 'size' | 'inline-size' | 'normal';
}

/**
 * ContainerQueries component provides a wrapper for implementing CSS container queries.
 * 
 * @param children - React components that will respond to container size changes
 * @param className - Additional CSS classes
 * @param containerName - Optional name for targeting specific containers
 * @param containerType - Type of containment (default: 'inline-size')
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
  if (typeof window === 'undefined') return false;
  
  return CSS.supports('container-type', 'inline-size');
};

export default ContainerQueries;
