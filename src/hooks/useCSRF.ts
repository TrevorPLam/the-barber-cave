import { useState, useEffect } from 'react';

export function useCSRF() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf', {
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error(`CSRF fetch failed: ${response.status}`);
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        // AbortError is expected on unmount — not a real error
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        // Only update loading state if still mounted (abort check via signal)
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCsrfToken();

    // Cleanup: cancel in-flight request on unmount or re-render
    return () => abortController.abort();
  }, []); // Stable empty deps — CSRF token fetched once on mount

  return { csrfToken, loading, error };
}
