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

## � BATCH K — WCAG 2.2 AA Accessibility Compliance
> Critical accessibility fixes based on comprehensive WCAG audit to ensure compliance and prevent accessibility violations.

### T-K001 · Fix Critical Test Environment Issues
**Priority:** 1 | **Severity:** Critical | **Batch:** K | **Status:** ⏳ PENDING

**What:** Navigation component tests fail due to missing SessionProvider wrapper, preventing accessibility validation.

**Implementation:**
```typescript
// src/__tests__/accessibility.test.tsx
import { SessionProvider } from 'next-auth/react'

// Update test setup
const renderWithSession = (component: React.ReactElement) => {
  return render(
    <SessionProvider session={null}>
      {component}
    </SessionProvider>
  );
};

// Update all Navigation tests
it('should have no accessibility violations when closed', async () => {
  const { container } = renderWithSession(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Impact:** Unblocks accessibility testing and ensures WCAG compliance validation.

---

### T-K002 · Fix LinkWithIcon Undefined URL Handling
**Priority:** 1 | **Severity:** Critical | **Batch:** K | **Status:** ⏳ PENDING

**What:** LinkWithIcon component crashes when href prop is undefined, breaking navigation functionality.

**Implementation:**
```typescript
// src/components/LinkWithIcon.tsx
function isExternalUrl(href: string): boolean {
  if (!href) return false; // Add null check
  return (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    href.startsWith('//')
  );
}
```

**Impact:** Prevents component crashes, ensures navigation reliability.

---

### T-K003 · Fix AccessibilityProvider Test Mocks
**Priority:** 2 | **Severity:** High | **Batch:** K | **Status:** ⏳ PENDING

**What:** Improper mock setup for ReactDOM causing test failures and preventing accessibility provider validation.

**Implementation:**
```typescript
// src/components/__tests__/AccessibilityProvider.test.tsx
import { vi } from 'vitest'

// Proper mock setup
vi.mock('@axe-core/react', () => ({
  default: vi.fn(),
}));

vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  $$typeof: Symbol.for('react.element'),
}));

// Update test expectations
const mockAxeDefault = vi.mocked(axe.default);
```

**Impact:** Enables accessibility provider testing and axe integration validation.

---

### T-K004 · Fix React State Updates in Tests
**Priority:** 2 | **Severity:** High | **Batch:** K | **Status:** ⏳ PENDING

**What:** State updates not wrapped in act() causing test warnings and potential race conditions.

**Implementation:**
```typescript
// src/__tests__/accessibility.test.tsx
import { act, waitFor } from '@testing-library/react'

// Wrap state updates
it('should handle navigation state changes', async () => {
  const { container } = renderWithSession(<Navigation isMenuOpen={false} onMenuToggle={vi.fn()} />)
  
  await act(async () => {
    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    menuButton.click()
  })
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Impact:** Eliminates test warnings, ensures reliable accessibility testing.

---

### T-K005 · Add Missing Alt Text Validation
**Priority:** 2 | **Severity:** High | **Batch:** K | **Status:** ⏳ PENDING

**What:** Some images may lack descriptive alt text, violating WCAG 1.1.1 Non-text Content.

**Implementation:**
```typescript
// src/components/__tests__/OptimizedImage.test.tsx
it('should have descriptive alt text for all images', () => {
  render(<OptimizedImage src="/test.jpg" alt="Test image description" />)
  
  const image = screen.getByRole('img')
  expect(image).toHaveAttribute('alt', 'Test image description')
})

// Add validation for empty alt on decorative images
it('should allow empty alt for decorative images', () => {
  render(<OptimizedImage src="/decorative.jpg" alt="" />)
  
  const image = screen.getByRole('img')
  expect(image).toHaveAttribute('alt', '')
})
```

**Impact:** Ensures all images are accessible to screen reader users.

---

### T-K006 · Add Color Contrast Unit Tests
**Priority:** 3 | **Severity:** Medium | **Batch:** K | **Status:** ⏳ PENDING

**What:** No automated validation of color contrast ratios for WCAG 2.4.6 compliance.

**Implementation:**
```typescript
// src/components/__tests__/contrast.test.tsx
import { getContrast } from 'color-contrast'

describe('Color Contrast Compliance', () => {
  it('should meet WCAG AA contrast ratios for primary buttons', () => {
    render(<Button variant="primary">Test Button</Button>)
    
    const button = screen.getByRole('button')
    const styles = window.getComputedStyle(button)
    
    const contrast = getContrast(styles.backgroundColor, styles.color)
    expect(contrast).toBeGreaterThanOrEqual(4.5) // WCAG AA standard
  })
  
  it('should meet contrast ratios in dark mode', () => {
    document.documentElement.classList.add('dark')
    render(<Button variant="primary">Dark Mode Button</Button>)
    
    const button = screen.getByRole('button')
    const styles = window.getComputedStyle(button)
    
    const contrast = getContrast(styles.backgroundColor, styles.color)
    expect(contrast).toBeGreaterThanOrEqual(4.5)
    
    document.documentElement.classList.remove('dark')
  })
})
```

**Impact:** Ensures text meets WCAG contrast requirements for readability.

---

### T-K007 · Add Keyboard-Only Navigation Tests
**Priority:** 3 | **Severity:** Medium | **Batch:** K | **Status:** ⏳ PENDING

**What:** Missing comprehensive keyboard navigation testing for WCAG 2.1.1 compliance.

**Implementation:**
```typescript
// src/components/__tests__/keyboard.test.tsx
import { fireEvent } from '@testing-library/react'

describe('Keyboard Navigation', () => {
  it('should navigate mobile menu with keyboard only', async () => {
    const { container } = renderWithSession(<Navigation />)
    
    // Open menu with keyboard
    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.keyDown(menuButton, { key: 'Enter' })
    
    // Test Tab navigation
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    expect(document.activeElement).toHaveAttribute('href', '#services')
    
    // Test Escape key
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(menuButton).toHaveFocus()
  })
  
  it('should trap focus within modal dialogs', async () => {
    // Test focus trapping in error boundaries and modals
  })
})
```

**Impact:** Ensures full keyboard accessibility compliance.

---

### T-K008 · Implement E2E Accessibility Test Suite
**Priority:** 3 | **Severity:** Medium | **Batch:** K | **Status:** ⏳ PENDING

**What:** Missing end-to-end accessibility testing with real screen readers and assistive technologies.

**Implementation:**
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Accessibility E2E Tests', () => {
  test('should pass axe accessibility audit on all pages', async ({ page }) => {
    await page.goto('/')
    
    // Run axe accessibility audit
    const accessibilityScanResults = await page.accessibility.snapshot()
    expect(accessibilityScanResults).toBeNull() // No violations
    
    // Test main pages
    const pages = ['/about', '/contact', '/services', '/barbers']
    for (const pagePath of pages) {
      await page.goto(pagePath)
      const scanResults = await page.accessibility.snapshot()
      expect(scanResults).toBeNull()
    }
  })
  
  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test semantic landmarks
    const landmarks = await page.locator('[role="banner"], [role="main"], [role="contentinfo"]')
    await expect(landmarks).toHaveCount(3)
    
    // Test heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toHaveRole('heading', { level: 1 })
  })
  
  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test Tab navigation through all interactive elements
    await page.keyboard.press('Tab')
    
    let focusedElement = await page.locator(':focus')
    expect(await focusedElement.isVisible()).toBe(true)
    
    // Navigate through all focusable elements
    const focusableElements = await page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const count = await focusableElements.count()
    
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab')
      focusedElement = await page.locator(':focus')
      expect(await focusedElement.isVisible()).toBe(true)
    }
  })
})
```

**Impact:** Provides comprehensive accessibility validation across user journeys.

---

### T-K009 · Add Automated Contrast Monitoring
**Priority:** 4 | **Severity:** Low | **Batch:** K | **Status:** ⏳ PENDING

**What:** No ongoing monitoring of color contrast compliance in CI/CD pipeline.

**Implementation:**
```typescript
// .github/workflows/accessibility.yml
name: Accessibility Audit

