'use client';

import { useState, useCallback } from 'react';
import { Sentry } from '@/lib/sentry';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback((error: Error | unknown) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    console.error('Error caught by useErrorHandler:', normalizedError);
    setErrorState({
      error: normalizedError,
      isError: true,
    });

    // In production, send to Sentry for monitoring
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(normalizedError);
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
