/**
 * @file Hook for intersection observer functionality
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Provides a React hook for implementing intersection observer patterns,
 * commonly used for lazy loading, infinite scroll, and animation triggers.
 */
'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Configuration options for the intersection observer
 */
export interface IntersectionOptions {
  /** Element that is used as the viewport for checking visibility */
  root?: Element | null;
  /** Margin around the root element */
  rootMargin?: string;
  /** Percentage of the target element that must be visible to trigger */
  threshold?: number | number[];
  /** Whether to trigger only once or continuously */
  triggerOnce?: boolean;
}

/**
 * Return type for the useIntersection hook
 */
export interface IntersectionReturn {
  /** Ref to attach to the target element */
  ref: React.RefObject<Element>;
  /** Whether the target element is currently intersecting */
  isIntersecting: boolean;
  /** Intersection observer entry with detailed intersection data */
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook for observing element intersection with the viewport or a parent element
 *
 * @param options - Configuration options for the intersection observer
 * @returns Object containing ref, intersection state, and entry data
 *
 * @example
 * ```tsx
 * import { useIntersection } from '@/hooks/useIntersection';
 *
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, isIntersecting } = useIntersection({
 *     threshold: 0.1,
 *     triggerOnce: true
 *   });
 *
 *   return (
 *     <img
 *       ref={ref}
 *       src={isIntersecting ? src : ''}
 *       alt={alt}
 *     />
 *   );
 * }
 * ```
 */
export function useIntersectionObserver(options: IntersectionOptions = {}): IntersectionReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
  } = options;

  const ref = useRef<Element>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        // If triggerOnce is true, unobserve after first intersection
        if (triggerOnce && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    // Cleanup function
    return () => {
      observer.unobserve(element);
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return { ref, isIntersecting, entry };
}