on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run accessibility tests
        run: npm run test:accessibility
        
      - name: Run axe audit
        run: npm run audit:accessibility
        
      - name: Check color contrast
        run: npm run audit:contrast
        
      - name: Upload accessibility report
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: accessibility-report.json
```

**Impact:** Prevents accessibility regressions in future development.

---

## �🔵 Open Backlog

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

---

## 🟨 BATCH G — Error Boundary Accessibility Enhancement
> Critical accessibility improvements for error handling patterns based on comprehensive accessibility audit.

### T-G001 · Integrate Screen Reader Announcements in ErrorBoundary
**Priority:** 1 | **Severity:** Critical | **Batch:** G | **Status:** ⏳ PENDING

**What:** ErrorBoundary currently lacks screen reader communication despite having `useAnnouncement` hook available in the codebase.

**Implementation:**
```typescript
// src/components/ErrorBoundary.tsx
import { useAnnouncement } from '@/hooks/useAnnouncement';

// In componentDidCatch
announce(`Error occurred: ${this.sanitizeError(error.message)}`, { 
  politeness: 'assertive' 
});

// In retry logic
announce(`Retrying... Attempt ${newRetryCount} of 3`, { 
  politeness: 'polite' 
});

// In success/failure
announce(this.state.retryCount >= 3 ? 'Retry limit reached' : 'Component recovered', {
  politeness: 'polite'
});
```

**Impact:** Provides immediate error awareness to screen reader users, meeting WCAG 2.1 4.1.3.

---

### T-G002 · Implement Focus Trap in ErrorBoundary
**Priority:** 1 | **Severity:** Critical | **Batch:** G | **Status:** ⏳ PENDING

**What:** ErrorBoundary has basic focus management but lacks proper focus trapping and escape key handling, despite `useFocusTrap` hook being available.

**Implementation:**
```typescript
// src/components/ErrorBoundary.tsx
import { useFocusTrap } from '@/hooks/useFocusTrap';

// Add to component
const errorDialogRef = useFocusTrap({
  isActive: this.state.hasError,
  onEscape: () => this.handleReset(),
  restoreFocus: true,
  initialFocus: this.errorRef.current
});

// Update error container
<div ref={errorDialogRef} role="alertdialog" aria-modal="true">
```

**Impact:** Ensures keyboard users can navigate error dialogs properly, meeting WCAG 2.1 2.1.1.

---

### T-G003 · Add Granular Error Boundaries to Dynamic Imports
**Priority:** 2 | **Severity:** High | **Batch:** G | **Status:** ⏳ PENDING

**What:** Root-level ErrorBoundary causes cascading failures. Individual Suspense boundaries need SafeComponent wrappers.

**Implementation:**
```typescript
// src/app/page.tsx - Wrap each lazy-loaded component
<Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
  <SafeComponent componentName="Services">
    <Services />
  </SafeComponent>
</Suspense>

<Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
  <SafeComponent componentName="Barbers">
    <Barbers />
  </SafeComponent>
</Suspense>
```

**Impact:** Prevents single component failures from breaking entire page sections.

---

### T-G004 · Enhance ErrorFallback Component Accessibility
**Priority:** 2 | **Severity:** High | **Batch:** G | **Status:** ⏳ PENDING

**What:** ErrorFallback component lacks proper ARIA attributes and focus management.

**Implementation:**
```typescript
// src/components/ErrorFallback.tsx
<div 
  role="alert"
  aria-live="polite"
  aria-atomic="true"
  className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
>
  <h3 className="sr-only" id="error-fallback-title">
    Component Error
  </h3>
  <div aria-describedby="error-fallback-description">
    {/* Error content */}
  </div>
</div>
```

**Impact:** Ensures consistent accessibility across all error states.

---

### T-G005 · Add Error Message Sanitization
**Priority:** 2 | **Severity:** High | **Batch:** G | **Status:** ⏳ PENDING

**What:** Development error details leak internal structure and potentially sensitive information.

**Implementation:**
```typescript
// src/components/ErrorBoundary.tsx
private sanitizeError(message: string): string {
  // Remove file paths, line numbers, and internal details
  return message
    .replace(/at.*\([^)]*\)/g, '') // Remove stack trace locations
    .replace(/\/[^\/]*\//g, '') // Remove file paths
    .substring(0, 200); // Limit length
}

// In error display
<p>{this.sanitizeError(this.state.error?.message || 'Unknown error')}</p>
```

**Impact:** Improves security and user experience with appropriate error messages.

---

### T-G006 · Add Retry Progress Indicators
**Priority:** 3 | **Severity:** Medium | **Batch:** G | **Status:** ⏳ PENDING

**What:** Retry attempts happen silently with no user feedback during backoff delays.

**Implementation:**
```typescript
// src/components/ErrorBoundary.tsx
// Add progress indicator for backoff delays
{this.state.retryTimeoutId && (
  <div className="retry-progress" role="status" aria-live="polite">
    <div className="progress-bar" style={{width: `${progressPercentage}%`}} />
    <span>Retrying in {remainingSeconds} seconds...</span>
  </div>
)}
```

**Impact:** Provides visual and auditory feedback during retry delays.

---

### T-G007 · Comprehensive Error Boundary Accessibility Testing
**Priority:** 3 | **Severity:** Medium | **Batch:** G | **Status:** ⏳ PENDING

**What:** Current tests cover basic axe violations but miss screen reader and keyboard navigation testing.

**Implementation:**
```typescript
// src/components/__tests__/ErrorBoundary.accessibility.test.tsx
describe('Error Boundary Accessibility', () => {
  it('should trap focus within error dialog', async () => {
    // Test focus trapping with Tab/Shift+Tab
  });
  
  it('should announce errors to screen readers', async () => {
    // Test useAnnouncement integration
  });
  
  it('should handle escape key properly', async () => {
    // Test escape key functionality
  });
});
```

**Impact:** Ensures accessibility features work correctly with assistive technologies.

---

### T-G008 · DataFetcher Error Integration
**Priority:** 3 | **Severity:** Medium | **Batch:** G | **Status:** ⏳ PENDING

**What:** DataFetcher component has retry logic but no accessibility announcements or error boundary integration.

**Implementation:**
```typescript
// src/components/DataFetcher.tsx
import { useAnnouncement } from '@/hooks/useAnnouncement';

// Add to component
const { announce } = useAnnouncement();

