# Debugging Guide — The Barber Cave

A reference for common errors, troubleshooting steps, and debugging workflows.

---

## Table of Contents

- [TypeScript Errors](#typescript-errors)
- [Next.js Build Errors](#nextjs-build-errors)
- [Test Failures](#test-failures)
- [Environment Variable Errors](#environment-variable-errors)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)
- [Accessibility Test Failures](#accessibility-test-failures)
- [Storybook Issues](#storybook-issues)
- [Useful Debug Commands](#useful-debug-commands)

---

## TypeScript Errors

### `error TS1005: '>' expected` in `.ts` files with JSX

**Cause**: A file contains JSX syntax (e.g., `<Component />`) but has a `.ts` extension instead of `.tsx`.

**Fix**: Rename the file to `.tsx`:
```bash
mv src/store/my-file.ts src/store/my-file.tsx
```

---

### `error TS2554: Expected 1 arguments, but got 0` on `useRef()`

**Cause**: React 19 requires an explicit initial value for `useRef` when the type does not include `undefined`.

**Fix**: Pass an explicit initial value:
```tsx
// ✅ Correct
const ref = useRef<MyType | undefined>(undefined)

// ❌ No longer valid in React 19 strict typings
const ref = useRef<MyType>()
```

---

### `error TS2339: Property 'X' does not exist on type 'Y'`

1. Check if the property is defined in the interface/type.
2. If the type comes from a library, check if `@types/<package>` needs to be installed.
3. Run `npm run lint` — ESLint may surface the root cause.

---

## Next.js Build Errors

### `Turbopack incompatibility` / `Module not found`

1. Check `next.config.ts` — ensure `serverExternalPackages` is at the root level, not inside `experimental`.
2. Clear the `.next` cache:
   ```bash
   rm -rf .next && npm run build
   ```

---

### `Route Handler type mismatch` in `src/app/api/auth/[...nextauth]/route.ts`

**Fix**: Export the handler correctly for Next.js App Router:
```ts
export { handler as GET, handler as POST }
```

---

### `Cannot find module '@/...'`

**Cause**: Path alias `@/` is not resolved.

**Fix**: Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

And `vitest.config.ts` has the matching alias:
```ts
resolve: {
  alias: { '@': resolve(__dirname, './src') }
}
```

---

## Test Failures

### `Error: useSession must be wrapped in a SessionProvider`

**Cause**: Tests rendering `Navigation` (which calls `useSession`) without mocking `next-auth/react`.

**Fix**: Add the mock at the top of the test file:
```tsx
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))
```

---

### `Error: Invalid hook call` / React `$$typeof` errors in tests

**Cause**: `react-dom` was mocked with a plain object, breaking React's internal type checks.

**Fix**: Use `importOriginal` when mocking `react-dom`:
```tsx
vi.mock('react-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-dom')>()
  return { ...original }
})
```

---

### `Warning: An update to X inside a test was not wrapped in act(...)`

**Cause**: State updates triggered outside of `act()`.

**Fix**: Wrap interactions and state-triggering events:
```tsx
import { act, waitFor } from '@testing-library/react'

act(() => {
  fireEvent.click(button)
})

// Or for async effects
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

---

### Tests pass locally but fail in CI

1. Check if environment variables are set in GitHub Actions secrets.
2. Run the same test in isolation: `npm test -- --run src/path/to/test.tsx`
3. Check if the test depends on test ordering (tests should be independent).
4. Look for `process.env` reads without fallback values.

---

## Environment Variable Errors

### `ZodError: Invalid input: expected string, received undefined`

**Cause**: `src/lib/env.ts` validates required env vars at import time. If any are missing, all tests that import from `src/data/constants.ts` will fail.

**Fix**:
1. Create `.env.local` with all required variables (see `.env.example`).
2. For tests, mock the module or provide env vars in the test setup:
   ```ts
   // vitest.setup.ts or test file
   process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
   process.env.NEXTAUTH_SECRET = 'test-secret'
   process.env.NEXTAUTH_URL = 'http://localhost:3000'
   process.env.ADMIN_EMAIL = 'admin@test.com'
   process.env.ADMIN_PASSWORD_HASH = '$2b$10$testhashabcdef'
   process.env.CSRF_SECRET = 'test-csrf-secret'
   process.env.DATABASE_URL = 'postgres://localhost/test'
   ```

---

## Authentication Issues

### `NEXTAUTH_SECRET` missing

**Symptom**: Signing in fails with a server error.

**Fix**: Set `NEXTAUTH_SECRET` in `.env.local`:
```
NEXTAUTH_SECRET=your-secret-here
```
Generate a secure value with:
```bash
openssl rand -base64 32
```

---

### Admin login fails

1. Verify `ADMIN_EMAIL` matches the email you're entering.
2. Verify `ADMIN_PASSWORD_HASH` is a valid bcrypt hash of your password:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(console.log)"
   ```

---

## Database Issues

### `ECONNREFUSED` / cannot connect to database

1. Ensure your PostgreSQL server is running.
2. Verify `DATABASE_URL` in `.env.local` is correct.
3. Test connectivity:
   ```bash
   psql "$DATABASE_URL" -c "SELECT 1"
   ```

---

### Schema drift after pulling changes

Run migrations to sync the schema:
```bash
npm run db:migrate
```

To inspect the current schema:
```bash
npm run db:studio
```

---

## Accessibility Test Failures

### `axe` reports `color-contrast` violation

1. Check the Tailwind class being used — ensure text meets WCAG AA 4.5:1 ratio.
2. Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.
3. Update the color token in `globals.css` or use a darker/lighter Tailwind shade.

---

### `axe` reports `link-name` violation

**Cause**: An `<a>` element has no text or `aria-label`.

**Fix**:
```tsx
// ✅ Correct
<a href="..." aria-label="Visit The Barber Cave homepage">
  <Scissors aria-hidden="true" />
</a>

// ❌ Missing accessible name
<a href="...">
  <Scissors />
</a>
```

---

### `axe` reports `nested-interactive` violation

**Cause**: A focusable element (e.g., `<button>`) is nested inside another focusable element.

**Fix**: Restructure the DOM so interactive elements are siblings, not nested.

---

## Storybook Issues

### Storybook fails to start

```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook
npm run storybook
```

### Story throws `Error: useSession not available`

Add a decorator that mocks session state in `.storybook/preview.tsx`:
```tsx
import { SessionProvider } from 'next-auth/react'

export const decorators = [
  (Story) => (
    <SessionProvider session={null}>
      <Story />
    </SessionProvider>
  ),
]
```

---

## Useful Debug Commands

```bash
# TypeScript type check (no emit)
./node_modules/.bin/tsc --noEmit

# Lint the entire project
npm run lint

# Run a single test file
npm test -- --run src/components/__tests__/Navigation.test.tsx

# Run tests matching a pattern
npm test -- --run --reporter=verbose -t "mobile menu"

# Build for production (catches build-time errors)
npm run build

# Analyze bundle size
ANALYZE=true npm run build

# Check for unused dependencies
npx depcheck

# View Drizzle schema / database
npm run db:studio
```
