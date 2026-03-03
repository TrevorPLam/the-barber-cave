import '@testing-library/jest-dom'
import 'vitest-axe' // Import types for vitest-axe matchers
import { expect, vi } from 'vitest'
import * as matchers from 'vitest-axe/matchers'
import 'canvas' // Polyfill for HTMLCanvasElement in tests

expect.extend(matchers)

// Mock next/cache module for tests
vi.mock('next/cache', () => ({
  cacheTag: vi.fn(),
  revalidateTag: vi.fn(),
}))