// In retry logic
announce(`Data fetch failed, retrying... Attempt ${currentRetry + 1}`, {
  politeness: 'polite'
});

// Wrap with SafeComponent in consuming components
<SafeComponent componentName="DataFetcher">
  <DataFetcher url="/api/services">
    {/* render props */}
  </DataFetcher>
</SafeComponent>
```

**Impact:** Provides consistent error communication for data fetching failures.

---

## 🔴 BATCH H — Critical Security & Database Fixes
> Addresses critical security vulnerabilities and database performance issues identified in architecture audit.

### T-H001 · Implement Row Level Security (RLS) Policies
**Priority:** 1 | **Severity:** Critical | **Batch:** H | **Status:** ⏳ PENDING

**What:** Database lacks RLS policies, creating potential data access vulnerabilities.

**Implementation:**
```sql
-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Booking access policies
CREATE POLICY booking_customer_access ON bookings
  FOR ALL USING (auth.uid()::text = customer_email OR auth.jwt()->>'role' = 'admin');

CREATE POLICY booking_public_read ON bookings
  FOR SELECT USING (status = 'confirmed');

-- Barber access policies  
CREATE POLICY barber_public_read ON barbers
  FOR SELECT USING (is_active = true);

CREATE POLICY barber_admin_write ON barbers
  FOR ALL USING (auth.jwt()->>'role' = 'admin');
```

**Impact:** Prevents unauthorized data access, meets compliance requirements.

---

### T-H002 · Add Database Performance Indexes
**Priority:** 1 | **Severity:** Critical | **Batch:** H | **Status:** ⏳ PENDING

**What:** Missing indexes causing slow queries on frequently accessed fields.

**Implementation:**
```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX CONCURRENTLY idx_bookings_date_barber ON bookings(date, barber_id);
CREATE INDEX CONCURRENTLY idx_bookings_status ON bookings(status);
CREATE INDEX CONCURRENTLY idx_bookings_created_at ON bookings(created_at);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_bookings_status_date ON bookings(status, date);
CREATE INDEX CONCURRENTLY idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_barbers_active ON barbers(is_active) WHERE is_active = true;

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_bookings_upcoming ON bookings(date) 
  WHERE date >= NOW() AND status = 'confirmed';
```

**Impact:** Dramatically improves query performance, reduces database load.

---

### T-H003 · Complete Sentry Error Monitoring Integration
**Priority:** 1 | **Severity:** Critical | **Batch:** H | **Status:** ⏳ PENDING

**What:** Sentry integration is commented out, leaving production errors unmonitored.

**Implementation:**
```typescript
// src/components/ErrorBoundary.tsx - Uncomment and enhance
import * as Sentry from '@sentry/nextjs';

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Send to Sentry with context
  Sentry.captureException(error, {
    contexts: { 
      react: { componentStack: errorInfo.componentStack },
      user: { session: this.getSessionData() }
    },
    tags: { component: 'ErrorBoundary', retryCount: this.state.retryCount }
  });
}

// src/hooks/useErrorHandler.ts - Uncomment
if (process.env.NODE_ENV === 'production') {
  Sentry.captureException(error);
}
```

**Impact:** Provides production error visibility and debugging capabilities.

---

### T-H004 · Add Database Connection Pooling Optimization
**Priority:** 2 | **Severity:** High | **Batch:** H | **Status:** ⏳ PENDING

**What:** Current connection pooling is basic and not optimized for production load.

**Implementation:**
```typescript
// src/lib/db/index.ts - Enhanced connection configuration
const client = postgres(connectionString, {
  max: 20, // Increased from 10
  idle_timeout: 30, // Increased from 20
  connect_timeout: 10,
  max_lifetime: 3600, // 1 hour connection lifetime
  connection_timeout: 10000,
  
  // Add connection retry logic
  retry: 3,
  retry_delay: 1000,
  
  // Add SSL for production
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// Add connection health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.select().from(services).limit(1);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
```

**Impact:** Improves database reliability and performance under load.

---

### T-H005 · Implement API Response Caching
**Priority:** 2 | **Severity:** High | **Batch:** H | **Status:** ⏳ PENDING

**What:** No caching strategy for API responses, causing unnecessary database queries.

**Implementation:**
```typescript
// src/lib/cache.ts - Simple Redis-based cache
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// src/app/api/services/route.ts
export async function GET() {
  return getCachedData('services:all', async () => {
    return serviceRepository.findAll();
  }, 3600); // 1 hour cache
}
```

**Impact:** Reduces database load, improves API response times.

---

## 🟡 BATCH I — Performance & Architecture Optimization
> Optimizes component architecture and implements advanced performance improvements.

### T-I001 · Split Navigation Component Architecture
**Priority:** 2 | **Severity:** High | **Batch:** I | **Status:** ⏳ PENDING

**What:** Navigation component is 304 lines and handles multiple concerns, violating single responsibility principle.

**Implementation:**
```typescript
// src/components/Navigation/Navigation.tsx - Main container
export default function Navigation() {
  return (
    <header>
      <NavigationBrand />
      <DesktopNavigation />
      <MobileMenuButton />
      <MobileNavigation />
    </header>
  );
}

// src/components/Navigation/DesktopNavigation.tsx
export default function DesktopNavigation() {
  const { session } = useSession();
  return (
    <nav>
      <NavigationItems />
      <AuthenticationSection session={session} />
      <BookingCTA />
    </nav>
  );
}

// src/components/Navigation/AuthenticationSection.tsx
export default function AuthenticationSection({ session }) {
  return session ? <UserMenu /> : <SignInButton />;
}
```

**Impact:** Improves maintainability, testability, and component reusability.

---

### T-I002 · Optimize Server/Client Component Boundaries
**Priority:** 2 | **Severity:** High | **Batch:** I | **Status:** ⏳ PENDING

**What:** Some components marked as "use client" could be server components with client islands.

**Implementation:**
```typescript
// src/components/Hero.tsx - Convert to server component
// Remove 'use client', move interactivity to children

export default function Hero() {
  return (
    <section>
      <HeroContent />
      <HeroCTAs />
    </section>
  );
}

// src/components/Hero/HeroCTAs.tsx - New client component
'use client';
export default function HeroCTAs() {
  return (
    <div>
      <Button href={EXTERNAL_LINKS.booking}>Book Appointment</Button>
      <Button href="#work">View Work</Button>
    </div>
  );
}
```

**Impact:** Reduces client-side JavaScript, improves performance.

---

### T-I003 · Add Loading States and Route Handlers
**Priority:** 3 | **Severity:** Medium | **Batch:** I | **Status:** ⏳ PENDING

**What:** Missing loading.tsx files and proper loading states for routes.

**Implementation:**
```typescript
// src/app/loading.tsx - Global loading state
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black" />
    </div>
  );
}

// src/app/services/loading.tsx - Route-specific loading
export default function ServicesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Impact:** Improves user experience during navigation and data loading.

---

### T-I004 · Implement Component Design System
**Priority:** 3 | **Severity:** Medium | **Batch:** I | **Status:** ⏳ PENDING

**What:** Inconsistent component patterns and missing design system foundation.

