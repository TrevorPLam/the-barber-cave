'use client';

import { useState, useCallback } from 'react';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setErrorState({
      error,
      isError: true,
    });

    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const handleAsyncError = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)));
        return null;
      }
    },
    [handleError]
  );

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError,
    resetError,
    handleAsyncError,
  };
}
