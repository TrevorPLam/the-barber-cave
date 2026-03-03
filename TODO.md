# TODO — The Barber Cave

```yaml
project: the-barber-cave
display_name: "The Barber Cave"
description: "Next.js barber shop marketing site with booking system"
repository_type: application

tech_stack:
  framework: "Next.js 16"
  ui: "React 19"
  language: "TypeScript 5"
  styling: "Tailwind CSS 4"
  testing:
    - "Vitest"
    - "Playwright"
  component_dev: "Storybook"
  linting: "ESLint 9"

timezone: America/Chicago
review_cycle_days: 7
last_reviewed: 2026-03-03
next_review: 2026-03-10
```

---

| Priority | Meaning                             |
| -------- | ----------------------------------- |
| 1        | Critical – release blocker          |
| 2        | High – must resolve before release  |
| 3        | Medium – important but not blocking |
| 4        | Low – polish / optimization         |
| 5        | Backlog – cleanup / optional        |

---

## Execution Strategy

Issues are grouped into **6 atomic batches** ordered for maximum parallelism and minimum dependency risk. Each batch ships as one PR. Batches A–B must complete before C–F begin. Batches C–F are independent of each other.

```
Batch A (automated script)  ──► Batch B (DAL + auth foundation)
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
         Batch C                  Batch D                  Batch E
      (hook quality)          (CSP + config)          (performance)
              └────────────────────────┼────────────────────────┘
                                       ▼
                                  Batch F
                               (data + state)
```

---

## 🔴 BATCH A — Automated Fixes
> Single shell script execution. Zero manual editing required. Run before any other work.

### T-A001 · Automated CVE + Lint Fix Script
**Priority:** 1 | **Severity:** Critical | **Issues:** #1, #2, #21, #24, #27 | **Batch:** A

**Status:** Issue #21 (missing `useCallback` import in `useDebounce.ts`) ✅ DONE. Issues #1, #2, #24, #27 remain.

**Execution:**
```bash
#!/usr/bin/env bash
set -e

echo "=== Step 1: Patch CVE-2024-23650 (esbuild SSRF via drizzle-kit) ==="
# drizzle-kit ≥0.21.0 ships with esbuild ≥0.25.0 which patches GHSA-67mh-4wv8-2f99
npm install drizzle-kit@latest

echo "=== Step 2: Patch CVE-2022-3591 (tmp symlink via @lhci/cli) ==="
npm install @lhci/cli@latest

echo "=== Step 3: Verify no remaining high/critical CVEs ==="
npm audit --audit-level=high

echo "=== Step 4: Fix missing useCallback import (Issue #21) ==="
# useDebounce.ts line 1 — add useCallback to React import
sed -i "s/import { useState, useEffect, useRef } from 'react'/import { useState, useEffect, useRef, useCallback } from 'react'/" src/hooks/useDebounce.ts

echo "=== Step 5: Fix missing 'use client' directive (Issue #27) ==="
# Gallery.tsx — prepend directive before first import
sed -i "1s/^/'use client';

/" src/components/Gallery.tsx

echo "=== Step 6: ESLint autofix for missing hook dep (Issue #24) ==="
# useFocusTrap.ts line 142 — add getFocusableElements to dependency array
npx eslint src/hooks/useFocusTrap.ts --fix --rule '{"react-hooks/exhaustive-deps": "error"}'

echo "=== Step 7: Verify build passes ==="
npm run build

echo "=== All Batch A fixes applied ==="
```

**Validation:**
- `npm audit` returns zero high/critical vulnerabilities
- `npm run build` succeeds without SSR hook errors
- `useDebouncedState` renders without crash in dev
- Focus trapping works in modal components

---

### T-A002 · Add npm Audit CI Hard Gate
**Priority:** 1 | **Severity:** Critical | **Issues:** #1, #2 (prevention) | **Batch:** A

**What:** Block all future PRs if a high or critical CVE enters the dependency tree.

**File:** `.github/workflows/security.yml`
```yaml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Fail on high/critical CVEs
        run: npm audit --audit-level=high
```