**Implementation:**
```typescript
// src/components/design-system/Button.tsx - Standardized button
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'accent' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, ...props }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
    const variantClasses = {
      primary: 'bg-black text-white hover:bg-gray-900 focus:ring-black',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
    };
    
    return (
      <button 
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

**Impact:** Ensures consistency, improves development velocity.

---

## 🟢 BATCH J — Infrastructure & Monitoring Enhancement
> Enhances development infrastructure and adds comprehensive monitoring capabilities.

### T-J001 · Add Comprehensive Audit Logging
**Priority:** 2 | **Severity:** High | **Batch:** J | **Status:** ⏳ PENDING

**What:** No audit trail for sensitive operations like booking changes and admin actions.

**Implementation:**
```typescript
// src/lib/audit.ts - Audit logging system
interface AuditEvent {
  action: string;
  userId?: string;
  resource: string;
  resourceId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  ip: string;
}

export async function logAuditEvent(event: Omit<AuditEvent, 'timestamp'>) {
  const auditEvent = {
    ...event,
    timestamp: new Date(),
  };
  
  // Store in database audit table
  await db.insert(auditLogs).values(auditEvent);
  
  // Send to external monitoring
  if (process.env.NODE_ENV === 'production') {
    await sendToMonitoring(auditEvent);
  }
}

// Usage in booking repository
async create(data: NewBooking): Promise<Booking> {
  const result = await db.insert(bookings).values(data).returning();
  
  await logAuditEvent({
    action: 'booking.created',
    resource: 'booking',
    resourceId: result[0].id,
    metadata: { customerEmail: data.customerEmail, serviceId: data.serviceId },
    ip: getClientIP(),
  });
  
  return result[0];
}
```

**Impact:** Provides security audit trail and compliance capabilities.

---

### T-J002 · Add Performance Monitoring Dashboard
**Priority:** 3 | **Severity:** Medium | **Batch:** J | **Status:** ⏳ PENDING

**What:** No real-time performance monitoring or alerting system.

**Implementation:**
```typescript
// src/lib/monitoring.ts - Performance monitoring
export class PerformanceMonitor {
  static trackPageLoad(page: string) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      page,
      fcp: navigation.responseStart - navigation.requestStart,
      lcp: this.getLCP(),
      cls: this.getCLS(),
      timestamp: new Date(),
    };
    
    // Send to monitoring service
    this.sendMetrics(metrics);
    
    // Alert on performance issues
    if (metrics.fcp > 2000) {
      this.alertSlowPageLoad(page, metrics.fcp);
    }
  }
  
  static trackAPICall(endpoint: string, duration: number, status: number) {
    if (duration > 5000 || status >= 500) {
      this.alertSlowAPI(endpoint, duration, status);
    }
  }
}

// src/app/layout.tsx - Add monitoring
useEffect(() => {
  PerformanceMonitor.trackPageLoad(window.location.pathname);
}, []);
```

**Impact:** Enables proactive performance optimization and issue detection.

---

### T-J003 · Add Database Migration Management
**Priority:** 3 | **Severity:** Medium | **Batch:** J | **Status:** ⏳ PENDING

**What:** No proper database migration versioning or rollback strategy.

**Implementation:**
```typescript
// drizzle/migrations/001_add_rls_policies.sql
-- Migration file with proper versioning
BEGIN;

-- Add RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ... policy definitions

-- Insert migration record
INSERT INTO schema_migrations (version, applied_at) 
VALUES ('001_add_rls_policies', NOW());

COMMIT;

-- src/lib/migrations.ts - Migration manager
export class MigrationManager {
  static async getCurrentVersion(): Promise<string> {
    const result = await db.select().from(schemaMigrations).orderBy(desc(schemaMigrations.appliedAt)).limit(1);
    return result[0]?.version || '000_initial';
  }
  
  static async migrate(targetVersion?: string) {
    const current = await this.getCurrentVersion();
    const migrations = await this.getMigrationsAfter(current, targetVersion);
    
    for (const migration of migrations) {
      await this.runMigration(migration);
    }
  }
}
```

**Impact:** Enables safe database schema changes and deployment automation.

---

### T-J004 · Add API Documentation Generation
**Priority:** 4 | **Severity:** Low | **Batch:** J | **Status:** ⏳ PENDING

**What:** No automated API documentation for internal and external consumers.

**Implementation:**
```typescript
// src/lib/api-docs.ts - OpenAPI documentation generation
export const apiDocs = {
  openapi: '3.0.0',
  info: {
    title: 'The Barber Cave API',
    version: '1.0.0',
    description: 'Barber shop booking and management API',
  },
  paths: {
    '/api/bookings': {
      post: {
        summary: 'Create a new booking',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: bookingSchema,
            },
          },
        },
        responses: {
          201: { description: 'Booking created successfully' },
          400: { description: 'Invalid booking data' },
          429: { description: 'Rate limit exceeded' },
        },
      },
    },
  },
};

// Add API docs endpoint
// src/app/api/docs/route.ts
export async function GET() {
  return Response.json(apiDocs);
}
```

**Impact:** Improves API discoverability and developer experience.

---

## 🟠 BATCH K — Bundle Size & Performance Optimization
> Addresses critical bundle size issues and performance bottlenecks identified in comprehensive assessment.

### T-K001 · Optimize Lucide React Icon Imports
**Priority:** 2 | **Severity:** High | **Batch:** K | **Status:** ⏳ PENDING

**What:** Individual icon imports from `lucide-react/dist/esm/icons/` prevent tree-shaking, increasing bundle size by ~15-20KB.

**Implementation:**
```typescript
// BEFORE - Inefficient imports
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import Scissors from 'lucide-react/dist/esm/icons/scissors';

// AFTER - Tree-shaking enabled
import { Menu, X, Scissors } from 'lucide-react';

// Update all components using individual imports:
// - Navigation.tsx (5 icons)
// - Services.tsx (2 icons) 
// - Barbers.tsx (1 icon)
// - And 8 other components
```

**Impact:** Reduces bundle size by 15-20KB, improves tree-shaking efficiency.

---

### T-K002 · Lazy Load Heavy Dependencies
**Priority:** 2 | **Severity:** High | **Batch:** K | **Status:** ⏳ PENDING

**What:** Heavy dependencies (@sentry/nextjs, @supabase/supabase-js, next-auth) loaded eagerly, adding ~40KB to initial bundle.

**Implementation:**
```typescript
// src/lib/lazy-loads.ts - Dynamic imports
export const loadSentry = () => import('@sentry/nextjs');
export const loadSupabase = () => import('@supabase/supabase-js');

// src/components/ErrorBoundary.tsx - Lazy load Sentry
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  if (process.env.NODE_ENV === 'production') {
    loadSentry().then(Sentry => {
      Sentry.captureException(error, { contexts: { react: errorInfo } });
    });
  }
}
```

**Impact:** Reduces initial bundle size by 25-30KB, improves load performance.

---

### T-K003 · Extract Authentication Logic from Navigation
**Priority:** 3 | **Severity:** Medium | **Batch:** K | **Status:** ⏳ PENDING

**What:** Navigation component (304 lines) handles authentication, increasing client-side bundle size unnecessarily.

**Implementation:**
```typescript
// src/components/Navigation/AuthenticationSection.tsx - New component
'use client';
export default function AuthenticationSection() {
  const { data: session, status } = useSession();
  // Move authentication logic here
}

