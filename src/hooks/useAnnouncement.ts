import { useEffect, useRef, useState, useCallback } from 'react';

interface AnnouncementOptions {
  politeness?: 'polite' | 'assertive' | 'off';
  timeout?: number;
  clearPrevious?: boolean;
}

export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    if (!isMounted || typeof window === 'undefined') return;

    const {
      politeness = 'polite',
      timeout = 1000,
      clearPrevious = true
    } = options;

    // Create or get announcement region
    let announcementElement = announcementRef.current;
    if (!announcementElement) {
      announcementElement = document.createElement('div');
      announcementElement.setAttribute('aria-live', 'polite');
      announcementElement.setAttribute('aria-atomic', 'true');
      announcementElement.className = 'sr-only fixed top-0 left-0 w-px h-px overflow-hidden';
      announcementElement.style.position = 'absolute';
      announcementElement.style.left = '-10000px';
      announcementElement.style.width = '1px';
      announcementElement.style.height = '1px';
      document.body.appendChild(announcementElement);
      announcementRef.current = announcementElement;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear previous announcement if requested
    if (clearPrevious) {
      announcementElement.textContent = '';
    }

    // Set politeness level
    announcementElement.setAttribute('aria-live', politeness);

    // Add the message
    announcementElement.textContent = message;

    // Clear after timeout to prevent screen reader clutter
    timeoutRef.current = setTimeout(() => {
      if (announcementElement) {
        announcementElement.textContent = '';
      }
    }, timeout);
  }, [isMounted]);

  const AnnouncementRegion = useCallback(() => {
    if (!isMounted) return null;

    return (
      <div
        ref={announcementRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    );
  }, [isMounted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (announcementRef.current && announcementRef.current.parentNode) {
        announcementRef.current.parentNode.removeChild(announcementRef.current);
      }
    };
  }, []);

  return { announce, AnnouncementRegion };
}
