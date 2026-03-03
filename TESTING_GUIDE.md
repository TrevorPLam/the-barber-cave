# Testing Guide — The Barber Cave

This guide covers the testing setup, conventions, and workflows for this Next.js project.

---

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit & Component Tests (Vitest)](#unit--component-tests-vitest)
- [End-to-End Tests (Playwright)](#end-to-end-tests-playwright)
- [Accessibility Tests](#accessibility-tests)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)
- [Mocking Conventions](#mocking-conventions)
- [Common Patterns](#common-patterns)

---

## Testing Stack

| Tool                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| **Vitest**                | Unit and component tests                |
| **React Testing Library** | DOM-based component testing             |
| **Playwright**            | End-to-end browser automation tests     |
| **vitest-axe / axe-core** | Automated accessibility audits          |
| **Chromatic**             | Visual regression testing via Storybook |
| **@testing-library/jest-dom** | Custom DOM matchers                |

---

## Running Tests

```bash
# Run all unit/component tests (single pass)
npm test -- --run

# Run in watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Open interactive Vitest UI
npm run test:ui

# Run end-to-end tests (requires `npm run dev` in another terminal)
npm run test:e2e

# Run E2E tests with Playwright UI
npm run test:e2e:ui
```

---

## Unit & Component Tests (Vitest)

Test files live next to the code they test:

```
src/
├── components/
│   ├── Navigation.tsx
│   └── __tests__/
│       └── Navigation.test.tsx   ← component test
├── hooks/
│   ├── useAnnouncement.ts
│   └── __tests__/
│       └── useAnnouncement.test.ts
└── __tests__/
    └── accessibility.test.tsx    ← integration/accessibility tests
```

### Writing a Component Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders expected content', () => {
    render(<MyComponent label="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Vitest Configuration

Config lives in [`vitest.config.ts`](./vitest.config.ts). Key settings:

- **Environment**: `jsdom` — simulates a browser DOM
- **Setup file**: `vitest.setup.ts` — global matchers and test utilities
- **Excluded paths**: `tests/e2e/**`, `**/*.spec.ts` (Playwright-only)
- **Coverage provider**: `v8`

---

## End-to-End Tests (Playwright)

E2E tests live in `tests/e2e/`:

```
tests/
└── e2e/
    ├── navigation.spec.ts
    └── accessibility.spec.ts
```

### Running E2E Tests

```bash
# Start dev server first
npm run dev

# In another terminal, run all E2E tests
npm run test:e2e

# Run a specific test file
npx playwright test tests/e2e/navigation.spec.ts

# Run in headed mode (shows browser)
npx playwright test --headed
```

### Writing an E2E Test

```ts
import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByText('The Barber Cave')).toBeVisible()
})
```

Playwright config: [`playwright.config.ts`](./playwright.config.ts).

---

## Accessibility Tests

Accessibility tests use `vitest-axe` for automated audits.

### Component-level axe checks

```tsx
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Navigation from '../Navigation'

it('should have no accessibility violations', async () => {
  render(<Navigation />)
  const results = await axe(screen.getByRole('banner'))
  expect(results.violations).toHaveLength(0)
})
```

### Mocking `next-auth/react` for Navigation tests

Navigation uses `useSession`. All tests rendering Navigation must mock `next-auth/react`:

```tsx
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))
```

---

## Coverage Reports

After running `npm run test:coverage`, reports are generated in `coverage/`:

```
coverage/
├── index.html   ← open in browser
├── lcov.info    ← used by CI
└── coverage-summary.json
```

Coverage thresholds (defined in `vitest.config.ts`):

| Target                 | Statements | Functions | Branches | Lines |
| ---------------------- | ---------- | --------- | -------- | ----- |
| Global                 | 75%        | 75%       | 70%      | 75%   |
| `src/components/**`    | 80%        | 75%       | 75%      | 80%   |
| `src/data/**`          | 90%        | 90%       | 80%      | 90%   |
| `src/utils/**`         | 90%        | 90%       | 80%      | 90%   |

---

## CI/CD Integration

Tests run automatically on every push via GitHub Actions. Relevant workflows:

- `.github/workflows/accessibility.yml` — axe accessibility audit
- `.github/workflows/performance.yml` — Lighthouse CI
- `.github/workflows/visual-testing.yml` — Chromatic visual regression

---

## Mocking Conventions

### `next-auth/react`

Always mock `next-auth/react` in tests that render `Navigation` or any component using `useSession`:

```tsx
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))
```

### `react-dom`

When mocking `react-dom`, always use `importOriginal` to preserve React internals:

```tsx
vi.mock('react-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-dom')>()
  return { ...original }
})
```

### Environment Variables

Tests that import `src/data/constants.ts` or `src/lib/env.ts` require environment variables. Use `vitest.setup.ts` or inline:

```ts
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
```

---

## Common Patterns

### Test IDs vs Accessible Queries

Prefer accessible queries over test IDs:

```tsx
// ✅ Preferred
screen.getByRole('button', { name: /toggle menu/i })
screen.getByLabelText('Email address')

// ❌ Avoid when possible
screen.getByTestId('menu-button')
```

### Async State Updates

Wrap state-triggering interactions in `act()` or use `waitFor`:

```tsx
import { act, waitFor } from '@testing-library/react'

// With act
act(() => {
  fireEvent.click(button)
})

// With waitFor for async effects
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

### Keyboard Events

```tsx
fireEvent.keyDown(document, { key: 'Escape' })
fireEvent.keyDown(element, { key: 'Tab', shiftKey: true })
```