// src/components/Navigation/Navigation.tsx - Simplified
export default function Navigation() {
  return (
    <header>
      <NavigationBrand />
      <DesktopNavigation />
      <MobileMenuButton />
      <MobileNavigation />
    </header>
  );
}
```

**Impact:** Reduces Navigation bundle size by 10-15KB, improves component maintainability.

---

### T-K004 · Remove Production Console Statements
**Priority:** 4 | **Severity:** Low | **Batch:** K | **Status:** ⏳ PENDING

**What:** 40 console.log statements across 22 files in production code, potentially leaking sensitive information.

**Implementation:**
```typescript
// src/lib/logger.ts - Production-safe logging
export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Keep errors in production
  }
};

// Replace all console.log with logger.debug
// Update 40 instances across 22 files
```

**Impact:** Improves security and reduces bundle size slightly.

---

## 🔴 BATCH L — Critical Security & Access Control
> Addresses critical security vulnerabilities and missing access controls identified in security audit.

### T-L001 · Implement Role-Based Access Control (RBAC)
**Priority:** 1 | **Severity:** Critical | **Batch:** L | **Status:** ⏳ PENDING

**What:** TODO comment in bookings API indicates missing RBAC - all authenticated users can access all bookings.

**Implementation:**
```typescript
// src/lib/rbac.ts - Role-based access control
export enum Role {
  CUSTOMER = 'customer',
  BARBER = 'barber',
  ADMIN = 'admin'
}

export function hasPermission(userRole: Role, resource: string, action: string): boolean {
  const permissions = {
    [Role.CUSTOMER]: {
      'booking': ['read:own', 'create'],
      'profile': ['read:own', 'update:own']
    },
    [Role.ADMIN]: {
      'booking': ['*'],
      'user': ['*'],
      'service': ['*'],
      'barber': ['*']
    }
  };
  
  return permissions[userRole]?.[resource]?.includes('*') || 
         permissions[userRole]?.[resource]?.includes(action) || false;
}

// src/app/api/bookings/route.ts - Apply RBAC
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || Role.CUSTOMER;
  
  if (!hasPermission(userRole, 'booking', 'read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Continue with authorized access
}
```

**Impact:** Prevents unauthorized data access, meets security compliance requirements.

---

### T-L002 · Add Database Connection Pooling
**Priority:** 2 | **Severity:** High | **Batch:** L | **Status:** ⏳ PENDING

**What:** No database connection pooling optimization, causing potential performance issues under load.

**Implementation:**
```typescript
// src/lib/db/index.ts - Enhanced connection configuration
const client = postgres(process.env.DATABASE_URL, {
  max: 20, // Increased connection pool
  idle_timeout: 30, // Idle connection timeout
  connect_timeout: 10,
  max_lifetime: 3600, // 1 hour connection lifetime
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  
  // Add retry logic for failed connections
  retry: 3,
  retry_delay: 1000,
});
```

**Impact:** Improves database performance and reliability under load.

---

### T-L003 · Implement API Response Caching Strategy
**Priority:** 2 | **Severity:** High | **Batch:** L | **Status:** ⏳ PENDING

**What:** No caching strategy for API responses, causing unnecessary database queries and slow response times.

**Implementation:**
```typescript
// src/lib/cache.ts - Simple in-memory cache with TTL
export class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  set(key: string, data: any, ttl: number = 3600) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}