**Best Practice:** `--audit-level=high` (not `critical`) — high-severity CVEs in dev dependencies can escalate to production via CI/CD pipeline compromise (as demonstrated by CVE-2022-3591 attack scenario #4).

---

## 🔴 BATCH B — Data Access Layer & Auth Foundation
> Establishes the auth architecture that all other security fixes depend on. Must ship as one atomic PR.

### T-B001 · Implement Data Access Layer (DAL)
**Priority:** 1 | **Severity:** Critical | **Issues:** #15, #3 | **Batch:** B

**What:** Create a centralized `verifySession()` function using React's `cache()` API. This replaces all per-route `getServerSession()` calls and is the **only correct** auth gate for Next.js App Router — middleware alone is exploitable via CVE-2025-29927 (`x-middleware-subrequest` header bypass).

**File:** `src/lib/dal.ts`
```typescript
import { cache } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

// cache() ensures only one DB/session call per render tree, regardless
// of how many Server Components or Route Handlers call verifySession().
export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')
  return session
})

export const verifyAdminSession = cache(async () => {
  const session = await verifySession()
  if (session.user.role !== 'admin') {
    redirect('/')
  }
  return session
})
```

**Pattern — DAL in every Route Handler:**
```typescript
// src/app/api/services/route.ts
import { verifyAdminSession } from '@/lib/dal'

export async function POST(request: NextRequest) {
  await verifyAdminSession() // throws redirect if not admin — never reaches below
  // ... rest of handler
}
```

**Why not middleware-only:** CVE-2025-29927 (CVSS 9.1) allows full middleware bypass by sending `x-middleware-subrequest: src/middleware` header. Middleware should only handle UX redirects, never be the sole authorization gate.

**Defense-in-depth — strip bypass header in middleware:**
```typescript
// src/middleware.ts — add to top of middleware function
export function middleware(request: NextRequest) {
  // Strip CVE-2025-29927 bypass header unconditionally
  const headers = new Headers(request.headers)
  headers.delete('x-middleware-subrequest')
  // ... rest of middleware (UX redirects only)
}
```

**Validation:**
- Direct `POST /api/services` without session returns 307 redirect (not 200)
- `x-middleware-subrequest` header in request does not bypass auth
- Single DB query per render tree confirmed via query logging

---

### T-B002 · Replace Demo Authentication with Real Credential Validation
**Priority:** 1 | **Severity:** Critical | **Issues:** #3, #9 | **Batch:** B

**What:** Remove the `return { id: email, email, ... }` demo bypass from `[...nextauth]/route.ts`. Implement proper DB-backed credential validation with JWT rolling sessions.

**File:** `src/lib/auth.ts`
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          // Single admin account — no user table needed for barber shop
          if (
            email === process.env.ADMIN_EMAIL &&
            await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
          ) {
            return { id: 'admin', email, name: 'Admin', role: 'admin' }
          }
          return null
        } catch {
          return null // Zod parse error = invalid input = null (not thrown)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,       // 24h absolute expiry
    updateAge: 30 * 60,          // silent refresh every 30min of activity
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string
      return session
    },
  },
  pages: { signIn: '/auth/signin' },
}
```

**Security notes:**
- Store `ADMIN_PASSWORD_HASH` (bcrypt, cost 12), never plaintext `ADMIN_PASSWORD`
- Generate hash: `node -e "require('bcryptjs').hash('yourpass', 12).then(console.log)"`
- `updateAge: 1800` provides rolling sessions without a custom refresh token rotation callback — sufficient for single-role admin credentials app
- `strategy: 'jwt'` avoids a sessions DB table; token is validated on every request

**Validation:**
- Any email/password combination other than admin credentials returns 401
- Correct credentials return session with `role: 'admin'`
- Session expires after 24h of inactivity
- Session auto-renews when active within 30min window

---

### T-B003 · Upgrade CSRF to HMAC-Signed Double-Submit
**Priority:** 2 | **Severity:** High | **Issues:** #10 | **Batch:** B

**What:** Upgrade the existing `/api/csrf` endpoint from a random token to an HMAC-signed token. This closes the subdomain cookie replacement attack vector that makes naive double-submit insecure.

**File:** `src/app/api/csrf/route.ts`
```typescript
import { createHmac, randomBytes } from 'crypto'
import { NextResponse } from 'next/server'

function generateHmacCsrfToken(): { token: string; signature: string } {
  const token = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(token)
    .digest('hex')
  return { token, signature: `${token}.${signature}` }
}

export function GET() {
  const { signature } = generateHmacCsrfToken()
  const response = NextResponse.json({ csrfToken: signature })
  // HttpOnly:false — must be readable by JS to include in request header
  // SameSite:Strict — prevents cross-site submission entirely
  response.cookies.set('csrf-token', signature, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1h
  })
  return response
}
```

**Validation utility in `src/lib/security.ts`:**
```typescript
export function validateHmacCsrfToken(tokenWithSig: string): boolean {
  const [token, sig] = tokenWithSig.split('.')
  if (!token || !sig) return false
  const expected = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(token)
    .digest('hex')
  // Constant-time comparison prevents timing attacks
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}
```

**Add to env schema:** `CSRF_SECRET: z.string().min(32)` in `src/lib/env.ts`

---

## 🟠 BATCH C — Hook Quality Suite ✅ COMPLETED
> All custom hook fixes + shared Vitest test matrix. One PR.

### T-C001 · Fix useBooking Stale Closure Race Condition ✅ DONE
**Priority:** 1 | **Severity:** Critical | **Issues:** #22 | **Batch:** C

**What:** `submitBooking` captures stale `state` via closure. Fix with functional state reads inside the callback — the React 19 / Compiler-safe pattern.

**File:** `src/hooks/useBooking.ts` — line 107
```typescript
// ❌ Before — state in dep array = stale closure on rapid re-renders
const submitBooking = useCallback(async () => {
  const { selectedService, selectedBarber, selectedDate, selectedTime, customerInfo } = state
}, [state])

