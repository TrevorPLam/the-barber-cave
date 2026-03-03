There is only **1 open issue** in `the-barber-cave`: Issue #2, the Storybook version mismatch bug. Every other issue referenced in the document has been closed/completed. Here is the cleaned-up document showing only that remaining open work:

***

## 📋 Executive Summary: Research-Based Remediation Strategy

Based on analysis of modern React 19/Next.js 15 best practices, WCAG 2.1 AA standards, and enterprise testing methodologies. The strategy prioritizes **unblocking CI/CD pipelines first**, then **architectural corrections**, then **SEO/accessibility compliance**, and finally **optimization polish**.

**🎉 Phase 1–3 Progress:** All critical path, high-impact SEO/data, and type safety/architecture issues completed.

***

## 🎯 Phase 1: Critical Path — CI/CD Unblocking

### 1. Storybook Version Mismatch (Issue #2) 🔴 OPEN

**Severity:** 🔴 High — Storybook is completely non-functional

**Root Cause:** Version mismatch between `storybook` core (v10.2.14) and addon packages still pinned to v8.6.14.

| Package | Installed | Required |
|---|---|---|
| `storybook` | 10.2.14 | — |
| `@storybook/addon-essentials` | 8.6.14 | 10.x |
| `@storybook/addon-interactions` | 8.6.14 | 10.x |
| `@storybook/addon-a11y` | 10.2.14 | ✅ |
| `@storybook/react` | 10.2.14 | ✅ |
| `@storybook/react-vite` | 10.2.14 | ✅ |

**Fix:**
```bash
npm install @storybook/addon-essentials@^10 @storybook/addon-interactions@^10 @chromatic-com/storybook@latest --save-dev
```

**Acceptance Criteria:**
- [ ] `npm run storybook` launches successfully on port 6006
- [ ] All 12+ component stories render without errors
- [ ] `npm run build-storybook` completes without errors
- [ ] `npm run test:visual` (Chromatic) passes

***

## 🎯 Phase 4: Testing & Quality Assurance Infrastructure
*Lighthouse CI + Vitest Standards*

### 2. Lighthouse CI Multi-Form-Factor (Issue #52)
**Best Practice:** Test both mobile and desktop; mobile-first for local businesses
- **Standard:** Separate assertions for mobile (performance ~85) vs desktop (performance ~90)
- **Task:**
  ```javascript
  // lighthouserc.js
  ci: {
    collect: {
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox'
      }
    },
    // Add second job for mobile using --preset=mobile or formFactor: 'mobile'
  }
  ```

### 3. Performance Budget Synchronization (Issue #25/26)
**Best Practice:** Single source of truth in `performance-budgets.json`
- **Task:** Consolidate all targets to `performance-budgets.json`, import in `lighthouserc.js`

### 4. Missing Test Coverage (Issue #65)
**Best Practice:** Prioritize "high-impact, high-complexity" components
- **Task:** Write tests for `Button.tsx` (conditional rendering), `Navigation.tsx` (state management), `StructuredData.tsx` (JSON-LD output)

### 5. Test Maintenance (Issue #66)
**Best Practice:** Update assertions after schema fixes
- **Task:** Update `SEO.test.tsx` after Issues #13, #49, #50 are resolved; add test for `servesCuisine` absence

***

## 🎯 Phase 5: Polish & Optimization
*Accessibility + UX Micro-optimizations*

### 6. Link & Navigation Polish (Issues #54, #31, #61)
- **Task:** Fix CTA link in `Barbers.tsx` (use correct external URL or change label)
- **Task:** Add `role="banner"` or link to brand name in `Navigation.tsx`
- **Task:** Replace `window.location.href` with `useRouter().push()` in error components

### 7. Gallery & Image Alt Text (Issues #47, #20)
- **Task:** Make gallery `alt` text descriptive (not duplicating visible captions)
- **Task:** Remove single-item breadcrumb from homepage (or conditionally render)

