// src/components/DataFetcher.tsx - Advanced render props component for data fetching
import React, { useState, useEffect, useCallback, ReactNode } from 'react'

interface DataFetcherProps<T> {
  url: string
  children: (data: {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
  }) => ReactNode
  fallback?: ReactNode
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  enabled?: boolean
  retryCount?: number
  retryDelay?: number
}

/**
 * Advanced render props component for flexible data fetching with retry logic
 *
 * Features:
 * - Render props pattern for maximum flexibility
 * - Automatic retry with exponential backoff
 * - Loading states and error handling
 * - Success/error callbacks
 * - Conditional fetching
 * - TypeScript support for data types
 *
 * @example
 * ```tsx
 * <DataFetcher url="/api/services">
 *   {({ data, loading, error, refetch }) => (
 *     <div>
 *       {loading && <div>Loading services...</div>}
 *       {error && (
 *         <div>
 *           <p>Error: {error}</p>
 *           <button onClick={refetch}>Retry</button>
 *         </div>
 *       )}
 *       {data && (
 *         <ul>
 *           {data.map((service: any) => (
 *             <li key={service.id}>{service.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )}
 * </DataFetcher>
 * ```
 */
export function DataFetcher<T>({
  url,
  children,
  fallback,
  onSuccess,
  onError,
  enabled = true,
  retryCount = 3,
  retryDelay = 1000
}: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentRetry, setCurrentRetry] = useState(0)

  const calculateRetryDelay = useCallback((attempt: number) => {
    return retryDelay * Math.pow(2, attempt) // Exponential backoff
  }, [retryDelay])

  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      if (!isRetry) {
        setCurrentRetry(0)
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
      setCurrentRetry(0)
      onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      if (currentRetry < retryCount) {
        // Schedule retry with exponential backoff
        const delay = calculateRetryDelay(currentRetry)
        setTimeout(() => {
          setCurrentRetry(prev => prev + 1)
          fetchData(true)
        }, delay)
      } else {
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [url, enabled, retryCount, currentRetry, calculateRetryDelay, onSuccess, onError])

  const refetch = useCallback(() => {
    fetchData(false)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading && fallback && currentRetry === 0) {
    return <>{fallback}</>
  }

  return <>{children({ data, loading: loading || currentRetry > 0, error, refetch })}</>
}
