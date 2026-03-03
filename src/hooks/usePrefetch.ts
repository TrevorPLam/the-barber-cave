/**
 * @file Hook for prefetching external resources
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Provides utilities for prefetching external resources to improve navigation performance.
 */
'use client';

import { useCallback, useRef } from 'react';

/**
 * Hook for prefetching external URLs on hover
 *
 * @param url - The URL to prefetch
 * @param prefetchType - Type of prefetch ('prefetch' or 'prerender')
 * @returns Object with prefetch function and cleanup
 */
export function usePrefetch(url?: string, prefetchType: 'prefetch' | 'prerender' = 'prefetch') {
  const linkRef = useRef<HTMLLinkElement | null>(null);

  const prefetch = useCallback(() => {
    if (!url || typeof window === 'undefined') return;

    // Remove existing prefetch link if it exists
    if (linkRef.current) {
      document.head.removeChild(linkRef.current);
    }

    // Create new prefetch link
    const link = document.createElement('link');
    link.rel = prefetchType;
    link.href = url;
    link.crossOrigin = url.startsWith('https://') ? 'anonymous' : null;

    document.head.appendChild(link);
    linkRef.current = link;

    // Clean up after navigation or timeout
    setTimeout(() => {
      if (linkRef.current && document.head.contains(linkRef.current)) {
        document.head.removeChild(linkRef.current);
        linkRef.current = null;
      }
    }, 30000); // Remove after 30 seconds
  }, [url, prefetchType]);

  const cleanup = useCallback(() => {
    if (linkRef.current && document.head.contains(linkRef.current)) {
      document.head.removeChild(linkRef.current);
      linkRef.current = null;
    }
  }, []);

  return { prefetch, cleanup };
}