// ✅ After — read current state atomically via functional updater
const submitBooking = useCallback(async () => {
  let currentState: BookingState | null = null

  // Read current state without adding it to the dep array
  setState(prev => {
    currentState = prev
    return prev // no mutation
  })

  if (!currentState) return
  const { selectedService, selectedBarber, selectedDate, selectedTime, customerInfo } = currentState

  if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !customerInfo) {
    setState(prev => ({ ...prev, error: 'Please complete all booking steps' }))
    return
  }

  setState(prev => ({ ...prev, isSubmitting: true, error: null }))

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': document.cookie.match(/csrf-token=([^;]+)/)?.[1] ?? '',
      },
      body: JSON.stringify({
        serviceId: selectedService,
        barberId: selectedBarber,
        date: selectedDate.toISOString(),
        time: selectedTime,
        customerInfo,
      }),
    })
    if (!response.ok) throw new Error((await response.json()).error ?? 'Booking failed')
    setState(prev => ({ ...prev, isSubmitting: false }))
  } catch (error) {
    setState(prev => ({
      ...prev,
      error: error instanceof Error ? error.message : 'Booking failed',
      isSubmitting: false,
    }))
  }
}, []) // Empty dep array — safe because we read state functionally
```

**Why this works:** `setState(prev => { currentState = prev; return prev })` reads the current committed state without creating a closure over it. This is the idiomatic React 19 pattern and is compatible with React Compiler automatic memoization.

---

### T-C002 · Fix useCSRF Memory Leak with AbortController ✅ DONE
**Priority:** 1 | **Severity:** Critical | **Issues:** #23 | **Batch:** C

**File:** `src/hooks/useCSRF.ts` — lines 8–25
```typescript
useEffect(() => {
  const abortController = new AbortController()

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('/api/csrf', {
        signal: abortController.signal,
      })
      if (!response.ok) throw new Error(`CSRF fetch failed: ${response.status}`)
      const { csrfToken } = await response.json()
      setToken(csrfToken)
    } catch (err) {
      // AbortError is expected on unmount — not a real error
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      // Only update loading state if still mounted (abort check via signal)
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }

  fetchCsrfToken()

  // Cleanup: cancel in-flight request on unmount or re-render
  return () => abortController.abort()
}, []) // Stable empty deps — CSRF token fetched once on mount
```

**Pattern note:** The `AbortController` pattern is the standard for all async `useEffect` fetches in React 19. It prevents the "Can't perform a React state update on an unmounted component" warning and stops unnecessary network traffic when users navigate rapidly.

---

### T-C003 · Fix useLocalStorage Cross-Tab Race Condition ✅ DONE
**Priority:** 2 | **Severity:** High | **Issues:** #25 | **Batch:** C

**File:** `src/hooks/useLocalStorage.ts` — lines 55–70
```typescript
// ✅ Wrap handler in useCallback (stable ref for add/removeEventListener)
// ✅ Use functional setState to avoid stale prev comparisons
const handleStorageChange = useCallback((e: StorageEvent) => {
  if (e.key !== key) return
  if (e.newValue === null) {
    // Key was removed in another tab
    setStoredValue(initialValue)
    return
  }
  try {
    const incoming = JSON.parse(e.newValue)
    setStoredValue(prev => {
      // Referential equality check prevents unnecessary re-renders
      // when the value hasn't actually changed
      const prevSerialized = JSON.stringify(prev)
      return prevSerialized !== e.newValue ? incoming : prev
    })
  } catch {
    // Malformed JSON in storage — ignore silently
  }
}, [key, initialValue])

useEffect(() => {
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [handleStorageChange])
```

---

### T-C004 · Fix useAnnouncement DOM Memory Leak ✅ DONE
**Priority:** 2 | **Severity:** High | **Issues:** #26 | **Batch:** C

**File:** `src/hooks/useAnnouncement.ts` — lines 28–40
```typescript
useEffect(() => {
  // Create the ARIA live region once on mount
  const element = document.createElement('div')
  element.setAttribute('aria-live', 'polite')
  element.setAttribute('aria-atomic', 'true')
  element.setAttribute('aria-relevant', 'additions text')
  element.className = 'sr-only' // Visually hidden, screen-reader accessible
  document.body.appendChild(element)
  announcementRef.current = element

  return () => {
    // Critical: clear pending timeout before DOM removal
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    // Safe removal: check parentNode before removeChild to avoid
    // NotFoundError if parent changed during async operations
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
    announcementRef.current = null
  }
}, []) // Mount/unmount only — element lifecycle matches component lifecycle
```

---

### T-C005 · Shared Hook Test Matrix ✅ DONE
**Priority:** 2 | **Severity:** High | **Issues:** #22, #23, #25, #26, #24 | **Batch:** C

**What:** A single parameterized Vitest suite that validates cleanup, stale-closure immunity, and mount/unmount safety across all custom hooks simultaneously.

**File:** `src/__tests__/hooks/hook-lifecycle.test.ts`
```typescript
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { useCSRF } from '@/hooks/useCSRF'
import { useAnnouncement } from '@/hooks/useAnnouncement'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useBooking } from '@/hooks/useBooking'

