// src/__tests__/DataFetcher.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataFetcher } from '@/components/DataFetcher'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('DataFetcher Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <DataFetcher url="/api/test">
        {({ data, loading, error }) => (
          <div>
            {loading && <div>Loading...</div>}
            {data && <div>Data: {JSON.stringify(data as any)}</div>}
            {error && <div>Error: {error}</div>}
          </div>
        ) as React.ReactNode}
      </DataFetcher>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders data on successful fetch', async () => {
    const mockData = { id: 1, name: 'Test Item' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    render(
      <DataFetcher url="/api/test">
        {({ data, loading }) => (
          <div>
            {loading && <div>Loading...</div>}
            {data && <div>Data: {(data as any).name}</div>}
          </div>
        ) as React.ReactNode}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(screen.getByText('Data: Test Item')).toBeInTheDocument()
    })
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders error on failed fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    render(
      <DataFetcher url="/api/test">
        {({ error }) => (
          <div>
            {error && <div>Error: {error}</div>}
          </div>
        )}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(screen.getByText('Error: HTTP 404: Not Found')).toBeInTheDocument()
    })
  })

  it('calls onSuccess callback on successful fetch', async () => {
    const mockData = { id: 1, name: 'Test' }
    const onSuccess = vi.fn()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    render(
      <DataFetcher url="/api/test" onSuccess={onSuccess}>
        {({ data }) => <div>{data?.name}</div>}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData)
    })
  })

  it('calls onError callback on failed fetch', async () => {
    const onError = vi.fn()
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <DataFetcher url="/api/test" onError={onError}>
        {({ error }) => <div>{error}</div>}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error')
    })
  })

  it('renders fallback during loading when provided', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <DataFetcher url="/api/test" fallback={<div>Custom loading...</div> as React.ReactNode}>
        {() => <div>Content</div>}
      </DataFetcher>
    )

    expect(screen.getByText('Custom loading...')).toBeInTheDocument()
  })

  it('supports refetch functionality', async () => {
    const mockData = { id: 1, name: 'Test' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    let refetchFunction: (() => void) | undefined

    render(
      <DataFetcher url="/api/test">
        {({ data, refetch }) => {
          refetchFunction = refetch
          return <div>{(data as any)?.name}</div>
        }}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    // Change mock data for second call
    const newData = { id: 2, name: 'Updated Test' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newData
    })

    // Trigger refetch
    refetchFunction?.()

    await waitFor(() => {
      expect(screen.getByText('Updated Test')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('respects enabled prop', () => {
    render(
      <DataFetcher url="/api/test" enabled={false}>
        {({ loading }) => (
          <div>{loading ? 'Loading' : 'Not loading'}</div>
        )}
      </DataFetcher>
    )

    expect(screen.getByText('Not loading')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('implements retry logic with exponential backoff', async () => {
    let callCount = 0
    mockFetch.mockImplementation(() => {
      callCount++
      if (callCount < 3) {
        return Promise.reject(new Error('Temporary error'))
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true })
      })
    })

    render(
      <DataFetcher url="/api/test" retryCount={3} retryDelay={10}>
        {({ data, loading }) => (
          <div>
            {loading && <div>Loading...</div>}
            {(data as any)?.success && <div>Success: {(data as any).success}</div>}
          </div>
        )}
      </DataFetcher>
    )

    await waitFor(() => {
      expect(screen.getByText('Success: true')).toBeInTheDocument()
    }, { timeout: 1000 })

    expect(mockFetch).toHaveBeenCalledTimes(3)
  })
})
