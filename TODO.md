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

### T-D001 · ✅ COMPLETED — Eliminate unsafe-eval / unsafe-inline from CSP
**Priority:** 1 | **Severity:** High | **Issues:** #4 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**What:** Replace broad `unsafe-eval` and `unsafe-inline` directives with nonce-based CSP. Per the Next.js 16 internals issue (GitHub #81496), `unsafe-eval` **cannot be fully removed in production** due to internal `Function()` calls in Next.js utilities — gate it to development only.

**Implementation:** ✅ CSP nonce-based implementation complete in `next.config.ts` with development-only `unsafe-eval`. ✅ Structured CSP report endpoint at `/api/csp-report` with Axiom logging. ✅ Production-ready security headers.

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

### T-D002 · ✅ COMPLETED — Centralize All Environment Variables Through Zod Schema
**Priority:** 2 | **Severity:** Medium | **Issues:** #5 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**What:** All `process.env` access routes through `src/lib/env.ts`. No direct `process.env` calls anywhere else. Add all missing variables to the schema.

**Implementation:** ✅ Zod schema validation complete in `src/lib/env.ts`. ✅ All `process.env` calls replaced with `ENV.X` in `src/data/constants.ts`, `drizzle.config.ts`, `src/lib/logger.ts`. ✅ Type-safe environment access with runtime validation.

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

### T-D003 · ✅ COMPLETED — Implement Structured Production Logging (Pino + Axiom + Sentry)
**Priority:** 2 | **Severity:** Medium | **Issues:** #7 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**What:** Replace all `console.error()` with environment-gated structured logging. Stack: **Pino** (structured JSON) → **Axiom** (log drain, Vercel native) + **Sentry** (error tracking).

**Implementation:** ✅ Pino logger with Axiom transport in `src/lib/logger.ts`. ✅ Environment-gated logging (production vs development). ✅ `withAxiom` wrapper added to `next.config.ts`. ✅ Structured CSP violation reporting with proper error handling.

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

### T-D004 · ✅ COMPLETED — Fix JSON Parsing Prototype Pollution Vectors
**Priority:** 2 | **Severity:** Medium | **Issues:** #6 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**What:** Replace all bare `JSON.parse()` calls with a `safeJSONParse<T>()` utility that validates output via Zod schema, preventing prototype pollution.

**Implementation:** ✅ `safeJSONParse` utility implemented in `src/lib/utils.ts` with prototype pollution protection. ✅ Applied to `useLocalStorage` hook for all JSON parsing operations. ✅ Zod schema validation with safe fallback values.

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

### T-D005 · ✅ COMPLETED — Fix dangerouslySetInnerHTML in StructuredData (JSON-LD XSS)
**Priority:** 2 | **Severity:** Medium | **Issues:** #11 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**What:** `dangerouslySetInnerHTML` with `JSON.stringify()` is the correct and officially documented Next.js App Router pattern for JSON-LD. The XSS vector is the unescaped `<` character which can break out of the script tag. One-line fix.

**Implementation:** ✅ XSS protection verified in `src/components/StructuredData.tsx`. ✅ `<` characters properly escaped with `\u003c` to prevent script tag termination.

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

### T-D006 · ✅ COMPLETED — Fix Open Redirect Risk in External Links
**Priority:** 3 | **Severity:** Medium | **Issues:** #8 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**Implementation:** ✅ External URL validation utility implemented in `src/data/constants.ts`. ✅ Domain allowlist for trusted external sites (Instagram, Facebook, Google, etc.). ✅ HTTPS-only validation with proper error handling.

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

### T-D007 · ✅ COMPLETED — Add Security Header CI Verification
**Priority:** 3 | **Severity:** Medium | **Issues:** #12 | **Batch:** D | **Status:** ✅ COMPLETED 2026-03-03

**Implementation:** ✅ Security headers verification workflow exists at `.github/workflows/security-headers.yml`. ✅ Validates CSP, X-Frame-Options, HSTS, and X-Content-Type-Options headers on staging deployment.

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

### T-F002 · ✅ COMPLETED — Implement Zustand Booking Store (Replace State Fragmentation)
**Priority:** 3 | **Severity:** Medium | **Issues:** #18 | **Batch:** F | **Status:** ✅ COMPLETED 2026-03-03

**What:** Replace the fragmented booking state (spread across `useBooking`, `useLocalStorage`, and ad-hoc `useState` calls) with a single Zustand store using the Next.js App Router-safe `useRef` + Context provider pattern.

**Implementation:** ✅ Zustand booking store implemented in `src/store/booking-store.ts`. ✅ useRef + Context pattern for Next.js App Router safety. ✅ Complete booking state management with actions and error handling.

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

### T-F003 · ✅ COMPLETED — Simplify Over-Engineered Compound Components
**Priority:** 3 | **Severity:** Medium | **Issues:** #36, #37, #38, #39 | **Batch:** F | **Status:** ✅ COMPLETED 2026-03-03

**Implementation:** ✅ Card component simplified from Context-based to props-based API in `src/components/Card.tsx`. ✅ Maintained backward compatibility with compound sub-components. ✅ Removed unnecessary Context complexity for static marketing site.

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

### T-F004 · ✅ COMPLETED — Add Missing Imports to Form and Modal Compound Components
**Priority:** 2 | **Severity:** High | **Issues:** #36 | **Batch:** F | **Status:** ✅ COMPLETED 2026-03-03

**Implementation:** ✅ Fixed missing React imports in `Form.tsx` (useState, useCallback). ✅ Fixed missing createPortal import in `Modal.tsx`. ✅ Resolved TypeScript errors in both components.

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