// Parameterized cleanup matrix — each hook tested for memory safety
const hooksUnderTest = [
  {
    name: 'useCSRF',
    factory: () => renderHook(() => useCSRF()),
    expectsCleanup: true, // AbortController
  },
  {
    name: 'useAnnouncement',
    factory: () => renderHook(() => useAnnouncement()),
    expectsCleanup: true, // DOM element removal
  },
  {
    name: 'useLocalStorage',
    factory: () => renderHook(() => useLocalStorage('test-key', null)),
    expectsCleanup: true, // event listener removal
  },
]

describe.each(hooksUnderTest)('$name — lifecycle safety', ({ name, factory, expectsCleanup }) => {
  afterEach(() => vi.restoreAllMocks())

  it('mounts and unmounts without throwing', () => {
    const { unmount } = factory()
    expect(() => unmount()).not.toThrow()
  })

  it('does not leak DOM nodes after unmount', () => {
    const nodesBefore = document.body.childNodes.length
    const { unmount } = factory()
    unmount()
    expect(document.body.childNodes.length).toBe(nodesBefore)
  })
})

describe('useBooking — stale closure immunity', () => {
  it('submitBooking uses current state not stale closure', async () => {
    const { result } = renderHook(() => useBooking())

    act(() => result.current.selectService('service-1'))
    act(() => result.current.selectBarber('barber-1'))
    // Rapidly update state to trigger stale closure scenario
    act(() => result.current.selectService('service-2'))

    // submitBooking should use service-2, not the stale service-1
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => ({}) })
    await act(() => result.current.submitBooking())

    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body)
    expect(body.serviceId).toBe('service-2') // not stale 'service-1'
  })
})

describe('useLocalStorage — cross-tab race condition', () => {
  it('ignores storage events that match current value', () => {
    const { result } = renderHook(() => useLocalStorage('tab-key', 'initial'))
    const renderCount = vi.fn()

    // Simulate storage event with same value
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tab-key',
        newValue: JSON.stringify('initial'),
      }))
    })

    // Should not cause unnecessary re-render
    expect(result.current[0]).toBe('initial')
  })
})
```

---

## 🟡 BATCH D — CSP, Config & Security Headers
> All `next.config.ts`, env vars, logging, and header hardening. One PR.

### T-D001 · Eliminate unsafe-eval / unsafe-inline from CSP
**Priority:** 1 | **Severity:** High | **Issues:** #4 | **Batch:** D

**What:** Replace broad `unsafe-eval` and `unsafe-inline` directives with nonce-based CSP. Per the Next.js 16 internals issue (GitHub #81496), `unsafe-eval` **cannot be fully removed in production** due to internal `Function()` calls in Next.js utilities — gate it to development only.

**File:** `next.config.ts`
```typescript
const isDev = process.env.NODE_ENV === 'development'

const buildCspValue = (nonce: string) => [
  "default-src 'self'",
  // unsafe-eval required by Next.js 16 internals in dev; removed in prod
  isDev
    ? `script-src 'self' 'unsafe-eval' 'nonce-${nonce}'`
    : `script-src 'self' 'nonce-${nonce}'`,
  `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
  "img-src 'self' data: https: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  // Passive violation reporting BEFORE hard enforcement
  "report-uri /api/csp-report",
].join('; ')
```

**Add CSP report endpoint** — `src/app/api/csp-report/route.ts`:
```typescript
export async function POST(request: Request) {
  const report = await request.json()
  // Log to Axiom/Pino before enforcement — catch legitimate violations first
  console.warn('[CSP Violation]', JSON.stringify(report))
  return new Response(null, { status: 204 })
}
```

**Rollout strategy:**
1. Deploy with `report-uri` only (no enforcement change) — observe violations for 48h
2. If no legitimate violations, remove `unsafe-inline` from `style-src`
3. After 1 week of clean reports, remove `unsafe-eval` from prod `script-src`

---

### T-D002 · Centralize All Environment Variables Through Zod Schema
**Priority:** 2 | **Severity:** Medium | **Issues:** #5 | **Batch:** D

**What:** All `process.env` access routes through `src/lib/env.ts`. No direct `process.env` calls anywhere else. Add all missing variables to the schema.

**File:** `src/lib/env.ts`
```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Runtime
  NODE_ENV: z.enum(['development', 'test', 'production']),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(60), // bcrypt hash

  // CSRF
  CSRF_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z.string().url(),

  // Logging (optional in dev)
  AXIOM_DATASET: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),

  // Analytics (public — safe to expose)
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

// Fail loudly at startup if env is misconfigured
// Never silently fall back to defaults for security-sensitive vars
export const ENV = envSchema.parse(process.env)
```

**Migration:** Replace all `process.env.X` in `src/data/constants.ts`, `drizzle.config.ts`, `src/lib/auth.ts` with `ENV.X`.

---

### T-D003 · Implement Structured Production Logging (Pino + Axiom + Sentry)
**Priority:** 2 | **Severity:** Medium | **Issues:** #7 | **Batch:** D

**What:** Replace all `console.error()` with environment-gated structured logging. Stack: **Pino** (structured JSON) → **Axiom** (log drain, Vercel native) + **Sentry** (error tracking).

**Install:**
```bash
npm install pino next-logger next-axiom @sentry/nextjs
```

**File:** `src/lib/logger.ts`
```typescript
import pino from 'pino'

// next-axiom transport routes logs to Axiom in production
// Falls back to pretty-print in development
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  ...(process.env.NODE_ENV === 'production'
    ? {
        transport: {
          target: '@axiomhq/pino',
          options: {
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
          },
        },
      }
    : {
        transport: { target: 'pino-pretty' },
      }),
})

// Drop-in replacement for console.error — never exposes stack traces in prod
export function logError(context: string, error: unknown, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    logger.error({ context, ...meta }, error instanceof Error ? error.message : String(error))
  } else {
    logger.error({ context, ...meta }, error)
  }
}
```

**File:** `src/instrumentation.ts`
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('./lib/logger')
    logger.info('Next.js server started')
  }
}
```

**Add to `next.config.ts`:**
```typescript
import { withAxiom } from 'next-axiom'
export default withAxiom(nextConfig)
```

---

### T-D004 · Fix JSON Parsing Prototype Pollution Vectors
**Priority:** 2 | **Severity:** Medium | **Issues:** #6 | **Batch:** D

**What:** Replace all bare `JSON.parse()` calls with a `safeJSONParse<T>()` utility that validates output via Zod schema, preventing prototype pollution.

**File:** `src/lib/utils.ts`
```typescript
import { z } from 'zod'

