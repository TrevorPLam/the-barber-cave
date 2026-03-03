import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  restoreFocus?: boolean;
  initialFocus?: HTMLElement | null;
}

/**
 *
 */
export function useFocusTrap({
  isActive,
  onEscape,
  restoreFocus = true,
  initialFocus
}: UseFocusTrapOptions) {
  /**
   *
   */
  const containerRef = useRef<HTMLElement>(null);
  /**
   *
   */
  const previousFocusRef = useRef<HTMLElement | null>(null);
  /**
   *
   */
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  /**
   *
   */
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    /**
     *
     */
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'details summary',
      'iframe',
      'embed',
      'object'
    ].join(', ');

    return containerRef.current.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  }, []);

  /**
   *
   */
  const setInitialFocus = useCallback(() => {
    if (!isActive) return;

    // Use provided initial focus or first focusable element
    /**
     *
     */
    const target = initialFocus || getFocusableElements()[0];

    if (target) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        target.focus();
        // Announce to screen readers
        target.setAttribute('aria-live', 'polite');
        setTimeout(() => target.removeAttribute('aria-live'), 1000);
      }, 50);
    }
  }, [isActive, initialFocus, getFocusableElements]);

  /**
   *
   */
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;

    // Handle Escape key
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key for focus trapping
    if (e.key === 'Tab') {
      /**
       *
       */
      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) return;

      /**
       *
       */
      const firstElement = focusableElements[0];
      /**
       *
       */
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Handle arrow keys for menu navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      /**
       *
       */
      const focusableElements = getFocusableElements();
      /**
       *
       */
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);

      if (currentIndex !== -1) {
        e.preventDefault();
        /**
         *
         */
        const nextIndex = e.key === 'ArrowDown'
          ? (currentIndex + 1) % focusableElements.length
          : (currentIndex - 1 + focusableElements.length) % focusableElements.length;

        focusableElements[nextIndex].focus();
      }
    }
  }, [isActive, onEscape, getFocusableElements]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store current focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Set initial focus
    setInitialFocus();

    // Add event listeners
    keydownHandlerRef.current = handleKeydown;
    document.addEventListener('keydown', keydownHandlerRef.current);

    // Prevent body scroll when modal is open
    /**
     *
     */
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      // Clean up event listeners
      if (keydownHandlerRef.current) {
        document.removeEventListener('keydown', keydownHandlerRef.current);
        keydownHandlerRef.current = null;
      }

      // Restore body scroll
      document.body.style.overflow = originalOverflow;

      // Restore focus when unmounting
      if (restoreFocus && previousFocusRef.current) {
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 0);
      }
    };
  }, [isActive, handleKeydown, setInitialFocus, restoreFocus]);

  return containerRef;
}