### 8. Micro-copy & Data Cleanup (Issues #17, #18, #19, #48, #64)
- **Task:** Change `Barber.rating` to `string | null` (not "No ratings" string)
- **Task:** Replace generic icons (`ChevronRight`, `Moon`) with semantic alternatives
- **Task:** Fix `&nbsp;` JSX entity to `{'\u00A0'}`
- **Task:** Standardize `rob-pro-edge-cut` ID to hyphens only

### 9. CSS & Styling (Issues #63, #53)
- **Task:** Remove duplicate P3 CSS variable declarations (keep `@supports` only)
- **Task:** Fix `ContainerQueries` to omit `containerName` instead of passing `'none'`

### 10. Error Handling Robustness (Issues #62, #67)
- **Task:** Add `.catch()` to dynamic imports in `AccessibilityProvider.tsx`
- **Task:** Remove duplicate `onError` invocation in `SafeComponent.tsx`

***

## 📊 Implementation Roadmap

| Phase | Key Deliverables | Success Criteria |
|-------|-----------------|------------------|
| **Phase 1** | Fix Storybook v10 addon mismatch | `npm run storybook` boots, all stories render |
| **Phase 4** | Lighthouse CI dual-form-factor, coverage gates | Coverage 80%+, mobile/desktop CI gates passing |
| **Phase 5** | Polish complete, all low-severity resolved | Zero console errors, all WCAG 2.1 AA criteria met |

***

## 🚀 Top Actionable Recommendations (Prioritized)

### 1) Add robust HTTP security headers + CSP (urgent)

**Why:** A properly configured Content-Security-Policy and other headers are the easiest/highest-value guardrails against XSS, clickjacking, and content injection attacks.

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "geolocation=(), microphone=()" },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';"
        }
      ],
    },
  ];
}
```

### 2) Integrate production error telemetry — Sentry or OpenTelemetry (high)

**Quick steps:**
- `npm i @sentry/nextjs`
- Add minimal `sentry.client.config.ts` / `sentry.server.config.ts`
- Hook `ErrorBoundary` to call `Sentry.captureException(...)`
- Add `SENTRY_DSN` only to production secrets

### 3) Add bundle analysis + fail-on-regressions (medium)

- `npm i -D @next/bundle-analyzer`
- Add `"analyze": "ANALYZE=true next build"` script
- Add PR CI job that uploads report as artifact or fails on threshold breach

### 4) Add mutation testing via Stryker (medium)

- Install `@stryker-mutator/core` + `@stryker-mutator/vitest-runner`
- Run as opt-in nightly CI job against Node/unit-mode tests

### 5) Enforce structured-data JSON-LD contracts in CI (medium)

- `scripts/validate-seo.ts` runs validator, exits non-zero on failures
- Hook into a lightweight pre-merge CI job

### 6) Harden TypeScript settings incrementally (low→medium)

```json
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"noImplicitOverride": true,
"noPropertyAccessFromIndexSignature": true
```

### 7) Migrate fragile local caching to Next-native cache primitives (medium)

Align cached-* utilities to `use cache` or `unstable_cache` for better edge runtime and ISR compatibility.

### 8) Add Dependabot / Renovate + security scanning (low)

Add a weekly Dependabot config or Renovate preset for regular dependency updates.

### 9) CI: split & parallelize jobs (low)

Dedicated jobs: `typecheck` → `lint` → `unit` → `e2e` → `performance`

### 10) Add lightweight observability traces (optional/medium)

Start with sampled traces for API routes via Sentry traces or OpenTelemetry, expand as needed.

### 11) Add PR annotations for visual regressions (optional)

Wire Chromatic/Storybook to comment on PRs when visual diffs or bundle size exceeds threshold.

### 12) Housekeeping: remove leftover backup artifacts (immediate)

Prevents accidental large files in main branch and improves clone times.

***

The only confirmed open GitHub issue in [TrevorPLam/the-barber-cave](https://github.com/TrevorPLam/the-barber-cave) is **Issue #2** — the Storybook v10/v8 addon mismatch. The Phase 4, Phase 5, and Recommendations sections are retained above as they represent pending work not yet tracked as closed issues.