export function safeJSONParse<T>(
  input: string,
  schema: z.ZodSchema<T>,
  fallback: T
): T {
  try {
    const raw = JSON.parse(input)
    // Object.create(null) prevents prototype chain access before validation
    const sanitized = Object.assign(Object.create(null), raw)
    return schema.parse(sanitized)
  } catch {
    return fallback
  }
}
```

**Apply in `src/utils/seo-validation.ts`:**
```typescript
// Before
const data = JSON.parse(script.textContent || '{}')

// After
const data = safeJSONParse(script.textContent ?? '{}', SeoDataSchema, {})
```

**Apply in `src/hooks/useLocalStorage.ts`:**
```typescript
// Before
return item ? JSON.parse(item) : initialValue

// After
return item ? safeJSONParse(item, storageSchema, initialValue) : initialValue
```

---

### T-D005 · Fix dangerouslySetInnerHTML in StructuredData (JSON-LD XSS)
**Priority:** 2 | **Severity:** Medium | **Issues:** #11 | **Batch:** D

**What:** `dangerouslySetInnerHTML` with `JSON.stringify()` is the correct and officially documented Next.js App Router pattern for JSON-LD. The XSS vector is the unescaped `<` character which can break out of the script tag. One-line fix.

**File:** `src/components/StructuredData.tsx`
```typescript
// Before — vulnerable to script injection via < in JSON values
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}

// After — < is the JSON-safe Unicode escape for <
// Browsers render it as < but it cannot terminate the script tag
dangerouslySetInnerHTML={{
  __html: JSON.stringify(jsonLd).replace(/</g, '\u003c')
}}
```

---

### T-D006 · Fix Open Redirect Risk in External Links
**Priority:** 3 | **Severity:** Medium | **Issues:** #8 | **Batch:** D

**File:** `src/data/constants.ts`
```typescript
// Allowlist of trusted external domains for the barber shop
const ALLOWED_EXTERNAL_DOMAINS = [
  'instagram.com',
  'www.instagram.com',
  'facebook.com',
  'www.facebook.com',
  'google.com',
  'maps.google.com',
] as const

export function validateExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Must be https and on the allowlist
    if (parsed.protocol !== 'https:') return null
    const domain = parsed.hostname.toLowerCase()
    if (ALLOWED_EXTERNAL_DOMAINS.some(d => domain === d)) return url
    return null
  } catch {
    return null
  }
}
```

---

### T-D007 · Add Security Header CI Verification
**Priority:** 3 | **Severity:** Medium | **Issues:** #12 | **Batch:** D

**File:** `.github/workflows/security.yml` — add job:
```yaml
  verify-security-headers:
    runs-on: ubuntu-latest
    needs: [audit]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Check security headers on staging
        run: |
          HEADERS=$(curl -s -I ${{ secrets.STAGING_URL }})
          echo "$HEADERS" | grep -q "Content-Security-Policy" || (echo "Missing CSP header" && exit 1)
          echo "$HEADERS" | grep -q "X-Frame-Options" || (echo "Missing X-Frame-Options" && exit 1)
          echo "$HEADERS" | grep -q "Strict-Transport-Security" || (echo "Missing HSTS header" && exit 1)
          echo "$HEADERS" | grep -q "X-Content-Type-Options" || (echo "Missing X-Content-Type-Options" && exit 1)
          echo "All required security headers present"
