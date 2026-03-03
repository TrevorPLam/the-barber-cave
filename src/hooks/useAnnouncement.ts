import { useEffect, useRef, useCallback } from 'react';

interface AnnouncementOptions {
  politeness?: 'polite' | 'assertive' | 'off';
  timeout?: number;
  clearPrevious?: boolean;
}

export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Create the ARIA live region once on mount
    const element = document.createElement('div');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.setAttribute('aria-relevant', 'additions text');
    element.className = 'sr-only';
    document.body.appendChild(element);
    announcementRef.current = element;

    return () => {
      // Critical: clear pending timeout before DOM removal
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      // Safe removal: check parentNode before removeChild to avoid
      // NotFoundError if parent changed during async operations
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      announcementRef.current = null;
    };
  }, []); // Mount/unmount only — element lifecycle matches component lifecycle

  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    const announcementElement = announcementRef.current;
    if (!announcementElement || typeof window === 'undefined') return;

    const {
      politeness = 'polite',
      timeout = 1000,
      clearPrevious = true
    } = options;

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
  }, []);

  return { announce };
}
