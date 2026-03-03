import { useState, useEffect } from 'react';

export function useCSRF() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf');
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'CSRF token error');
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  return { csrfToken, loading, error };
}