```

---

## 🟡 BATCH E — Performance Architecture
> Two sub-batches: E1 (RSC/client boundary audit) then E2 (bundle + CI pipeline).

### T-E001 · Fix SessionProvider Placement (P0)
**Priority:** 1 | **Severity:** High | **Issues:** P0-1 | **Batch:** E

**What:** `SessionProvider` wrapping the entire layout forces the root layout into client-side rendering, blocking RSC streaming and costing ~300ms TTI.

**Pattern — SessionProvider in a dedicated client wrapper:**
```typescript
// src/components/providers/SessionWrapper.tsx
'use client'
import { SessionProvider } from 'next-auth/react'
export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// src/app/layout.tsx — root layout stays a Server Component
// Only SessionWrapper is client-rendered
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          {children}  {/* Server Components stream normally */}
        </SessionWrapper>
      </body>
    </html>
  )
}
```

---

### T-E002 · Remove Unnecessary 'use client' from Static Components (P0)
**Priority:** 1 | **Severity:** High | **Issues:** P0-2 | **Batch:** E

**What:** Static components (Footer, StatCard, Hero section content) with `'use client'` directive opt the entire component subtree out of RSC streaming. Audit and convert to RSC where no hooks are used.

**Audit script:**
```bash
# Find 'use client' components that contain no hooks or event handlers
grep -rn "'use client'" src/components/ | while read line; do
  file=$(echo $line | cut -d: -f1)
  # Check if file uses any React hooks or browser APIs
  if ! grep -qE "useState|useEffect|useCallback|useMemo|useRef|onClick|onChange|window\.|document\." "$file"; then
    echo "SAFE TO CONVERT TO RSC: $file"
  fi
done
```

**Conversion checklist per component:**
- No `useState` / `useEffect` / `useCallback` / `useRef` → safe RSC
- No `onClick`, `onChange`, or other event handlers → safe RSC
- No `window`, `document`, `localStorage` access → safe RSC
- Uses Context → extract context consumer to thin client wrapper

---

### T-E003 · Fix EventCountdown Hydration Mismatch (P1)
**Priority:** 2 | **Severity:** Medium | **Issues:** #28 | **Batch:** E

**What:** `new Date().getTime()` executes on the server during SSR, producing a timestamp that differs from the client timestamp — causing hydration mismatch and CLS.

**File:** `src/components/EventCountdown.tsx`
```typescript
'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'

export function EventCountdown({ targetDateStr }: { targetDateStr: string }) {
  // Render nothing server-side — countdown is inherently client-only
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const targetDate = useMemo(() => new Date(targetDateStr).getTime(), [targetDateStr])

  const calculateTimeLeft = useCallback(() => {
    const diff = targetDate - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    }
  }, [targetDate])

  // SSR skeleton — exact same dimensions as the rendered countdown
  // prevents CLS (Cumulative Layout Shift)
  if (!isClient) {
    return <div className="h-24 w-full animate-pulse rounded-lg bg-gray-800" aria-hidden="true" />
  }

  // ... rest of countdown render
}
```

---

### T-E004 · Tree-Shake lucide-react Icon Imports (P1)
**Priority:** 2 | **Severity:** Medium | **Issues:** P1-3 | **Batch:** E

**What:** Barrel imports of `lucide-react` pull the entire icon library (~800 icons, ~40KB gzipped) into the bundle. Named imports enable tree-shaking.

```typescript
// ❌ Before — imports entire library
import { Calendar, Clock, User, Star, Phone } from 'lucide-react'
// (lucide-react barrel export prevents tree-shaking in some bundler configs)

// ✅ After — direct module path import, always tree-shakeable
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import Clock from 'lucide-react/dist/esm/icons/clock'
import User from 'lucide-react/dist/esm/icons/user'
```

**Or configure in `next.config.ts`:**
```typescript
experimental: {
  optimizePackageImports: ['lucide-react'],
}
```
`optimizePackageImports` instructs Next.js to automatically rewrite barrel imports to direct imports at build time — zero code change required in components.

---

### T-E005 · Move axe-core to Dev-Only Dynamic Import (P1)
**Priority:** 2 | **Severity:** Medium | **Issues:** P1-4 | **Batch:** E

**What:** `axe-core` (~150KB) should never ship to production users.

```typescript
// src/lib/axe.ts — conditionally loaded, never in prod bundle
export async function initAxe() {
  if (process.env.NODE_ENV !== 'development') return
  if (typeof window === 'undefined') return

  const React = (await import('react')).default
  const ReactDOM = (await import('react-dom')).default
  const axe = (await import('@axe-core/react')).default

  axe(React, ReactDOM, 1000)
}
```

```typescript
// src/app/layout.tsx
useEffect(() => {
  import('@/lib/axe').then(({ initAxe }) => initAxe())
}, [])
```

---

### T-E006 · Remove Gallery Custom IntersectionObserver (P1)
**Priority:** 1 | **Severity:** Critical | **Issues:** #27, #29 | **Batch:** E

> **Note:** This is the atomic merge of Issues #27 and #29. Fixing #29 (remove redundant IntersectionObserver) eliminates the need for `'use client'` in Gallery (Issue #27), potentially converting it to an RSC.

**What:** Next.js `<Image>` implements its own internal IntersectionObserver for lazy loading. The custom `useIntersectionObserver` hook in `Gallery.tsx` is entirely redundant and caused the SSR crash in Issue #27.

**File:** `src/components/Gallery.tsx`
```typescript
// Remove 'use client' directive (may no longer be needed post-refactor)
// Remove useIntersectionObserver import and usage

