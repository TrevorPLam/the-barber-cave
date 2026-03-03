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

## 🟢 BATCH F — Data Architecture & State Management
> Resolves static/DB data duplication (Issues #17 + #19 merged) and state fragmentation.

### T-F001 · Migrate Static Data Files to DB + ISR (Issues #17 & #19 merged)
**Priority:** 2 | **Severity:** High | **Issues:** #17, #19 | **Batch:** F | **Status:** ⏳ PENDING

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
