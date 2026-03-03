// src/lib/cache.ts — In-process Map-based cache with TTL support
// Provides a lightweight caching layer without requiring Redis.

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>()

  /**
   * Retrieve an item from the cache.
   * Returns undefined when the key does not exist or has expired.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  /**
   * Store an item in the cache.
   * @param key   Cache key
   * @param value Value to store
   * @param ttl   Time-to-live in seconds (default: 3600)
   */
  set<T>(key: string, value: T, ttl = 3600): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    })
  }

  /** Remove a single entry. */
  delete(key: string): void {
    this.store.delete(key)
  }

  /** Remove all cache entries. */
  clear(): void {
    this.store.clear()
  }

  /**
   * Return the number of entries currently stored (including expired entries
   * that have not yet been evicted — expired entries are removed lazily on `get`).
   */
  get size(): number {
    return this.store.size
  }
}

// Singleton cache instance shared across the process
export const appCache = new SimpleCache()

/**
 * Helper that returns cached data when available, or calls `fetcher`,
 * stores the result, and returns it.
 *
 * @param key     Cache key
 * @param fetcher Async function that fetches the data
 * @param ttl     Time-to-live in seconds (default: 3600)
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 3600,
): Promise<T> {
  const cached = appCache.get<T>(key)
  if (cached !== undefined) return cached

  const data = await fetcher()
  appCache.set(key, data, ttl)
  return data
}