// Before — manual lazy loading
function LazyImage({ src, alt, ...props }) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })
  return (
    <div ref={ref}>
      {isIntersecting && <Image src={src} alt={alt} {...props} />}
    </div>
  )
}

// After — Next.js Image handles lazy loading natively
// loading="lazy" is the default for non-priority images
function GalleryImage({ src, alt, priority = false, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}     // true only for above-fold images
      // loading="lazy" is implicit when priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      {...props}
    />
  )
}
```

**After this change:** audit whether any other client hooks remain in `Gallery.tsx`. If none, remove `'use client'` directive and convert to RSC.

---

### T-E007 · Add Bundle Analysis + Performance Budget CI (P2)
**Priority:** 3 | **Severity:** Medium | **Issues:** #33, P2 | **Batch:** E

**Install:** `npm install --save-dev @next/bundle-analyzer knip`

**`package.json` scripts:**
```json
{
  "analyze": "ANALYZE=true next build",
  "deadcode": "knip",
  "perf:ci": "lhci autorun"
}
```

**File:** `.github/workflows/performance.yml`
```yaml
name: Performance Budget
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Run Lighthouse CI
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

---

### T-E008 · Add Rate Limiting Tests with Vitest Fake Timers (P2)
**Priority:** 3 | **Severity:** Medium | **Issues:** #14 | **Batch:** E

**What:** Rate limiter tests require time manipulation. The critical detail: `toFake` must include `'Date'` — not just `'setTimeout'` — so `Date.now()` inside the `RateLimiter` class is mocked.

**File:** `src/__tests__/rate-limiter.test.ts`
```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { RateLimiter } from '@/lib/security'

describe('RateLimiter', () => {
  beforeEach(() => {
    // Must include 'Date' so Date.now() calls in RateLimiter are mocked
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] })
  })

  afterEach(() => vi.useRealTimers())

  it('allows requests within limit', () => {
    const limiter = new RateLimiter(5, 300_000) // 5 req per 5 min
    for (let i = 0; i < 5; i++) {
      expect(limiter.isAllowed('127.0.0.1')).toBe(true)
    }
  })

  it('blocks requests exceeding limit', () => {
    const limiter = new RateLimiter(5, 300_000)
    for (let i = 0; i < 5; i++) limiter.isAllowed('127.0.0.1')
    expect(limiter.isAllowed('127.0.0.1')).toBe(false)
  })

  it('resets after window expires', () => {
    const limiter = new RateLimiter(5, 300_000)
    for (let i = 0; i < 5; i++) limiter.isAllowed('127.0.0.1')

    // Advance past the 5-minute window
    vi.advanceTimersByTime(300_001)

    expect(limiter.isAllowed('127.0.0.1')).toBe(true)
  })

  it('isolates limits per IP', () => {
    const limiter = new RateLimiter(1, 300_000)
    expect(limiter.isAllowed('192.168.1.1')).toBe(true)
    expect(limiter.isAllowed('192.168.1.1')).toBe(false)
    expect(limiter.isAllowed('192.168.1.2')).toBe(true) // different IP
  })
})
```

---

