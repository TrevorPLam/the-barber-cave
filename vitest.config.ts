import { defineConfig } from 'vitest/config'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: [
      'node_modules',
      'tests/e2e/**',
      '**/*.e2e.*',
      '**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.d.ts'],
      thresholds: {
        // Global enterprise standards (75-80% range)
        statements: 75,
        functions: 75,
        branches: 70,
        lines: 75,
        // Realistic thresholds for UI components (75-80%)
        'src/components/**/*.tsx': { 
          statements: 80, 
          functions: 75, 
          branches: 75, 
          lines: 80 
        },
        // High thresholds for utility functions (85-90%)
        'src/data/**/*.ts': { 
          statements: 90, 
          functions: 90, 
          branches: 80, 
          lines: 90 
        },
        // Simple utilities can be 100%
        'src/data/barbers.ts': { 100: true },
        'src/data/services.ts': { 100: true },
        'src/data/constants.ts': { 100: true },
        // Utility functions in utils folder (85%)
        'src/utils/**/*.ts': { 
          statements: 90, 
          functions: 90, 
          branches: 80, 
          lines: 90 
        },
      },
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