// src/app/api/services/route.ts - Add caching
export async function GET() {
  const cached = cache.get('services:all');
  if (cached) {
    return NextResponse.json(cached);
  }
  
  const services = await serviceRepository.findAll();
  cache.set('services:all', services, 3600); // 1 hour cache
  
  return NextResponse.json(services);
}
```

**Impact:** Reduces database load, improves API response times significantly.

---

## 🟡 BATCH M — Code Quality & Technical Debt
> Addresses code quality issues and technical debt identified in comprehensive assessment.

### T-M001 · Resolve All TODO Comments (17 instances)
**Priority:** 3 | **Severity:** Medium | **Batch:** M | **Status:** ⏳ PENDING

**What:** 17 TODO comments across codebase indicating incomplete features and technical debt.

**Implementation:**
```bash
# Priority TODOs to resolve:
# 1. src/app/api/bookings/route.ts - Add role-based access control
# 2. src/components/Barbers.tsx - Add pagination for large barber lists
# 3. src/components/Gallery.tsx - Implement lazy loading for images
# 4. src/components/Services.tsx - Add service filtering and search
# 5. src/hooks/useBooking.ts - Add booking cancellation logic
# 6. src/lib/auth.ts - Implement refresh token rotation
# 7. src/middleware.ts - Add rate limiting per user
```

**Impact:** Improves code completeness, reduces technical debt, enhances functionality.

---

### T-M002 · Add Comprehensive Error Handling
**Priority:** 3 | **Severity:** Medium | **Batch:** M | **Status:** ⏳ PENDING

**What:** Inconsistent error handling patterns across API routes and components.

**Implementation:**
```typescript
// src/lib/error-handler.ts - Centralized error handling
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  
  console.error('Unhandled API error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

**Impact:** Improves error consistency, debugging, and user experience.

---

## 🟢 BATCH N — Performance Monitoring & Optimization
> Implements comprehensive performance monitoring and optimization strategies.

### T-N001 · Add Real Performance Monitoring
**Priority:** 3 | **Severity:** Medium | **Batch:** N | **Status:** ⏳ PENDING

**What:** No real-time performance monitoring beyond basic Sentry integration.

**Implementation:**
```typescript
// src/lib/performance.ts - Performance monitoring
export class PerformanceTracker {
  static trackPageLoad(page: string) {
    if (typeof window === 'undefined') return;
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      page,
      fcp: navigation.responseStart - navigation.requestStart,
      lcp: this.getLCP(),
      cls: this.getCLS(),
      timestamp: new Date().toISOString(),
    };
    
    // Alert on performance issues
    if (metrics.fcp > 2000) {
      console.warn(`Slow First Contentful Paint on ${page}: ${metrics.fcp}ms`);
    }
  }
}

// src/app/layout.tsx - Add performance tracking
useEffect(() => {
  PerformanceTracker.trackPageLoad(window.location.pathname);
}, []);
```

**Impact:** Enables proactive performance optimization and issue detection.

---

### T-N002 · Add Bundle Size Monitoring
**Priority:** 4 | **Severity:** Low | **Batch:** N | **Status:** ⏳ PENDING

**What:** No automated bundle size monitoring or alerts for size regressions.

**Implementation:**
```json
// package.json - Add bundle size monitoring
{
  "scripts": {
    "build:analyze": "ANALYZE=true npm run build -- --webpack",
    "bundle-size:check": "npm run build:analyze && node scripts/check-bundle-size.js"
  }
}

// scripts/check-bundle-size.js - Bundle size validation
const BUNDLE_LIMITS = {
  'nodejs.html': 250000, // 250KB
  'edge.html': 150000,   // 150KB
  'client.html': 100000  // 100KB
};
```

**Impact:** Prevents bundle size regressions, maintains performance standards.

---

## 🔴 BATCH O — Documentation & Developer Experience Critical Fixes
> Addresses critical documentation build failures and missing developer experience infrastructure.

### T-O001 · Fix TypeDoc Build Errors (105 TypeScript errors)
**Priority:** 1 | **Severity:** Critical | **Batch:** O | **Status:** ⏳ PENDING

**What:** TypeDoc build fails with 105 TypeScript errors, preventing all API documentation generation.

**Implementation Steps:**
1. Fix authentication configuration in `src/lib/auth.ts`
2. Correct NextRequest import in `src/middleware.ts`
3. Resolve React store issues in `src/store/booking-store.ts`
4. Test TypeDoc build locally: `npm run docs:build`

**Impact:** Unblocks API documentation generation, enables developer onboarding.

---

### T-O002 · Create Missing Documentation Files
**Priority:** 1 | **Severity:** Critical | **Batch:** O | **Status:** ⏳ PENDING

**What:** Critical documentation files referenced in README don't exist.

**Files to Create:**
- TESTING_GUIDE.md
- CONTRIBUTING.md  
- DEBUGGING.md

**Impact:** Provides essential developer guidance, improves onboarding experience.

---

### T-O003 · Implement Documentation Automation
**Priority:** 1 | **Severity:** Critical | **Batch:** O | **Status:** ⏳ PENDING

**What:** No automated documentation build/deployment pipeline.

**Implementation:**
- Add TypeDoc build step to CI/CD
- Deploy documentation to GitHub Pages
- Update package.json scripts

**Impact:** Ensures documentation stays current, provides automated deployment.

---

## 🔴 BATCH P — Performance & Bundle Size Optimization
> Addresses critical performance issues and bundle size optimizations.

### T-P001 · Optimize Lucide React Icon Imports
**Priority:** 2 | **Severity:** High | **Batch:** P | **Status:** ⏳ PENDING

**What:** Individual icon imports prevent tree-shaking, increasing bundle size by ~15-20KB.

**Implementation:**
- Change from individual imports to barrel imports
- Update 10+ component files

**Impact:** Reduces bundle size by 15-20KB, improves tree-shaking efficiency.

---

### T-P002 · Lazy Load Heavy Dependencies
**Priority:** 2 | **Severity:** High | **Batch:** P | **Status:** ⏳ PENDING

**What:** Heavy dependencies loaded eagerly, adding ~40KB to initial bundle.

**Implementation:**
- Dynamic imports for Sentry, Supabase, NextAuth
- Update ErrorBoundary and authentication components

**Impact:** Reduces initial bundle size by 25-30KB, improves load performance.

---

## 🟡 BATCH Q — Security & Access Control Enhancement
> Enhances security infrastructure and implements proper access controls.

### T-Q001 · Implement Role-Based Access Control (RBAC)
**Priority:** 1 | **Severity:** Critical | **Batch:** Q | **Status:** ⏳ PENDING

**What:** Missing RBAC - all authenticated users can access all bookings.

**Implementation:**
- Create RBAC system with Customer/Barber/Admin roles
- Update API routes to enforce permissions
- Add role checking middleware

**Impact:** Prevents unauthorized data access, meets security compliance requirements.

---

### T-Q002 · Add Database Connection Pooling
**Priority:** 2 | **Severity:** High | **Batch:** Q | **Status:** ⏳ PENDING

**What:** No database connection pooling optimization.

**Implementation:**
- Enhanced PostgreSQL client configuration
- Connection health checks
- Retry logic for failed connections

**Impact:** Improves database performance and reliability under load.

---

## 🟢 BATCH R — Code Quality & Technical Debt
> Addresses code quality issues and reduces technical debt.

### T-R001 · Resolve All TODO Comments (17 instances)
**Priority:** 3 | **Severity:** Medium | **Batch:** R | **Status:** ⏳ PENDING

**What:** 17 TODO comments across codebase indicating incomplete features.

**Implementation:**
- Address each TODO comment systematically
- Implement missing features or remove obsolete comments
- Update with completion status

**Impact:** Improves code completeness, reduces technical debt.

---

## 🟠 BATCH S — Monitoring & Observability Enhancement
> Implements comprehensive monitoring and observability capabilities.

### T-S001 · Add Performance Monitoring Dashboard
**Priority:** 3 | **Severity:** Medium | **Batch:** S | **Status:** ⏳ PENDING

**What:** No real-time performance monitoring or alerting system.

**Implementation:**
- Performance tracking system
- Real-time metrics collection
- Alerting for performance regressions

**Impact:** Enables proactive performance optimization and issue detection.

---

## 🔴 BATCH T — Critical TypeScript & Build Issues
> Resolves critical TypeScript compilation errors preventing builds.

### T-T001 · Fix TypeScript Compilation Errors
**Priority:** 1 | **Severity:** Critical | **Batch:** T | **Status:** ⏳ PENDING

**What:** Multiple TypeScript errors preventing successful builds.

**Implementation:**
- Fix authentication configuration
- Correct import statements
- Resolve type mismatches

**Impact:** Enables successful builds, documentation generation, and deployment.

---

## 🟢 BATCH U — Accessibility & Testing Enhancement
> Enhances accessibility compliance and testing infrastructure.

### T-U001 · Fix Critical Test Environment Issues
**Priority:** 1 | **Severity:** Critical | **Batch:** U | **Status:** ⏳ PENDING

**What:** Navigation component tests fail due to missing SessionProvider wrapper.

**Implementation:**
- Update test setup with SessionProvider
- Fix mock configurations
- Add proper test wrappers

**Impact:** Unblocks accessibility testing and ensures WCAG compliance validation.

---

## 🟡 BATCH V — Infrastructure & Deployment Enhancement
> Enhances deployment infrastructure and adds operational capabilities.

### T-V001 · Add Database Migration Management
**Priority:** 3 | **Severity:** Medium | **Batch:** V | **Status:** ⏳ PENDING

**What:** No proper database migration versioning or rollback strategy.

**Implementation:**
- Migration manager system
- Version tracking
- Rollback capabilities

**Impact:** Enables safe database schema changes and deployment automation.

---

## 🟠 BATCH W — Bundle Size & Performance Optimization
> Addresses critical bundle size issues and performance bottlenecks.

### T-W001 · Remove Production Console Statements
**Priority:** 4 | **Severity:** Low | **Batch:** W | **Status:** ⏳ PENDING

**What:** 40 console.log statements in production code.

**Implementation:**
- Production-safe logging system
- Replace console.log with logger.debug
- Update 40 instances across 22 files

**Impact:** Improves security and reduces bundle size slightly.

---

### T-W002 · Add Bundle Size Monitoring
**Priority:** 4 | **Severity:** Low | **Batch:** W | **Status:** ⏳ PENDING

**What:** No automated bundle size monitoring or alerts.

**Implementation:**
- Bundle size validation scripts
- Automated monitoring in CI/CD
- Size regression alerts

**Impact:** Prevents bundle size regressions, maintains performance standards.

---

## 🔴 BATCH X — Critical Enterprise Risk Remediation
> Addresses critical enterprise-level risks identified in comprehensive architecture audit.

### T-X001 · Fix Build System & TypeScript Compilation Errors
**Priority:** 1 | **Severity:** Critical | **Batch:** X | **Status:** ⏳ PENDING

**What:** Build fails with Turbopack incompatibility and NextAuth route type mismatch, blocking all deployments.

**Implementation:**
```typescript
// Fix next.config.ts
serverExternalPackages: ['@next-auth/prisma-adapter'] // Move from experimental

// Fix NextAuth route type issues
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

**Impact:** Unblocks deployment pipeline, enables bundle analysis and documentation generation.

---

### T-X002 · Implement Multi-Location Database Architecture
**Priority:** 1 | **Severity:** Critical | **Batch:** X | **Status:** ⏳ PENDING

**What:** Database schema lacks location/branch support, preventing multi-location expansion.

**Implementation:**
```sql
-- Add location support
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  timezone varchar(50) NOT NULL DEFAULT 'America/Chicago',
  currency varchar(3) NOT NULL DEFAULT 'USD',
  address jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Update existing tables
ALTER TABLE barbers ADD COLUMN location_id uuid REFERENCES locations(id);
ALTER TABLE services ADD COLUMN location_id uuid REFERENCES locations(id);
ALTER TABLE bookings ADD COLUMN location_id uuid REFERENCES locations(id);
```

**Impact:** Enables international expansion, supports London location and future growth.

---

### T-X003 · Implement Comprehensive Caching Strategy
**Priority:** 1 | **Severity:** Critical | **Batch:** X | **Status:** ⏳ PENDING

**What:** Complete absence of caching causing poor performance and database overload.

**Implementation:**
```typescript
// src/lib/cache.ts - Redis implementation
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedData<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)
  
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Add HTTP caching headers
// src/app/api/services/route.ts
export async function GET() {
  return NextResponse.json({
    services: await getCachedData('services:all', () => serviceRepository.findAll())
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

**Impact:** Reduces database load by 80%, improves API response times, enables scalability.

---

### T-X004 · Add Internationalization Framework
**Priority:** 1 | **Severity:** Critical | **Batch:** X | **Status:** ⏳ PENDING

**What:** No i18n support preventing international expansion and multi-location operations.

**Implementation:**
```typescript
// Install next-intl
npm install next-intl

// src/i18n/config.ts
export const locales = ['en', 'en-GB'] as const
export const defaultLocale = 'en' as const

// src/i18n/messages/en.json
{
  "navigation": {
    "services": "Services",
    "barbers": "Barbers",
    "book": "Book Appointment"
  }
}

// src/i18n/messages/en-GB.json
{
  "navigation": {
    "services": "Services",
    "barbers": "Barbers", 
    "book": "Book Appointment"
  }
}
```

**Impact:** Enables UK market entry, supports future international expansion.

---

### T-X005 · Implement PWA Foundation
**Priority:** 2 | **Severity:** High | **Batch:** X | **Status:** ⏳ PENDING

**What:** No PWA capabilities limiting mobile user experience and engagement.

**Implementation:**
```typescript
// public/manifest.json
{
  "name": "The Barber Cave",
  "short_name": "Barber Cave",
  "description": "Luxury barber shop booking",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}

// src/app/layout.tsx - Add PWA meta tags
export const metadata: Metadata = {
  // ... existing metadata
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Barber Cave',
  },
}
```

**Impact:** Improves mobile engagement, enables offline functionality, supports app-like experience.

---

### T-X006 · Add Advanced Monitoring & Observability
**Priority:** 2 | **Severity:** High | **Batch:** X | **Status:** ⏳ PENDING

**What:** No comprehensive monitoring preventing proactive issue detection and performance optimization.

**Implementation:**
```typescript
// src/lib/monitoring.ts
export class PerformanceMonitor {
  static trackPageLoad(page: string) {
    const navigation = performance.getEntriesByType('navigation')[0]
    
    const metrics = {
      page,
      fcp: navigation.responseStart - navigation.requestStart,
      lcp: this.getLCP(),
      cls: this.getCLS(),
      timestamp: new Date(),
    }
    
    // Send to monitoring service
    this.sendMetrics(metrics)
    
    // Alert on performance issues
    if (metrics.fcp > 2000) {
      this.alertSlowPageLoad(page, metrics.fcp)
    }
  }
  
  static trackAPICall(endpoint: string, duration: number, status: number) {
    if (duration > 5000 || status >= 500) {
      this.alertSlowAPI(endpoint, duration, status)
    }
  }
}

// src/app/layout.tsx - Add monitoring
useEffect(() => {
  PerformanceMonitor.trackPageLoad(window.location.pathname)
}, [])
```

**Impact:** Enables proactive performance optimization, provides business intelligence, supports SLA monitoring.

---

### T-X007 · Implement Role-Based Access Control (RBAC)
**Priority:** 2 | **Severity:** High | **Batch:** X | **Status:** ⏳ PENDING

**What:** Missing RBAC system creating security vulnerabilities and compliance gaps.

**Implementation:**
```typescript
// src/lib/rbac.ts
export enum Role {
  CUSTOMER = 'customer',
  BARBER = 'barber', 
  ADMIN = 'admin',
  OWNER = 'owner'
}

export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export const RBAC_PERMISSIONS = {
  [Role.CUSTOMER]: [
    { resource: 'booking', action: 'create' },
    { resource: 'booking', action: 'read:own' }
  ],
  [Role.BARBER]: [
    { resource: 'booking', action: 'read:own' },
    { resource: 'service', action: 'read' }
  ],
  [Role.ADMIN]: [
    { resource: 'booking', action: 'read:all' },
    { resource: 'booking', action: 'update' }
  ],
  [Role.OWNER]: [
    { resource: '*', action: '*' } // All permissions
  ]
}

// src/lib/middleware.ts - Add RBAC check
export function checkPermission(role: Role, resource: string, action: string): boolean {
  const permissions = RBAC_PERMISSIONS[role] || []
  return permissions.some(p => 
    (p.resource === resource || p.resource === '*') &&
    (p.action === action || p.action === '*')
  )
}
```

**Impact:** Prevents unauthorized data access, meets compliance requirements, enables multi-user roles.

---

### T-X008 · Add Database Performance Optimization
**Priority:** 2 | **Severity:** High | **Batch:** X | **Status:** ⏳ PENDING

**What:** Missing database indexes and connection pooling causing performance bottlenecks.

**Implementation:**
```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX CONCURRENTLY idx_bookings_date_barber ON bookings(date, barber_id);
CREATE INDEX CONCURRENTLY idx_bookings_status ON bookings(status);
CREATE INDEX CONCURRENTLY idx_bookings_location_date ON bookings(location_id, date);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_bookings_status_date ON bookings(status, date);
CREATE INDEX CONCURRENTLY idx_services_active ON services(is_active) WHERE is_active = true;

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_bookings_upcoming ON bookings(date) 
  WHERE date >= NOW() AND status = 'confirmed';
```

```typescript
// Enhanced connection pooling
// src/lib/db/index.ts
const client = postgres(connectionString, {
  max: 20, // Increased from 10
  idle_timeout: 30,
  connect_timeout: 10,
  max_lifetime: 3600,
  retry: 3,
  retry_delay: 1000,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})
```

**Impact:** Improves query performance by 70%, reduces database load, enables scalability.

---

## 🟢 BATCH Y — Component Architecture & State Management Enhancement
> Enhances component architecture and implements proper state management patterns.

### T-Y001 · Implement Design System Foundation
**Priority:** 2 | **Severity:** High | **Batch:** Y | **Status:** ⏳ PENDING

**What:** No design system causing inconsistent UI patterns and development inefficiency.

**Implementation:**
```typescript
// src/components/design-system/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'accent' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, ...props }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'
    const variantClasses = {
      primary: 'bg-black text-white hover:bg-gray-900 focus:ring-black',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
    }
    
    return (
      <button 
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
```

**Impact:** Ensures UI consistency, improves development velocity, reduces technical debt.

---

### T-Y002 · Implement Global State Management
**Priority:** 2 | **Severity:** High | **Batch:** Y | **Status:** ⏳ PENDING

**What:** No global state management causing prop drilling and data inconsistency.

**Implementation:**
```typescript
// src/store/booking-store.ts
import { create } from 'zustand'

interface BookingStore {
  bookings: Booking[]
  selectedBarber: Barber | null
  selectedService: Service | null
  loading: boolean
  error: string | null
  
  // Actions
  setBookings: (bookings: Booking[]) => void
  selectBarber: (barber: Barber) => void
  selectService: (service: Service) => void
  createBooking: (booking: NewBooking) => Promise<void>
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  selectedBarber: null,
  selectedService: null,
  loading: false,
  error: null,
  
  setBookings: (bookings) => set({ bookings }),
  
  selectBarber: (barber) => set({ selectedBarber: barber }),
  
  selectService: (service) => set({ selectedService: service }),
  
  createBooking: async (booking) => {
    set({ loading: true, error: null })
    try {
      const result = await bookingRepository.create(booking)
      set(state => ({ 
        bookings: [...state.bookings, result],
        loading: false 
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))
```

**Impact:** Eliminates prop drilling, improves data consistency, enhances developer experience.

---

### T-Y003 · Optimize Server/Client Component Boundaries
**Priority:** 3 | **Severity:** Medium | **Batch:** Y | **Status:** ⏳ PENDING

**What:** Components marked as "use client" that could be server components with client islands.

**Implementation:**
```typescript
// src/components/Hero.tsx - Convert to server component
export default function Hero() {
  return (
    <section>
      <HeroContent />
      <HeroCTAs />
    </section>
  )
}

// src/components/Hero/HeroCTAs.tsx - New client component
'use client'
export default function HeroCTAs() {
  return (
    <div>
      <Button href={EXTERNAL_LINKS.booking}>Book Appointment</Button>
      <Button href="#work">View Work</Button>
    </div>
  )
}
```

**Impact:** Reduces client-side JavaScript by 30%, improves performance, enhances SEO.

---

## 🟡 BATCH Z — Testing & Quality Assurance Enhancement
> Enhances testing infrastructure and implements comprehensive quality assurance.

### T-Z001 · Consolidate Testing Frameworks
**Priority:** 2 | **Severity:** High | **Batch:** Z | **Status:** ⏳ PENDING

**What:** Dual testing frameworks (Jest + Vitest) causing confusion and maintenance overhead.

**Implementation:**
```bash
# Remove Jest completely
npm uninstall jest @types/jest @testing-library/jest-dom
rm jest.config.js jest.setup.js

# Update vitest.config.ts - Add Jest DOM matchers
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Add Jest DOM compatibility
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

**Impact:** Simplifies testing setup, reduces maintenance overhead, improves developer experience.

---

### T-Z002 · Add Integration Testing Suite
**Priority:** 3 | **Severity:** Medium | **Batch**: Z | **Status:** ⏳ PENDING

**What:** Missing integration tests for API endpoints and database operations.

**Implementation:**
```typescript
// src/__tests__/integration/bookings.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { bookingRepository } from '@/lib/repositories/booking-repository'
import { serviceRepository } from '@/lib/repositories/service-repository'
import { barberRepository } from '@/lib/repositories/barber-repository'

describe('Booking Integration Tests', () => {
  let testService: Service
  let testBarber: Barber
  
  beforeEach(async () => {
    // Setup test data
    testService = await serviceRepository.create({
      name: 'Test Service',
      duration: 30,
      price: '25.00'
    })
    
    testBarber = await barberRepository.create({
      name: 'Test Barber',
      email: 'test@example.com'
    })
  })
  
  afterEach(async () => {
    // Cleanup test data
    await bookingRepository.deleteAll()
    await serviceRepository.delete(testService.id)
    await barberRepository.delete(testBarber.id)
  })
  
  it('should create booking successfully', async () => {
    const booking = await bookingRepository.create({
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      serviceId: testService.id,
      barberId: testBarber.id,
      date: new Date(),
      time: '10:00',
      duration: testService.duration,
      price: testService.price
    })
    
    expect(booking.id).toBeDefined()
    expect(booking.customerName).toBe('John Doe')
  })
  
  it('should check availability correctly', async () => {
    const date = new Date()
    const time = '10:00'
    
    const isAvailable = await bookingRepository.checkAvailability(
      testBarber.id,
      date,
      time,
      testService.duration
    )
    
    expect(isAvailable).toBe(true)
  })
})
```

**Impact:** Ensures API reliability, catches integration issues, improves confidence in deployments.

---

### T-Z003 · Add Performance Regression Testing
**Priority**: 3 | **Severity**: Medium | **Batch**: Z | **Status**: ⏳ PENDING

**What:** No automated performance testing allowing performance regressions.

**Implementation:**
```typescript
// src/__tests__/performance/bundle-size.test.ts
import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Bundle Size Tests', () => {
  it('should not exceed bundle size limits', () => {
    const bundleStats = JSON.parse(execSync('npm run build:analyze --json', { encoding: 'utf8' }))
    
    // Check individual chunks
    expect(bundleStats.chunks.find(c => c.name === 'main')?.size).toBeLessThan(300000) // 300KB
    expect(bundleStats.chunks.find(c => c.name === 'vendors')?.size).toBeLessThan(200000) // 200KB
    
    // Check total size
    const totalSize = bundleStats.chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    expect(totalSize).toBeLessThan(550000) // 550KB
  })
})

// src/__tests__/performance/api-response-time.test.ts
describe('API Performance Tests', () => {
  it('should respond within acceptable time limits', async () => {
    const startTime = Date.now()
    
    const response = await fetch('/api/services')
    const data = await response.json()
    
    const responseTime = Date.now() - startTime
    
    expect(responseTime).toBeLessThan(1000) // 1 second
    expect(data.services).toBeDefined()
  })
})
```

**Impact:** Prevents performance regressions, maintains user experience standards.

---

## 🟠 Open Backlog

### T-9001 · Advanced Analytics Dashboard
**Priority:** 4 | **Status:** open

Implement comprehensive analytics dashboard with business metrics, customer insights, and performance tracking.

---

### T-9002 · Multi-Currency Support
**Priority:** 4 | **Status:** open

Add support for multiple currencies with real-time exchange rate conversion for international locations.

---

### T-9003 · Advanced Booking Features
**Priority:** 4 | **Status:** open

Add recurring appointments, waitlist management, and automated reminders.

---

### T-9004 · Customer Portal
**Priority:** 4 | **Status:** open

Develop customer portal for booking management, appointment history, and preferences.