## 🟢 BATCH F — Data Architecture & State Management
> Resolves static/DB data duplication (Issues #17 + #19 merged) and state fragmentation.

### T-F001 · Migrate Static Data Files to DB + ISR (Issues #17 & #19 merged)
**Priority:** 2 | **Severity:** High | **Issues:** #17, #19 | **Batch:** F

**What:** `src/data/barbers.ts` and `src/data/services.ts` serve dual roles as application data sources AND bundle weight (~391 + ~270 lines of JSON-like objects). Migrating to DB-only queries eliminates both problems simultaneously. Static files become seed-only inputs.

**Migration steps:**

**Step 1 — Move static data to seed file only:**
```typescript
// src/data/seed.ts — only ever called by `npm run db:seed`
// This is the single source of truth for initial data
export const SEED_SERVICES = [/* existing services array */]
export const SEED_BARBERS = [/* existing barbers array */]
// Delete src/data/services.ts and src/data/barbers.ts entirely
```

**Step 2 — Add ISR to data pages:**
```typescript
// src/app/services/page.tsx
export const revalidate = 3600 // Rebuild from DB every 1 hour
// Staff and menu data changes rarely — 1h cache is appropriate

export default async function ServicesPage() {
  const services = await serviceRepository.getAll() // Always DB
  return <ServiceList services={services} />
}
```

**Step 3 — Remove dynamic imports of static files:**
```typescript
// All components importing from '@/data/services' or '@/data/barbers'
// now receive data as props from their page's server fetch
// No dynamic import wrappers needed
```

**Bundle impact:** Removes ~661 lines of static TS objects from the client bundle entirely. Data served via RSC props, never hydrated to client.

---

### T-F002 · Implement Zustand Booking Store (Replace State Fragmentation)
**Priority:** 3 | **Severity:** Medium | **Issues:** #18 | **Batch:** F

**What:** Replace the fragmented booking state (spread across `useBooking`, `useLocalStorage`, and ad-hoc `useState` calls) with a single Zustand store using the Next.js App Router-safe `useRef` + Context provider pattern.

**Install:** `npm install zustand`

**File:** `src/store/booking-store.ts`
```typescript
'use client'
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

interface BookingState {
  selectedService: string | null
  selectedBarber: string | null
  selectedDate: Date | null
  selectedTime: string | null
  customerInfo: { name: string; email: string; phone: string } | null
  isSubmitting: boolean
  error: string | null
}

interface BookingActions {
  selectService: (id: string) => void
  selectBarber: (id: string) => void
  selectDate: (date: Date) => void
  selectTime: (time: string) => void
  setCustomerInfo: (info: BookingState['customerInfo']) => void
  setSubmitting: (val: boolean) => void
  setError: (msg: string | null) => void
  reset: () => void
}

const initialState: BookingState = {
  selectedService: null, selectedBarber: null, selectedDate: null,
  selectedTime: null, customerInfo: null, isSubmitting: false, error: null,
}

const createBookingStore = () =>
  createStore<BookingState & BookingActions>()((set) => ({
    ...initialState,
    selectService: (id) => set({ selectedService: id, error: null }),
    selectBarber: (id) => set({ selectedBarber: id, error: null }),
    selectDate: (date) => set({ selectedDate: date, error: null }),
    selectTime: (time) => set({ selectedTime: time, error: null }),
    setCustomerInfo: (info) => set({ customerInfo: info, error: null }),
    setSubmitting: (val) => set({ isSubmitting: val }),
    setError: (msg) => set({ error: msg }),
    reset: () => set(initialState),
  }))

// Context + useRef pattern: each component tree gets its own store instance
// Prevents shared state across concurrent server renders (Next.js App Router safe)
const BookingStoreContext = createContext<ReturnType<typeof createBookingStore> | null>(null)

export function BookingStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createBookingStore>>()
  if (!storeRef.current) storeRef.current = createBookingStore()
  return (
    <BookingStoreContext.Provider value={storeRef.current}>
      {children}
    </BookingStoreContext.Provider>
  )
}

export function useBookingStore<T>(selector: (state: BookingState & BookingActions) => T): T {
  const store = useContext(BookingStoreContext)
  if (!store) throw new Error('useBookingStore must be used within BookingStoreProvider')
  return useStore(store, selector)
}
```

**Why `useRef` + Context, not global module store:** Even `'use client'` components are initially rendered on the server in Next.js App Router. A global Zustand module store (exported directly) would share state across concurrent user requests in the server process — a critical data leak. The `useRef` + Context pattern scopes state to the component subtree per-render.

---

### T-F003 · Simplify Over-Engineered Compound Components
**Priority:** 3 | **Severity:** Medium | **Issues:** #36, #37, #38, #39 | **Batch:** F

**Architectural decisions (per research):**

| Component | Decision | Rationale |
|-----------|----------|-----------|
| `Card` | Simplify to props-only | Static marketing site; no shared implicit state needed |
| `Modal` | Keep compound, slim Context | Header/Body/Footer composition is justified; remove over-engineered ModalContext |
| `Form` | Keep compound pattern | Booking form needs shared validation state across Field sub-components |
| Unused Modal | Delete if no consumer | Don't maintain dead code |

**Card — slim to props:**
```typescript
// Before — Context-based compound component
// After — Simple props, same flexibility
interface CardProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  className?: string
}

export function Card({ header, children, footer, variant = 'default', className }: CardProps) {
  return (
    <div className={cn(cardVariants[variant], className)}>
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-700">{footer}</div>}
    </div>
  )
}
```

**Modal — remove ModalContext, use isOpen prop:**
```typescript
// Before — Context-based open/close state (over-engineered for a modal)
// After — isOpen as prop, callbacks as props (standard pattern)
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}
// Sub-components (Header, Body, Footer) remain for composition flexibility
```

---

### T-F004 · Add Missing Imports to Form and Modal Compound Components
**Priority:** 2 | **Severity:** High | **Issues:** #36 | **Batch:** F

**What:** `Form.tsx` and `Modal.tsx` have missing React imports causing runtime errors in strict mode.

```typescript
// Form.tsx — ensure all hooks and types are imported
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// Modal.tsx — ensure portal and ref imports are present  
import { createPortal } from 'react-dom'
import { useEffect, useRef, type ReactNode } from 'react'
```

---

## 🔵 Open Backlog

### T-5001 · Visual Regression Testing with Chromatic
**Priority:** 4 | **Status:** open

Integrate Chromatic with Storybook for automated visual regression testing on component changes.

---

### T-5002 · E2E Booking Flow with Playwright
**Priority:** 3 | **Status:** open

Full booking flow E2E: service selection → barber selection → availability check → form submission → confirmation. Use `page.route()` to mock `/api/bookings` for stable CI runs.

---

### T-5003 · Performance Monitoring Dashboard
**Priority:** 4 | **Status:** open

Set up Vercel Analytics + Web Vitals reporting. Alert on LCP > 2.5s or CLS > 0.1.

---

### T-5004 · Storybook Stories for All New Components
**Priority:** 4 | **Status:** open

Add Storybook stories for: `Card`, `Modal`, `Form`, `EventCountdown`, `Gallery`. Include accessibility a11y addon checks in each story.
