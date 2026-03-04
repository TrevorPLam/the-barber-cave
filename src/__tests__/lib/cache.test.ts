// src/__tests__/lib/cache.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SimpleCache, getCachedData } from '../../lib/cache'

describe('SimpleCache', () => {
  let cache: SimpleCache

  beforeEach(() => {
    cache = new SimpleCache()
  })

  it('returns undefined for missing key', () => {
    expect(cache.get('missing')).toBeUndefined()
  })

  it('stores and retrieves a value', () => {
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
  })

  it('stores objects and arrays', () => {
    const data = [{ id: 1, name: 'Haircut' }]
    cache.set('services', data)
    expect(cache.get('services')).toEqual(data)
  })

  it('returns undefined after TTL expires', () => {
    vi.useFakeTimers()
    cache.set('ttl-key', 'hello', 1) // 1-second TTL
    vi.advanceTimersByTime(1001) // advance past TTL
    expect(cache.get('ttl-key')).toBeUndefined()
    vi.useRealTimers()
  })

  it('delete removes an entry', () => {
    cache.set('key', 42)
    cache.delete('key')
    expect(cache.get('key')).toBeUndefined()
  })

  it('clear removes all entries', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.clear()
    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBeUndefined()
  })

  it('size reflects number of stored entries', () => {
    expect(cache.size).toBe(0)
    cache.set('x', 1)
    expect(cache.size).toBe(1)
  })
})

describe('getCachedData', () => {
  it('calls fetcher on cache miss and stores result', async () => {
    const fetcher = vi.fn().mockResolvedValue(['service-a'])
    const result = await getCachedData('unique-miss-key-1', fetcher, 60)
    expect(fetcher).toHaveBeenCalledOnce()
    expect(result).toEqual(['service-a'])
  })

  it('does not call fetcher on cache hit', async () => {
    const fetcher = vi.fn().mockResolvedValue(['service-b'])
    // Prime the cache with the first call
    await getCachedData('unique-hit-key-1', fetcher, 60)
    // Second call should use the shared appCache hit
    const result = await getCachedData('unique-hit-key-1', fetcher, 60)
    expect(fetcher).toHaveBeenCalledOnce()
    expect(result).toEqual(['service-b'])
  })
})
