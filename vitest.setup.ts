import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

// Mock next/cache module for tests
vi.mock('next/cache', () => ({
  cacheTag: vi.fn(),
  revalidateTag: vi.fn(),
}))
