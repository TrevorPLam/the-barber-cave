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

Execution Strategy & Dependency Analysis
Before execution, note that several tasks reference duplicate batch identifiers (e.g., two "Batch K" groups). These are preserved with their original metadata to prevent information loss, but execution should follow the phased approach below, not the alphabetical batch order.
Critical Path Analysis:
1.  Phase 0 (Foundation): Build/TypeScript fixes (O, T, X001) must complete first—these block all CI/CD and deployments.
2.  Phase 1 (Security): Database RLS, RBAC, and connection pooling (H, L, Q, X002/X007/X008) must precede any data migration.
3.  Phase 2 (Data): Static-to-DB migration (F001) depends on Phase 1 DB stability.
4.  Phase 3 (Architecture): Component splitting and design system (I, Y) can proceed in parallel with Phase 2 but require Phase 0.
5.  Phase 4 (Accessibility): WCAG compliance (K-WCAG, G, U) and Error Boundary work should follow Phase 3 component stabilization.
6.  Phase 5 (Infrastructure): Monitoring, caching, i18n, PWA (J, S, X003-X006) can run parallel to Phase 4.
7.  Phase 6 (Optimization): Bundle size and performance (K-Bundle, P, W, N) should happen after architecture is stable.
8.  Phase 7 (Quality): Testing consolidation and tech debt (Z, M, R) can run parallel throughout but finalize here.
9.  Phase 8 (Backlog): Non-critical features (9001-9004) post-launch.
Parallelization Opportunities:
•  Phase 4 Accessibility can run parallel with Phase 5 Infrastructure (different domains).
•  Phase 6 Bundle Optimization can start once Phase 3 components are 50% complete.
•  Phase 7 Testing should run continuously but finalize after Phase 6 to catch regressions.
Risk Mitigation:
•  Do not start T-F001 (Data Migration) until T-H001 (RLS) and T-H002 (Indexes) are complete—risk of data exposure or corruption.
•  Do not enable T-X004 (i18n) until T-K001 (WCAG) is complete—risk of accessibility violations in translated strings.
•  T-X001 (Build Fixes) is the release gate for all other work.
----
🚨 Phase 0: Build System & TypeScript (Critical Foundation)
All other work blocked until these complete. Execute sequentially.
•  [ ] T-O001: Fix TypeDoc Build Errors (105 TypeScript errors)
•  Priority: 1 | Severity: Critical | Batch: O | Status: ⏳ PENDING
•  Description: TypeDoc build fails with 105 TypeScript errors, preventing all API documentation generation. Build system instability blocks deployments.
•  Files:
•  [ ] src/lib/auth.ts
•  [ ] src/middleware.ts
•  [ ] src/store/booking-store.ts
•  [ ] package.json (TypeDoc scripts)
•  Implementation:
•  [ ] Fix authentication configuration in src/lib/auth.ts
•  [ ] Correct NextRequest import in src/middleware.ts
•  [ ] Resolve React store issues in src/store/booking-store.ts
•  [ ] Test TypeDoc build locally: npm run docs:build
•  Validation:
•  [ ] TypeDoc builds without errors
•  [ ] CI pipeline generates documentation artifacts
•  [ ] No TypeScript compilation errors in tsc --noEmit
•  [ ] T-O002: Create Missing Documentation Files
•  Priority: 1 | Severity: Critical | Batch: O | Status: ⏳ PENDING
•  Description: Critical documentation files referenced in README don't exist, blocking developer onboarding.
•  Files:
•  [ ] TESTING_GUIDE.md
•  [ ] CONTRIBUTING.md
•  [ ] DEBUGGING.md
•  Implementation:
•  [ ] Create TESTING_GUIDE.md with Vitest/Playwright setup instructions
•  [ ] Create CONTRIBUTING.md with Git workflow and PR standards
•  [ ] Create DEBUGGING.md with common errors and troubleshooting steps
•  Validation:
•  [ ] All three files exist in repo root
•  [ ] Files linked from README.md
•  [ ] Content reviewed for accuracy
•  [ ] T-O003: Implement Documentation Automation
•  Priority: 1 | Severity: Critical | Batch: O | Status: ⏳ PENDING
•  Description: No automated documentation build/deployment pipeline.
•  Files:
•  [ ] .github/workflows/docs-deploy.yml
•  [ ] package.json (update scripts)
•  Implementation:
•  [ ] Add TypeDoc build step to CI/CD pipeline
•  [ ] Configure GitHub Pages deployment for docs
•  [ ] Update package.json with docs:build and docs:deploy scripts
•  Validation:
•  [ ] Docs deploy automatically on merge to main
•  [ ] GitHub Pages site is live and accessible
•  [ ] Broken link checker passes
•  [ ] T-T001: Fix TypeScript Compilation Errors
•  Priority: 1 | Severity: Critical | Batch: T | Status: ⏳ PENDING
•  Description: Multiple TypeScript errors preventing successful builds.
•  Files:
•  [ ] src/lib/auth.ts
•  [ ] src/middleware.ts
•  [ ] next.config.ts
•  [ ] src/store/booking-store.ts
•  Implementation:
•  [ ] Fix authentication configuration exports
•  [ ] Correct NextRequest import types
•  [ ] Resolve type mismatches in store definitions
•  [ ] Fix Turbopack incompatibility issues
•  Validation:
•  [ ] tsc --noEmit passes with zero errors
•  [ ] next build completes successfully
•  [ ] No type errors in CI pipeline
•  [ ] T-X001: Fix Build System & TypeScript Compilation Errors
•  Priority: 1 | Severity: Critical | Batch: X | Status: ⏳ PENDING
•  Description: Build fails with Turbopack incompatibility and NextAuth route type mismatch, blocking all deployments.
•  Files:
•  [ ] next.config.ts
•  [ ] src/app/api/auth/[...nextauth]/route.ts
•  Implementation:
•  [ ] Move serverExternalPackages: ['@next-auth/prisma-adapter'] from experimental section in next.config.ts
•  [ ] Fix NextAuth route handlers: export const { GET, POST } = handlers
•  Validation:
•  [ ] Production build completes without errors
•  [ ] Bundle analysis runs successfully
•  [ ] Vercel deployment succeeds
🛡️ Phase 1: Security & Database Foundation
Execute before any data operations or user-facing features.
•  [ ] T-H001: Implement Row Level Security (RLS) Policies
•  Priority: 1 | Severity: Critical | Batch: H | Status: ⏳ PENDING
•  Description: Database lacks RLS policies, creating potential data access vulnerabilities.
•  Files:
•  [ ] database/migrations/001_add_rls_policies.sql
•  [ ] src/lib/db/schema.ts
•  Implementation:
•  [ ] Enable RLS on bookings table: ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
•  [ ] Enable RLS on barbers table: ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
•  [ ] Enable RLS on services table: ALTER TABLE services ENABLE ROW LEVEL SECURITY;
•  [ ] Create booking_customer_access policy: FOR ALL USING (auth.uid()::text = customer_email OR auth.jwt()->>'role' = 'admin')
•  [ ] Create booking_public_read policy: FOR SELECT USING (status = 'confirmed')
•  [ ] Create barber_public_read policy: FOR SELECT USING (is_active = true)
•  [ ] Create barber_admin_write policy: FOR ALL USING (auth.jwt()->>'role' = 'admin')
•  Validation:
•  [ ] Tenant A cannot access Tenant B data via SQL injection attempts
•  [ ] Unauthorized users cannot read booking details
•  [ ] Admin users can access all records
•  [ ] RLS policies tested in CI with test database
•  [ ] T-H002: Add Database Performance Indexes
•  Priority: 1 | Severity: Critical | Batch: H | Status: ⏳ PENDING
•  Description: Missing indexes causing slow queries on frequently accessed fields.
•  Files:
•  [ ] database/migrations/002_add_performance_indexes.sql
•  Implementation:
•  [ ] Create index: idx_bookings_customer_email ON bookings(customer_email)
•  [ ] Create index: idx_bookings_date_barber ON bookings(date, barber_id)
•  [ ] Create index: idx_bookings_status ON bookings(status)
•  [ ] Create index: idx_bookings_created_at ON bookings(created_at)
•  [ ] Create composite index: idx_bookings_status_date ON bookings(status, date)
•  [ ] Create partial index: idx_services_active ON services(is_active) WHERE is_active = true
•  [ ] Create partial index: idx_barbers_active ON barbers(is_active) WHERE is_active = true
•  [ ] Create partial index: idx_bookings_upcoming ON bookings(date) WHERE date >= NOW() AND status = 'confirmed'
•  Validation:
•  [ ] Query execution time reduced by 70% on common queries
•  [ ] Database CPU usage decreased under load
•  [ ] EXPLAIN ANALYZE shows index usage
•  [ ] T-H003: Complete Sentry Error Monitoring Integration
•  Priority: 1 | Severity: Critical | Batch: H | Status: ⏳ PENDING
•  Description: Sentry integration is commented out, leaving production errors unmonitored.
•  Files:
•  [ ] src/components/ErrorBoundary.tsx
•  [ ] src/hooks/useErrorHandler.ts
•  [ ] src/lib/sentry.ts
•  Implementation:
•  [ ] Uncomment Sentry imports in ErrorBoundary
•  [ ] Add Sentry.captureException in componentDidCatch with contexts (react componentStack, user session)
•  [ ] Uncomment Sentry integration in useErrorHandler for production environment
•  [ ] Add tags for component name and retry count
•  Validation:
•  [ ] Test error sends to Sentry in production build
•  [ ] Error context includes component stack trace
•  [ ] User session data attached to error reports
•  [ ] T-H004: Add Database Connection Pooling Optimization
•  Priority: 2 | Severity: High | Batch: H | Status: ⏳ PENDING
•  Description: Current connection pooling is basic and not optimized for production load.
•  Files:
•  [ ] src/lib/db/index.ts
•  Implementation:
•  [ ] Configure postgres client with max: 20 connections (up from 10)
•  [ ] Set idle_timeout: 30 (up from 20)
•  [ ] Set connect_timeout: 10
•  [ ] Set max_lifetime: 3600 (1 hour)
•  [ ] Add connection retry logic: retry: 3, retry_delay: 1000
•  [ ] Add SSL requirement for production: ssl: process.env.NODE_ENV === 'production' ? 'require' : false
•  [ ] Implement checkDatabaseHealth() function with test query
•  Validation:
•  [ ] Connection pool handles 100 concurrent requests without exhaustion
•  [ ] Failed connections retry automatically
•  [ ] Health check endpoint returns true when DB available
•  [ ] T-H005: Implement API Response Caching
•  Priority: 2 | Severity: High | Batch: H | Status: ⏳ PENDING
•  Description: No caching strategy for API responses, causing unnecessary database queries.
•  Files:
•  [ ] src/lib/cache.ts
•  [ ] src/app/api/services/route.ts
•  [ ] src/app/api/barbers/route.ts
•  Implementation:
•  [ ] Install and configure Redis (ioredis)
•  [ ] Implement getCachedData<T>(key, fetcher, ttl) helper with Redis fallback
•  [ ] Add caching to services API route with 1 hour TTL
•  [ ] Add cache invalidation on data mutation
•  Validation:
•  [ ] API response time reduced by 80% for cached endpoints
•  [ ] Database query count reduced for repeated requests
•  [ ] Cache invalidation works on data updates
•  [ ] T-L001: Implement Role-Based Access Control (RBAC)
•  Priority: 1 | Severity: Critical | Batch: L | Status: ⏳ PENDING
•  Description: TODO comment in bookings API indicates missing RBAC—all authenticated users can access all bookings.
•  Files:
•  [ ] src/lib/rbac.ts
•  [ ] src/app/api/bookings/route.ts
•  [ ] src/middleware.ts
•  Implementation:
•  [ ] Create Role enum: CUSTOMER, BARBER, ADMIN, OWNER
•  [ ] Define RBAC_PERMISSIONS map with resource/action permissions per role
•  [ ] Implement hasPermission(role, resource, action) function
•  [ ] Add middleware to enforce permissions on API routes
•  [ ] Update bookings API to check permissions before returning data
•  Validation:
•  [ ] Customer can only access own bookings
•  [ ] Barber can view assigned bookings only
•  [ ] Admin can view all bookings
•  [ ] Forbidden (403) returned for unauthorized access attempts
•  [ ] T-L002: Add Database Connection Pooling
•  Priority: 2 | Severity: High | Batch: L | Status: ⏳ PENDING
•  Description: No database connection pooling optimization, causing potential performance issues under load. (Duplicate concern with T-H004—execute once, validate both)
•  Files:
•  [ ] src/lib/db/index.ts
•  Implementation:
•  [ ] Configure max connections: 20
•  [ ] Set idle timeout: 30s
•  [ ] Add connection health checks
•  Validation:
•  [ ] See T-H004 validation criteria
•  [ ] T-L003: Implement API Response Caching Strategy
•  Priority: 2 | Severity: High | Batch: L | Status: ⏳ PENDING
•  Description: No caching strategy for API responses, causing unnecessary database queries and slow response times. (Duplicate with T-H005—execute once)
•  Files:
•  [ ] src/lib/cache.ts
•  [ ] API route handlers
•  Implementation:
•  [ ] Implement SimpleCache class with Map-based storage
•  [ ] Add HTTP Cache-Control headers to API responses
•  [ ] Add 1-hour cache for services list
•  Validation:
•  [ ] See T-H005 validation criteria
•  [ ] T-Q001: Implement Role-Based Access Control (RBAC)
•  Priority: 1 | Severity: Critical | Batch: Q | Status: ⏳ PENDING
•  Description: Missing RBAC system creating security vulnerabilities and compliance gaps. (Consolidate with T-L001)
•  Files:
•  [ ] src/lib/rbac.ts
•  [ ] src/app/api/bookings/route.ts
•  [ ] Middleware
•  Implementation:
•  [ ] Define roles and permissions structure
•  [ ] Update API routes with permission checks
•  [ ] Add role checking middleware
•  Validation:
•  [ ] See T-L001 validation criteria
•  [ ] T-Q002: Add Database Connection Pooling
•  Priority: 2 | Severity: High | Batch: Q | Status: ⏳ PENDING
•  Description: No database connection pooling optimization. (Consolidate with T-H004)
•  Files:
•  [ ] src/lib/db/index.ts
•  Implementation:
•  [ ] Enhanced PostgreSQL client configuration
•  [ ] Connection health checks
•  [ ] Retry logic
•  Validation:
•  [ ] See T-H004 validation criteria
•  [ ] T-X002: Implement Multi-Location Database Architecture
•  Priority: 1 | Severity: Critical | Batch: X | Status: ⏳ PENDING
•  Description: Database schema lacks location/branch support, preventing multi-location expansion.
•  Files:
•  [ ] database/migrations/003_add_locations.sql
•  [ ] src/lib/db/schema.ts
•  [ ] src/lib/repositories/location-repository.ts
•  Implementation:
•  [ ] Create locations table with id, name, timezone, currency, address (jsonb), is_active
•  [ ] Add location_id foreign key to barbers table
•  [ ] Add location_id foreign key to services table
•  [ ] Add location_id foreign key to bookings table
•  [ ] Seed initial location data for Chicago
•  [ ] Update repositories to filter by location_id
•  Validation:
•  [ ] Can create bookings for specific locations
•  [ ] Barbers assigned to specific locations
•  [ ] Services available per location
•  [ ] London location can be added to schema
•  [ ] T-X007: Implement Role-Based Access Control (RBAC)
•  Priority: 2 | Severity: High | Batch: X | Status: ⏳ PENDING
•  Description: Missing RBAC system creating security vulnerabilities. (Consolidate with T-L001/T-Q001)
•  Files:
•  [ ] src/lib/rbac.ts
•  [ ] src/lib/middleware.ts
•  Implementation:
•  [ ] Define Role enum and Permission interface
•  [ ] Create RBAC_PERMISSIONS map
•  [ ] Implement checkPermission() function
•  Validation:
•  [ ] See T-L001 validation criteria
•  [ ] T-X008: Add Database Performance Optimization
•  Priority: 2 | Severity: High | Batch: X | Status: ⏳ PENDING
•  Description: Missing database indexes and connection pooling causing performance bottlenecks. (Consolidate with T-H002/T-H004)
•  Files:
•  [ ] database/migrations/ (indexes)
•  [ ] src/lib/db/index.ts (pooling)
•  Implementation:
•  [ ] Add performance indexes (see T-H002)
•  [ ] Configure connection pooling (see T-H004)
•  Validation:
•  [ ] Combined validation from T-H002 and T-H004
🗄️ Phase 2: Data Architecture Migration
Depends on Phase 1 DB security and indexing.
•  [ ] T-F001: Migrate Static Data Files to DB + ISR
•  Priority: 2 | Severity: High | Batch: F | Status: ⏳ PENDING
•  Description: src/data/barbers.ts and src/data/services.ts serve dual roles as application data sources AND bundle weight (~391 + ~270 lines). Migrating to DB-only queries eliminates both problems.
•  Files:
•  [ ] src/data/seed.ts (new seed file)
•  [ ] src/data/services.ts (delete after migration)
•  [ ] src/data/barbers.ts (delete after migration)
•  [ ] src/app/services/page.tsx (add ISR)
•  [ ] src/app/barbers/page.tsx (add ISR)
•  [ ] src/lib/repositories/service-repository.ts
•  [ ] src/lib/repositories/barber-repository.ts
•  Implementation:
•  [ ] Move static data to seed.ts as SEED_SERVICES and SEED_BARBERS
•  [ ] Delete src/data/services.ts and src/data/barbers.ts
•  [ ] Add ISR revalidate = 3600 to services and barbers pages
•  [ ] Update pages to fetch from repository (DB only)
•  [ ] Remove dynamic import wrappers from components
•  [ ] Run seed script to populate DB
•  Validation:
•  [ ] Bundle size reduced by ~661 lines of static TS objects
•  [ ] Pages load data from DB via RSC props
•  [ ] ISR revalidation works (data updates reflect within 1 hour)
•  [ ] No client-side hydration of static data
🏗️ Phase 3: Component Architecture & Design System
Depends on Phase 0 build stability.
•  [ ] T-I001: Split Navigation Component Architecture
•  Priority: 2 | Severity: High | Batch: I | Status: ⏳ PENDING
•  Description: Navigation component is 304 lines and handles multiple concerns, violating single responsibility principle.
•  Files:
•  [ ] src/components/Navigation/Navigation.tsx (refactored main)
•  [ ] src/components/Navigation/DesktopNavigation.tsx (new)
•  [ ] src/components/Navigation/MobileNavigation.tsx (new)
•  [ ] src/components/Navigation/NavigationBrand.tsx (new)
•  [ ] src/components/Navigation/MobileMenuButton.tsx (new)
•  [ ] src/components/Navigation/AuthenticationSection.tsx (new)
•  [ ] src/components/Navigation/NavigationItems.tsx (new)
•  Implementation:
•  [ ] Extract NavigationBrand component
•  [ ] Extract DesktopNavigation with NavigationItems and AuthenticationSection
•  [ ] Extract MobileMenuButton
•  [ ] Extract MobileNavigation
•  [ ] Extract AuthenticationSection handling useSession
•  [ ] Compose all in main Navigation.tsx
•  Validation:
•  [ ] No single file exceeds 100 lines
•  [ ] Each component has single responsibility
•  [ ] Props interface defined for each sub-component
•  [ ] Navigation renders identically to before refactor
•  [ ] T-I002: Optimize Server/Client Component Boundaries
•  Priority: 2 | Severity: High | Batch: I | Status: ⏳ PENDING
•  Description: Some components marked as "use client" could be server components with client islands.
•  Files:
•  [ ] src/components/Hero.tsx (convert to server)
•  [ ] src/components/Hero/HeroCTAs.tsx (new client component)
•  [ ] src/components/Hero/HeroContent.tsx (new server component)
•  Implementation:
•  [ ] Remove 'use client' from Hero.tsx
•  [ ] Extract interactive parts (CTA buttons) to HeroCTAs.tsx with 'use client'
•  [ ] Keep static content in HeroContent.tsx (server)
•  [ ] Compose in Hero.tsx
•  [ ] Apply pattern to other components (Services, Barbers, etc.)
•  Validation:
•  [ ] Client-side JavaScript reduced by 30%
•  [ ] Lighthouse "Reduce unused JavaScript" score improved
•  [ ] Components hydrate correctly where needed
•  [ ] SEO metadata preserved in server components
•  [ ] T-I003: Add Loading States and Route Handlers
•  Priority: 3 | Severity: Medium | Batch: I | Status: ⏳ PENDING
•  Description: Missing loading.tsx files and proper loading states for routes.
•  Files:
•  [ ] src/app/loading.tsx (global)
•  [ ] src/app/services/loading.tsx (route-specific)
•  [ ] src/app/barbers/loading.tsx (route-specific)
•  [ ] src/app/booking/loading.tsx (route-specific)
•  Implementation:
•  [ ] Create global loading.tsx with spinner animation
•  [ ] Create services loading.tsx with skeleton cards grid
•  [ ] Create barbers loading.tsx with skeleton profile cards
•  [ ] Create booking loading.tsx with form skeleton
•  [ ] Ensure loading states match final layout dimensions (prevent CLS)
•  Validation:
•  [ ] Loading states appear during navigation
•  [ ] No layout shift when content loads
•  [ ] Skeleton matches final component structure
•  [ ] Accessibility: loading announced to screen readers
•  [ ] T-I004: Implement Component Design System
•  Priority: 3 | Severity: Medium | Batch: I | Status: ⏳ PENDING
•  Description: Inconsistent component patterns and missing design system foundation.
•  Files:
•  [ ] src/components/design-system/Button.tsx
•  [ ] src/components/design-system/Input.tsx
•  [ ] src/components/design-system/Card.tsx
•  [ ] src/components/design-system/index.ts
•  Implementation:
•  [ ] Create Button component with variants (primary, secondary, accent, ghost) and sizes (sm, md, lg)
•  [ ] Create Input component with consistent styling and error states
•  [ ] Create Card component with variants (default, outlined, elevated)
•  [ ] Add forwardRef support to all components
•  [ ] Add proper TypeScript interfaces
•  [ ] Export all from design-system/index.ts
•  Validation:
•  [ ] All existing buttons use new Button component
•  [ ] Consistent spacing and colors across app
•  [ ] Components accessible via keyboard
•  [ ] Storybook stories created for each component
•  [ ] T-Y001: Implement Design System Foundation
•  Priority: 2 | Severity: High | Batch: Y | Status: ⏳ PENDING
•  Description: No design system causing inconsistent UI patterns and development inefficiency. (Consolidate with T-I004)
•  Files:
•  [ ] src/components/design-system/
•  Implementation:
•  [ ] Standardize Button component (see T-I004)
•  [ ] Create typography and color tokens
•  Validation:
•  [ ] See T-I004 validation
•  [ ] T-Y002: Implement Global State Management
•  Priority: 2 | Severity: High | Batch: Y | Status: ⏳ PENDING
•  Description: No global state management causing prop drilling and data inconsistency.
•  Files:
•  [ ] src/store/booking-store.ts
•  [ ] src/store/index.ts
•  Implementation:
•  [ ] Install Zustand
•  [ ] Create BookingStore interface with bookings, selectedBarber, selectedService, loading, error
•  [ ] Implement actions: setBookings, selectBarber, selectService, createBooking
•  [ ] Add async createBooking with error handling
•  [ ] Create store provider wrapper
•  Validation:
•  [ ] No prop drilling for booking data
•  [ ] State updates trigger re-renders correctly
•  [ ] Async actions handle loading and error states
•  [ ] DevTools middleware shows state changes
•  [ ] T-Y003: Optimize Server/Client Component Boundaries
•  Priority: 3 | Severity: Medium | Batch: Y | Status: ⏳ PENDING
•  Description: Components marked as "use client" that could be server components. (Consolidate with T-I002)
•  Files:
•  [ ] src/components/Hero.tsx
•  [ ] src/components/Hero/HeroCTAs.tsx
•  Implementation:
•  [ ] See T-I002 implementation
•  Validation:
•  [ ] See T-I002 validation
♿ Phase 4: Accessibility Compliance (WCAG 2.2 AA)
Execute parallel with Phase 3. Critical for legal compliance.
•  [x] T-K001: Fix Critical Test Environment Issues (WCAG)
•  Priority: 1 | Severity: Critical | Batch: K | Status: ✅ DONE
•  Description: Navigation component tests fail due to missing SessionProvider wrapper, preventing accessibility validation.
•  Files:
•  [x] src/__tests__/accessibility.test.tsx
•  [x] src/components/__tests__/Navigation.test.tsx
•  Implementation:
•  [x] Added vi.mock('next-auth/react') to Navigation and accessibility tests
•  [x] Updated all Navigation tests to mock next-auth/react with unauthenticated session
•  [x] Removed outdated isMenuOpen/onMenuToggle props from accessibility.test.tsx
•  Validation:
•  [x] Navigation tests pass with session context
•  [x] axe accessibility audit runs without provider errors
•  [x] No React context warnings in test output
•  [x] T-K002: Fix LinkWithIcon Undefined URL Handling
•  Priority: 1 | Severity: Critical | Batch: K | Status: ✅ DONE
•  Description: LinkWithIcon component crashes when href prop is undefined, breaking navigation functionality.
•  Files:
•  [x] src/components/LinkWithIcon.tsx
•  Implementation:
•  [x] Added null check in isExternalUrl function: if (!href) return false;
•  Validation:
•  [x] Component renders without crash when href undefined
•  [x] Navigation remains functional
•  [x] T-K003: Fix AccessibilityProvider Test Mocks
•  Priority: 2 | Severity: High | Batch: K | Status: ✅ DONE
•  Description: Improper mock setup for ReactDOM causing test failures and preventing accessibility provider validation.
•  Files:
•  [x] src/components/__tests__/AccessibilityProvider.test.tsx
•  Implementation:
•  [x] Mocked @axe-core/react with vi.fn()
•  [x] Used importOriginal for react-dom to preserve React internals
•  [x] Fixed mockAxeDefault expectations to use toHaveBeenCalledTimes and direct call args
•  [x] Added explicit cleanup() in afterEach for test isolation
•  Validation:
•  [x] AccessibilityProvider tests pass
•  [x] axe integration loads without errors
•  [x] No "Invalid hook call" warnings
•  [ ] T-K004: Fix React State Updates in Tests
•  Priority: 2 | Severity: High | Batch: K | Status: ⏳ PENDING
•  Description: State updates not wrapped in act() causing test warnings and potential race conditions.
•  Files:
•  [ ] src/tests/accessibility.test.tsx
•  [ ] src/tests/navigation.test.tsx
•  Implementation:
•  [ ] Import act from @testing-library/react
•  [ ] Wrap all state updates (clicks, toggles) in act()
•  [ ] Use waitFor for async state updates
•  [ ] Fix menu toggle tests with proper act wrapping
•  Validation:
•  [ ] No "act()" warnings in test output
•  [ ] Tests are deterministic (no race conditions)
•  [ ] State updates complete before assertions
•  [ ] T-K005: Add Missing Alt Text Validation
•  Priority: 2 | Severity: High | Batch: K | Status: ⏳ PENDING
•  Description: Some images may lack descriptive alt text, violating WCAG 1.1.1 Non-text Content.
•  Files:
•  [ ] src/components/tests/OptimizedImage.test.tsx
•  [ ] src/components/OptimizedImage.tsx
•  Implementation:
•  [ ] Add test for descriptive alt text presence
•  [ ] Add test for empty alt on decorative images
•  [ ] Update OptimizedImage to require alt prop (TypeScript)
•  [ ] Add eslint rule for missing alt text
•  Validation:
•  [ ] All images have alt attribute
•  [ ] Decorative images have alt=""
•  [ ] axe audit passes for image-alt rule
•  [ ] T-K006: Add Color Contrast Unit Tests
•  Priority: 3 | Severity: Medium | Batch: K | Status: ⏳ PENDING
•  Description: No automated validation of color contrast ratios for WCAG 2.4.6 compliance.
•  Files:
•  [ ] src/components/tests/contrast.test.tsx
•  [ ] src/components/design-system/tokens.ts
•  Implementation:
•  [ ] Install color-contrast package
•  [ ] Test primary button contrast ratio >= 4.5:1 (AA)
•  [ ] Test text contrast on all background colors
•  [ ] Test dark mode contrast ratios
•  [ ] Add CI check for contrast compliance
•  Validation:
•  [ ] All text meets WCAG AA contrast standards
•  [ ] Dark mode passes contrast checks
•  [ ] CI fails on contrast regression
•  [ ] T-K007: Add Keyboard-Only Navigation Tests
•  Priority: 3 | Severity: Medium | Batch: K | Status: ⏳ PENDING
•  Description: Missing comprehensive keyboard navigation testing for WCAG 2.1.1 compliance.
•  Files:
•  [ ] src/components/tests/keyboard.test.tsx
•  [ ] src/components/Navigation/Navigation.tsx
•  Implementation:
•  [ ] Test Tab navigation through all interactive elements
•  [ ] Test Enter key activation of buttons/links
•  [ ] Test Escape key closes mobile menu
•  [ ] Test focus trapping in modals/error boundaries
•  [ ] Test visible focus indicators
•  Validation:
•  [ ] All interactive elements reachable via keyboard
•  [ ] Focus order is logical
•  [ ] No keyboard traps (except intentional modals)
•  [ ] Focus visible at all times
•  [ ] T-K008: Implement E2E Accessibility Test Suite
•  Priority: 3 | Severity: Medium | Batch: K | Status: ⏳ PENDING
•  Description: Missing end-to-end accessibility testing with real screen readers and assistive technologies.
•  Files:
•  [ ] tests/e2e/accessibility.spec.ts
•  [ ] .github/workflows/accessibility-e2e.yml
•  Implementation:
•  [ ] Install Playwright accessibility scanner
•  [ ] Test all main pages (/about, /contact, /services, /barbers)
•  [ ] Test semantic landmarks (banner, main, contentinfo)
•  [ ] Test heading hierarchy (h1 before h2, etc.)
•  [ ] Test keyboard-only navigation flow
•  [ ] Run in CI on PR
•  Validation:
•  [ ] E2E tests pass in CI
•  [ ] No axe violations on any page
•  [ ] Landmark regions present and correct
•  [ ] Heading structure logical
•  [ ] T-K009: Add Automated Contrast Monitoring
•  Priority: 4 | Severity: Low | Batch: K | Status: ⏳ PENDING
•  Description: No ongoing monitoring of color contrast compliance in CI/CD pipeline.
•  Files:
•  [ ] .github/workflows/accessibility.yml
•  Implementation:
•  [ ] Add accessibility audit job to CI
•  [ ] Run axe on build output
•  [ ] Check color contrast with automated tool
•  [ ] Upload accessibility report as artifact
•  [ ] Fail CI on WCAG AA violations
•  Validation:
•  [ ] CI runs accessibility checks on every PR
•  [ ] Reports uploaded and accessible
•  [ ] Pipeline fails on contrast violations
•  [ ] No false positives (tuned thresholds)
•  [ ] T-G001: Integrate Screen Reader Announcements in ErrorBoundary
•  Priority: 1 | Severity: Critical | Batch: G | Status: ⏳ PENDING
•  Description: ErrorBoundary currently lacks screen reader communication despite having useAnnouncement hook available.
•  Files:
•  [ ] src/components/ErrorBoundary.tsx
•  [ ] src/hooks/useAnnouncement.ts
•  Implementation:
•  [ ] Import useAnnouncement hook
•  [ ] Add announce() call in componentDidCatch with assertive politeness
•  [ ] Add announce() for retry attempts with polite politeness
•  [ ] Add announce() for retry limit reached
•  [ ] Sanitize error messages for screen readers
•  Validation:
•  [ ] Screen reader announces errors immediately (assertive)
•  [ ] Retry attempts announced politely
•  [ ] Error messages sanitized (no stack traces read aloud)
•  [ ] axe audit passes for error announcements
•  [ ] T-G002: Implement Focus Trap in ErrorBoundary
•  Priority: 1 | Severity: Critical | Batch: G | Status: ⏳ PENDING
•  Description: ErrorBoundary has basic focus management but lacks proper focus trapping and escape key handling.
•  Files:
•  [ ] src/components/ErrorBoundary.tsx
•  [ ] src/hooks/useFocusTrap.ts
•  Implementation:
•  [ ] Import useFocusTrap hook
•  [ ] Apply focus trap to error dialog when hasError is true
•  [ ] Set initial focus to error message or retry button
•  [ ] Handle Escape key to close/reset error boundary
•  [ ] Restore focus to triggering element on reset
•  Validation:
•  [ ] Tab cycles within error dialog only
•  [ ] Escape key closes error boundary
•  [ ] Focus returns to page content on close
•  [ ] No focus loss when error occurs
•  [ ] T-G003: Add Granular Error Boundaries to Dynamic Imports
•  Priority: 2 | Severity: High | Batch: G | Status: ⏳ PENDING
•  Description: Root-level ErrorBoundary causes cascading failures. Individual Suspense boundaries need SafeComponent wrappers.
•  Files:
•  [ ] src/components/SafeComponent.tsx (new)
•  [ ] src/app/page.tsx
•  Implementation:
•  [ ] Create SafeComponent wrapper with componentName prop
•  [ ] Wrap Services component in SafeComponent
•  [ ] Wrap Barbers component in SafeComponent
•  [ ] Wrap other lazy-loaded sections in SafeComponent
•  [ ] Add specific fallback UI per component type
•  Validation:
•  [ ] One component failure doesn't crash entire page
•  [ ] Each component shows specific error message
•  [ ] Retry works per component, not whole page
•  [ ] Other components remain interactive
•  [x] T-G004: Enhance ErrorFallback Component Accessibility
•  Priority: 2 | Severity: High | Batch: G | Status: ✅ DONE
•  Description: ErrorFallback component lacks proper ARIA attributes and focus management.
•  Files:
•  [x] src/components/ErrorFallback.tsx
•  Implementation:
•  [x] Added role="alert" to container
•  [x] Added aria-live="polite" for announcements
•  [x] Added aria-atomic="true"
•  [x] Added sr-only title prefix to h3 heading
•  [x] Added id attributes to title and description for aria-describedby use
•  Validation:
•  [x] Screen reader announces error when shown
•  [x] Proper ARIA roles present in HTML
•  [x] axe audit passes for alert role usage
•  [x] T-G005: Add Error Message Sanitization
•  Priority: 2 | Severity: High | Batch: G | Status: ✅ DONE
•  Description: Development error details leak internal structure and potentially sensitive information.
•  Files:
•  [x] src/components/ErrorBoundary.tsx
•  Implementation:
•  [x] Added sanitizeError(message) private method
•  [x] Removes file paths (regex: /\/[^\s]*\//g)
•  [x] Removes stack trace locations (regex: /\s+at\s+[^\n)]*[)\n]/g)
•  [x] Limits message length to 200 chars
•  [x] Shows generic message in production; detailed info only in dev
•  Validation:
•  [x] Production errors don't show file paths
•  [x] Stack traces not visible to users
•  [x] Sanitized messages still helpful for debugging
•  [x] Full errors logged to console/Sentry for developers
•  [ ] T-G006: Add Retry Progress Indicators
•  Priority: 3 | Severity: Medium | Batch: G | Status: ⏳ PENDING
•  Description: Retry attempts happen silently with no user feedback during backoff delays.
•  Files:
•  [ ] src/components/ErrorBoundary.tsx
•  Implementation:
•  [ ] Add visual progress bar for retry countdown
•  [ ] Add "Retrying in X seconds..." text
•  [ ] Add role="status" and aria-live="polite" to progress
•  [ ] Update progress every second
•  Validation:
•  [ ] Users see countdown during retry delay
•  [ ] Screen reader announces retry timing
•  [ ] Progress bar animates smoothly
•  [ ] Cancel retry option available
•  [ ] T-G007: Comprehensive Error Boundary Accessibility Testing
•  Priority: 3 | Severity: Medium | Batch: G | Status: ⏳ PENDING
•  Description: Current tests cover basic axe violations but miss screen reader and keyboard navigation testing.
•  Files:
•  [ ] src/components/tests/ErrorBoundary.accessibility.test.tsx
•  Implementation:
•  [ ] Test focus trapping with Tab/Shift+Tab
•  [ ] Test useAnnouncement integration
•  [ ] Test escape key functionality
•  [ ] Test screen reader announcements
•  [ ] Test keyboard-only retry flow
•  Validation:
•  [ ] All accessibility tests pass
•  [ ] Focus behavior tested automatically
•  [ ] Announcements verified with mock
•  [ ] axe audit passes in test
•  [ ] T-G008: DataFetcher Error Integration
•  Priority: 3 | Severity: Medium | Batch: G | Status: ⏳ PENDING
•  Description: DataFetcher component has retry logic but no accessibility announcements or error boundary integration.
•  Files:
•  [ ] src/components/DataFetcher.tsx
•  [ ] src/hooks/useAnnouncement.ts
•  Implementation:
•  [ ] Import useAnnouncement in DataFetcher
•  [ ] Announce fetch failures with retry count
•  [ ] Announce successful recovery
•  [ ] Wrap DataFetcher usage in SafeComponent
•  Validation:
•  [ ] Fetch failures announced to screen readers
•  [ ] Retry attempts counted and announced
•  [ ] Success announced after recovery
•  [ ] Errors caught by error boundary if all retries fail
•  [ ] T-U001: Fix Critical Test Environment Issues
•  Priority: 1 | Severity: Critical | Batch: U | Status: ⏳ PENDING
•  Description: Navigation component tests fail due to missing SessionProvider wrapper. (Consolidate with T-K001)
•  Files:
•  [ ] src/tests/accessibility.test.tsx
•  Implementation:
•  [ ] See T-K001
•  Validation:
•  [ ] See T-K001
🚀 Phase 5: Infrastructure, Monitoring & Caching
Parallel with Phase 4. Foundation for enterprise operations.
•  [ ] T-J001: Add Comprehensive Audit Logging
•  Priority: 2 | Severity: High | Batch: J | Status: ⏳ PENDING
•  Description: No audit trail for sensitive operations like booking changes and admin actions.
•  Files:
•  [ ] src/lib/audit.ts
•  [ ] database/migrations/004_add_audit_logs.sql
•  [ ] src/lib/repositories/booking-repository.ts
•  Implementation:
•  [ ] Create AuditEvent interface (action, userId, resource, resourceId, metadata, timestamp, ip)
•  [ ] Create logAuditEvent function that writes to audit_logs table
•  [ ] Add audit call in bookingRepository.create()
•  [ ] Add audit call in bookingRepository.update()
•  [ ] Add audit call in bookingRepository.delete()
•  [ ] Send to external monitoring in production
•  Validation:
•  [ ] All booking mutations logged with user context
•  [ ] Audit logs immutable (append-only table)
•  [ ] IP address captured for security
•  [ ] Logs queryable by admin
•  [ ] T-J002: Add Performance Monitoring Dashboard
•  Priority: 3 | Severity: Medium | Batch: J | Status: ⏳ PENDING
•  Description: No real-time performance monitoring or alerting system.
•  Files:
•  [ ] src/lib/monitoring.ts
•  [ ] src/app/admin/dashboard/page.tsx (monitoring view)
•  Implementation:
•  [ ] Create PerformanceMonitor class
•  [ ] Track page load metrics (FCP, LCP, CLS)
•  [ ] Track API call durations
•  [ ] Alert on slow page loads (>2s)
•  [ ] Alert on API errors (5xx status)
•  [ ] Store metrics in database or send to external service
•  Validation:
•  [ ] Metrics collected on every page load
•  [ ] Admin dashboard shows performance trends
•  [ ] Alerts fire on degradation
•  [ ] Historical data available for analysis
•  [ ] T-J003: Add Database Migration Management
•  Priority: 3 | Severity: Medium | Batch: J | Status: ⏳ PENDING
•  Description: No proper database migration versioning or rollback strategy.
•  Files:
•  [ ] src/lib/migrations.ts
•  [ ] database/migrations/ (organized)
•  [ ] package.json (scripts)
•  Implementation:
•  [ ] Create MigrationManager class
•  [ ] Track current schema version in database
•  [ ] Implement migrate(targetVersion) method
•  [ ] Add rollback capability
•  [ ] Add npm scripts: db:migrate, db:rollback, db:status
•  Validation:
•  [ ] Migrations run in correct order
•  [ ] Version tracked in schema_migrations table
•  [ ] Rollback reverses changes correctly
•  [ ] CI runs migrations automatically
•  [ ] T-J004: Add API Documentation Generation
•  Priority: 4 | Severity: Low | Batch: J | Status: ⏳ PENDING
•  Description: No automated API documentation for internal and external consumers.
•  Files:
•  [ ] src/lib/api-docs.ts
•  [ ] src/app/api/docs/route.ts
•  Implementation:
•  [ ] Define OpenAPI specification for all endpoints
•  [ ] Create /api/docs route serving JSON spec
•  [ ] Add Swagger UI or similar for interactive docs
•  [ ] Document request/response schemas
•  [ ] Document error codes
•  Validation:
•  [ ] Docs available at /api/docs
•  [ ] All endpoints documented
•  [ ] Schemas accurate and validated
•  [ ] Interactive testing works
•  [ ] T-X003: Implement Comprehensive Caching Strategy
•  Priority: 1 | Severity: Critical | Batch: X | Status: ⏳ PENDING
•  Description: Complete absence of caching causing poor performance and database overload.
•  Files:
•  [ ] src/lib/cache.ts
•  [ ] src/app/api/services/route.ts
•  [ ] src/app/api/barbers/route.ts
•  Implementation:
•  [ ] Install Redis (ioredis)
•  [ ] Implement getCachedData helper with Redis
•  [ ] Add HTTP Cache-Control headers
•  [ ] Cache services list for 1 hour
•  [ ] Cache barber list for 1 hour
•  [ ] Implement cache invalidation on mutations
•  Validation:
•  [ ] Database load reduced by 80%
•  [ ] API response times <100ms for cached data
•  [ ] Cache invalidation works on updates
•  [ ] No stale data served after mutations
•  [ ] T-X004: Add Internationalization Framework
•  Priority: 1 | Severity: Critical | Batch: X | Status: ⏳ PENDING
•  Description: No i18n support preventing international expansion.
•  Files:
•  [ ] src/i18n/config.ts
•  [ ] src/i18n/messages/en.json
•  [ ] src/i18n/messages/en-GB.json
•  [ ] src/app/layout.tsx
•  Implementation:
•  [ ] Install next-intl
•  [ ] Configure locales (en, en-GB)
•  [ ] Create message files for navigation, services, booking
•  [ ] Add I18nProvider to layout
•  [ ] Implement locale detection and routing
•  Validation:
•  [ ] /en-GB route serves UK English
•  [ ] Currency symbols change ($ vs £)
•  [ ] Date formats localized
•  [ ] No hardcoded strings remain
•  [ ] T-X005: Implement PWA Foundation
•  Priority: 2 | Severity: High | Batch: X | Status: ⏳ PENDING
•  Description: No PWA capabilities limiting mobile user experience.
•  Files:
•  [ ] public/manifest.json
•  [ ] public/icon-192x192.png
•  [ ] public/icon-512x512.png
•  [ ] src/app/layout.tsx
•  Implementation:
•  [ ] Create manifest.json with app metadata
•  [ ] Add icons in multiple sizes
•  [ ] Add theme-color and background-color meta tags
•  [ ] Add apple-mobile-web-app meta tags
•  [ ] Register service worker (next-pwa or custom)
•  Validation:
•  [ ] Lighthouse PWA audit passes
•  [ ] Install prompt appears on mobile
•  [ ] App works offline (basic shell)
•  [ ] Icons display correctly on home screen
•  [ ] T-X006: Add Advanced Monitoring & Observability
•  Priority: 2 | Severity: High | Batch: X | Status: ⏳ PENDING
•  Description: No comprehensive monitoring preventing proactive issue detection.
•  Files:
•  [ ] src/lib/monitoring.ts
•  [ ] src/app/layout.tsx
•  Implementation:
•  [ ] Implement PerformanceMonitor class
•  [ ] Track FCP, LCP, CLS with web-vitals library
•  [ ] Track API call latencies
•  [ ] Send metrics to external service (Datadog, etc.)
•  [ ] Add alerting thresholds
•  Validation:
•  [ ] Real-time metrics visible in dashboard
•  [ ] Alerts fire on performance degradation
•  [ ] Error tracking integrated with Sentry
•  [ ] Business metrics tracked (conversion, etc.)
•  [ ] T-S001: Add Performance Monitoring Dashboard
•  Priority: 3 | Severity: Medium | Batch: S | Status: ⏳ PENDING
•  Description: No real-time performance monitoring or alerting system. (Consolidate with T-J002/T-X006)
•  Files:
•  [ ] src/lib/monitoring.ts
•  Implementation:
•  [ ] See T-J002/T-X006
•  Validation:
•  [ ] See T-J002/T-X006
•  [ ] T-V001: Add Database Migration Management
•  Priority: 3 | Severity: Medium | Batch: V | Status: ⏳ PENDING
•  Description: No proper database migration versioning or rollback strategy. (Consolidate with T-J003)
•  Files:
•  [ ] src/lib/migrations.ts
•  Implementation:
•  [ ] See T-J003
•  Validation:
•  [ ] See T-J003
⚡ Phase 6: Performance Optimization & Bundle Size
Execute after component architecture stabilizes.
•  [ ] T-K001: Optimize Lucide React Icon Imports (Bundle)
•  Priority: 2 | Severity: High | Batch: K | Status: ⏳ PENDING
•  Description: Individual icon imports from lucide-react/dist/esm/icons/ prevent tree-shaking, increasing bundle size by ~15-20KB.
•  Files:
•  [ ] src/components/Navigation.tsx
•  [ ] src/components/Services.tsx
•  [ ] src/components/Barbers.tsx
•  [ ] 8+ other component files using icons
•  Implementation:
•  [ ] Change imports from individual files to barrel imports
•  [ ] Update: import { Menu, X, Scissors } from 'lucide-react';
•  [ ] Remove: import Menu from 'lucide-react/dist/esm/icons/menu';
•  [ ] Update all 10+ components using icons
•  Validation:
•  [ ] Bundle size reduced by 15-20KB
•  [ ] Tree-shaking analysis shows dead code eliminated
•  [ ] Icons render identically
•  [ ] No TypeScript errors from import changes
•  [ ] T-K002: Lazy Load Heavy Dependencies
•  Priority: 2 | Severity: High | Batch: K | Status: ⏳ PENDING
•  Description: Heavy dependencies (@sentry/nextjs, @supabase/supabase-js, next-auth) loaded eagerly, adding ~40KB to initial bundle.
•  Files:
•  [ ] src/components/ErrorBoundary.tsx
•  [ ] src/lib/auth.ts
•  [ ] src/lib/supabase.ts
•  [ ] src/lib/lazy-loads.ts (new)
•  Implementation:
•  [ ] Create lazy load helpers for Sentry, Supabase
•  [ ] Dynamic import Sentry in ErrorBoundary only when error occurs
•  [ ] Dynamic import Supabase only when needed
•  [ ] Lazy load NextAuth in non-critical paths
•  Validation:
•  [ ] Initial bundle reduced by 25-30KB
•  [ ] Sentry loads only on error
•  [ ] No impact on error reporting functionality
•  [ ] Load times improved on 3G connections
•  [ ] T-K003: Extract Authentication Logic from Navigation
•  Priority: 3 | Severity: Medium | Batch: K | Status: ⏳ PENDING
•  Description: Navigation component (304 lines) handles authentication, increasing client-side bundle size unnecessarily.
•  Files:
•  [ ] src/components/Navigation/Navigation.tsx
•  [ ] src/components/Navigation/AuthenticationSection.tsx (new)
•  Implementation:
•  [ ] Extract useSession logic to AuthenticationSection
•  [ ] Make AuthenticationSection a client component
•  [ ] Keep Navigation as server component (if possible)
•  [ ] Pass session data as props from page
•  Validation:
•  [ ] Navigation bundle size reduced by 10-15KB
•  [ ] Authentication still works correctly
•  [ ] No hydration mismatches
•  [ ] Component still accessible
•  [ ] T-K004: Remove Production Console Statements
•  Priority: 4 | Severity: Low | Batch: K | Status: ⏳ PENDING
•  Description: 40 console.log statements across 22 files in production code, potentially leaking sensitive information.
•  Files:
•  [ ] 22 files across src/
•  [ ] src/lib/logger.ts (new)
•  Implementation:
•  [ ] Create production-safe logger (debug only in dev)
•  [ ] Replace all console.log with logger.debug
•  [ ] Keep console.error for actual errors
•  [ ] Add ESLint rule to prevent console.log commits
•  Validation:
•  [ ] No console.log in production build
•  [ ] Logger.debug stripped by minifier or disabled
•  [ ] Errors still log to console
•  [ ] ESLint catches new console.log additions
•  [ ] T-P001: Optimize Lucide React Icon Imports
•  Priority: 2 | Severity: High | Batch: P | Status: ⏳ PENDING
•  Description: Individual icon imports prevent tree-shaking. (Consolidate with T-K001 Bundle)
•  Files:
•  [ ] 10+ component files
•  Implementation:
•  [ ] Change to barrel imports
•  Validation:
•  [ ] See T-K001
•  [ ] T-P002: Lazy Load Heavy Dependencies
•  Priority: 2 | Severity: High | Batch: P | Status: ⏳ PENDING
•  Description: Heavy dependencies loaded eagerly. (Consolidate with T-K002)
•  Files:
•  [ ] ErrorBoundary, auth files
•  Implementation:
•  [ ] Dynamic imports for heavy libs
•  Validation:
•  [ ] See T-K002
•  [ ] T-W001: Remove Production Console Statements
•  Priority: 4 | Severity: Low | Batch: W | Status: ⏳ PENDING
•  Description: 40 console.log statements in production code. (Consolidate with T-K004)
•  Files:
•  [ ] 22 files
•  Implementation:
•  [ ] Production-safe logging system
•  Validation:
•  [ ] See T-K004
•  [ ] T-W002: Add Bundle Size Monitoring
•  Priority: 4 | Severity: Low | Batch: W | Status: ⏳ PENDING
•  Description: No automated bundle size monitoring or alerts for size regressions.
•  Files:
•  [ ] scripts/check-bundle-size.js
•  [ ] .github/workflows/bundle-size.yml
•  [ ] package.json
•  Implementation:
•  [ ] Create bundle size validation script
•  [ ] Set limits: main <300KB, vendors <200KB, total <550KB
•  [ ] Add CI workflow to check on PR
•  [ ] Add bundle analyze script
•  Validation:
•  [ ] CI fails when bundle exceeds limits
•  [ ] Reports show size delta on PRs
•  [ ] Historical size tracking available
•  [ ] No regressions merged
•  [ ] T-N001: Add Real Performance Monitoring
•  Priority: 3 | Severity: Medium | Batch: N | Status: ⏳ PENDING
•  Description: No real-time performance monitoring beyond basic Sentry integration. (Consolidate with T-J002/T-X006)
•  Files:
•  [ ] src/lib/performance.ts
•  Implementation:
•  [ ] Track page load metrics
•  [ ] Alert on slow loads
•  Validation:
•  [ ] See T-J002
•  [ ] T-N002: Add Bundle Size Monitoring
•  Priority: 4 | Severity: Low | Batch: N | Status: ⏳ PENDING
•  Description: No automated bundle size monitoring. (Consolidate with T-W002)
•  Files:
•  [ ] scripts/check-bundle-size.js
•  Implementation:
•  [ ] See T-W002
•  Validation:
•  [ ] See T-W002
🧪 Phase 7: Testing Consolidation & Quality Assurance
Ongoing, but finalize after Phase 6.
•  [ ] T-M001: Resolve All TODO Comments (17 instances)
•  Priority: 3 | Severity: Medium | Batch: M | Status: ⏳ PENDING
•  Description: 17 TODO comments across codebase indicating incomplete features and technical debt.
•  Files:
•  [ ] src/app/api/bookings/route.ts (RBAC TODO)
•  [ ] src/components/Barbers.tsx (pagination TODO)
•  [ ] src/components/Gallery.tsx (lazy loading TODO)
•  [ ] src/components/Services.tsx (filtering TODO)
•  [ ] src/hooks/useBooking.ts (cancellation TODO)
•  [ ] src/lib/auth.ts (refresh token TODO)
•  [ ] src/middleware.ts (rate limiting TODO)
•  [ ] Plus 10 other files
•  Implementation:
•  [ ] Audit all TODOs and categorize (critical vs backlog)
•  [ ] Implement RBAC (move to Phase 1)
•  [ ] Implement pagination for barbers
•  [ ] Implement image lazy loading
•  [ ] Add service filtering
•  [ ] Add booking cancellation
•  [ ] Implement refresh token rotation
•  [ ] Add rate limiting per user
•  [ ] Remove or ticket remaining TODOs
•  Validation:
•  [ ] Zero TODO comments in main branch (or ticketed)
•  [ ] All critical TODOs resolved
•  [ ] Code review checks for new TODOs
•  [ ] Backlog items created for deferred work
•  [ ] T-M002: Add Comprehensive Error Handling
•  Priority: 3 | Severity: Medium | Batch: M | Status: ⏳ PENDING
•  Description: Inconsistent error handling patterns across API routes and components.
•  Files:
•  [ ] src/lib/error-handler.ts (new)
•  [ ] src/app/api/ route files
•  Implementation:
•  [ ] Create AppError class with statusCode and code
•  [ ] Create handleAPIError function for consistent responses
•  [ ] Update all API routes to use centralized handler
•  [ ] Add specific error types (ValidationError, NotFoundError, etc.)
•  Validation:
•  [ ] All API errors return consistent JSON structure
•  [ ] Error codes are machine-readable
•  [ ] Stack traces hidden in production
•  [ ] Client handles error responses correctly
•  [ ] T-R001: Resolve All TODO Comments (17 instances)
•  Priority: 3 | Severity: Medium | Batch: R | Status: ⏳ PENDING
•  Description: 17 TODO comments across codebase. (Consolidate with T-M001)
•  Files:
•  [ ] Various files
•  Implementation:
•  [ ] See T-M001
•  Validation:
•  [ ] See T-M001
•  [ ] T-Z001: Consolidate Testing Frameworks
•  Priority: 2 | Severity: High | Batch: Z | Status: ⏳ PENDING
•  Description: Dual testing frameworks (Jest + Vitest) causing confusion and maintenance overhead.
•  Files:
•  [ ] package.json (remove jest)
•  [ ] jest.config.js (delete)
•  [ ] jest.setup.js (delete)
•  [ ] vitest.config.ts (update)
•  [ ] vitest.setup.ts (update)
•  Implementation:
•  [ ] Remove Jest dependencies
•  [ ] Delete Jest config files
•  [ ] Update Vitest config to include Jest DOM matchers
•  [ ] Migrate any Jest-specific tests to Vitest
•  [ ] Update npm scripts
•  Validation:
•  [ ] Only Vitest runs in CI
•  [ ] All tests pass with Vitest
•  [ ] No Jest references in codebase
•  [ ] Coverage reporting works
•  [ ] T-Z002: Add Integration Testing Suite
•  Priority: 3 | Severity: Medium | Batch: Z | Status: ⏳ PENDING
•  Description: Missing integration tests for API endpoints and database operations.
•  Files:
•  [ ] src/tests/integration/bookings.test.ts
•  [ ] src/tests/integration/services.test.ts
•  [ ] src/tests/integration/setup.ts
•  Implementation:
•  [ ] Setup integration test database
•  [ ] Create test utilities for DB setup/teardown
•  [ ] Test booking creation flow (API + DB)
•  [ ] Test availability checking logic
•  [ ] Test service CRUD operations
•  [ ] Run in CI with test database
•  Validation:
•  [ ] Integration tests run in CI
•  [ ] Tests use real database (not mocks)
•  [ ] Test data cleaned up after each test
•  [ ] All critical paths covered
•  [ ] T-Z003: Add Performance Regression Testing
•  Priority: 3 | Severity: Medium | Batch: Z | Status: ⏳ PENDING
•  Description: No automated performance testing allowing performance regressions.
•  Files:
•  [ ] src/tests/performance/bundle-size.test.ts
•  [ ] src/tests/performance/api-response-time.test.ts
•  [ ] .github/workflows/performance.yml
•  Implementation:
•  [ ] Test bundle size limits (main <300KB, vendors <200KB, total <550KB)
•  [ ] Test API response times (<1000ms)
•  [ ] Test Lighthouse scores
•  [ ] Run in CI on PR
•  [ ] Fail on regression
•  Validation:
•  [ ] CI fails when bundle size increases >10%
•  [ ] API latency tested with real calls
•  [ ] Lighthouse CI passes
•  [ ] Historical performance tracked
📋 Open Backlog (Future Phases)
Post-MVP features and optimizations.
•  [ ] T-5001: Visual Regression Testing with Chromatic
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Integrate Chromatic with Storybook for automated visual regression testing on component changes.
•  Files:
•  [ ] .github/workflows/chromatic.yml
•  [ ] package.json (chromatic script)
•  Implementation:
•  [ ] Install Chromatic CLI
•  [ ] Setup CI workflow
•  [ ] Configure baseline acceptance
•  Validation:
•  [ ] Visual changes require approval
•  [ ] No unintended UI regressions
•  [ ] T-5002: E2E Booking Flow with Playwright
•  Priority: 3 | Severity: Medium | Batch: Backlog | Status: open
•  Description: Full booking flow E2E: service selection → barber selection → availability check → form submission → confirmation.
•  Files:
•  [ ] tests/e2e/booking.spec.ts
•  Implementation:
•  [ ] Mock /api/bookings with page.route()
•  [ ] Test complete user journey
•  [ ] Test validation errors
•  Validation:
•  [ ] Booking flow passes in CI
•  [ ] Screenshots on failure
•  [ ] T-5003: Performance Monitoring Dashboard
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Set up Vercel Analytics + Web Vitals reporting. Alert on LCP > 2.5s or CLS > 0.1.
•  Files:
•  [ ] src/app/layout.tsx (analytics)
•  [ ] src/lib/analytics.ts
•  Implementation:
•  [ ] Install @vercel/analytics
•  [ ] Configure Web Vitals reporting
•  [ ] Setup alerting thresholds
•  Validation:
•  [ ] Metrics visible in Vercel dashboard
•  [ ] Alerts fire on threshold breach
•  [ ] T-5004: Storybook Stories for All New Components
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Add Storybook stories for: Card, Modal, Form, EventCountdown, Gallery. Include accessibility a11y addon checks in each story.
•  Files:
•  [ ] src/components/**/*.stories.tsx
•  Implementation:
•  [ ] Create stories for each component
•  [ ] Add a11y addon checks
•  [ ] Setup visual testing
•  Validation:
•  [ ] All components have stories
•  [ ] a11y checks pass in Storybook
•  [ ] T-9001: Advanced Analytics Dashboard
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Implement comprehensive analytics dashboard with business metrics, customer insights, and performance tracking.
•  Files:
•  [ ] src/app/admin/analytics/page.tsx
•  Implementation:
•  [ ] Business metrics charts
•  [ ] Customer insights
•  [ ] Performance tracking
•  Validation:
•  [ ] Dashboard renders real data
•  [ ] Charts interactive
•  [ ] T-9002: Multi-Currency Support
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Add support for multiple currencies with real-time exchange rate conversion for international locations.
•  Files:
•  [ ] src/lib/currency.ts
•  [ ] src/i18n/currencies/
•  Implementation:
•  [ ] Currency conversion logic
•  [ ] Exchange rate API integration
•  [ ] Currency selector UI
•  Validation:
•  [ ] Prices display in local currency
•  [ ] Conversion rates accurate
•  [ ] T-9003: Advanced Booking Features
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Add recurring appointments, waitlist management, and automated reminders.
•  Files:
•  [ ] src/lib/booking/
•  Implementation:
•  [ ] Recurring booking logic
•  [ ] Waitlist system
•  [ ] Email/SMS reminders
•  Validation:
•  [ ] Recurring bookings created correctly
•  [ ] Waitlist notifications work
•  [ ] T-9004: Customer Portal
•  Priority: 4 | Severity: Low | Batch: Backlog | Status: open
•  Description: Develop customer portal for booking management, appointment history, and preferences.
•  Files:
•  [ ] src/app/portal/page.tsx
•  Implementation:
•  [ ] Booking management UI
•  [ ] Appointment history
•  [ ] Preferences settings
•  Validation:
•  [ ] Customers can view history
•  [ ] Can modify upcoming appointments

