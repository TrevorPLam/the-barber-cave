# Testing Guide

This document outlines the testing setup and best practices for the Trills Barber Cave project.

## Overview

The project includes multiple testing strategies:

1. **Unit Testing** - Vitest with React Testing Library
2. **Visual Regression Testing** - Storybook with Chromatic
3. **End-to-End Testing** - Playwright
4. **Component Documentation** - Storybook

## Testing Scripts

```bash
# Unit tests
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ui           # Run tests with UI interface

# Storybook
npm run storybook         # Start Storybook development server
npm run build-storybook   # Build Storybook for production

# Visual testing
npm run test:visual       # Run visual regression tests with Chromatic

# E2E testing
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Run Playwright tests with UI
```

## Unit Testing

Unit tests are located in:
- `src/components/__tests__/` - Component tests
- `src/app/__tests__/` - Page tests
- `src/__tests__/` - Utility and hook tests

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Visual Regression Testing

Visual regression tests ensure UI consistency across changes.

### Setup

1. Run Storybook: `npm run storybook`
2. Set up Chromatic project and add project token to environment variables
3. Run visual tests: `npm run test:visual`

### Component Stories

Components should have corresponding `.stories.tsx` files:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import Component from './Component';

const meta = {
  title: 'Components/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithProps: Story = {
  args: {
    prop: 'value',
  },
};
```

## End-to-End Testing

E2E tests verify user workflows and application behavior.

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts
```

### Test Structure

E2E tests are located in `tests/e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Expected Title');
  });
});
```

### Test Configuration

Playwright configuration is in `playwright.config.ts`:
- Multiple browsers (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic server startup
- Screenshots and videos on failure

## Error Handling

The application includes comprehensive error handling:

### Error Boundaries

- **Global Error Boundary**: Wraps the entire app in `layout.tsx`
- **Component-level Boundaries**: `SafeComponent` wrapper for individual components
- **Custom Fallbacks**: `ErrorFallback` component for consistent error UI

### Error Reporting

In development, errors are logged to the console. In production, integrate with error reporting services:

```typescript
// In ErrorBoundary.tsx
if (process.env.NODE_ENV === 'production') {
  // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
}
```

## Performance Optimization

### React.memo

Components are optimized with `React.memo` to prevent unnecessary re-renders:

```typescript
export default memo(function Component({ prop }: Props) {
  // Component logic
});
```

### Lazy Loading

Non-critical components are lazy-loaded with `dynamic` import:

```typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});
```

## Best Practices

### Testing

1. **Test user behavior, not implementation details**
2. **Use meaningful test names and descriptions**
3. **Keep tests focused and independent**
4. **Use proper assertions and matchers**
5. **Mock external dependencies**

### Error Handling

1. **Wrap components in error boundaries**
2. **Provide meaningful error messages**
3. **Include recovery options**
4. **Log errors appropriately**
5. **Test error scenarios**

### Performance

1. **Use React.memo for expensive components**
2. **Lazy load non-critical components**
3. **Optimize bundle size**
4. **Monitor performance metrics**
5. **Test on various devices and connections**

## CI/CD Integration

### GitHub Actions

Add these workflows to `.github/workflows/`:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

### Visual Testing

```yaml
# .github/workflows/visual.yml
name: Visual Tests
on: [push, pull_request]
jobs:
  visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build-storybook
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Troubleshooting

### Common Issues

1. **Tests failing intermittently**: Increase timeouts or add proper waits
2. **Visual test failures**: Check for browser differences or timing issues
3. **E2E test failures**: Verify selectors and element states
4. **Performance issues**: Profile components and check for unnecessary re-renders

### Debugging

1. Use `npm run test:ui` for interactive test debugging
2. Use Playwright's `test:e2e:ui` for step-by-step execution
3. Check browser console for additional error information
4. Use React DevTools for component inspection

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Storybook Documentation](https://storybook.js.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Chromatic Documentation](https://www.chromatic.com/docs)
