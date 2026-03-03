Below is a **production-grade Prompt Library for Windsurf Cascade** tailored specifically to your repository:

> **Project Context**: The Barber Cave
> Stack: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, Zod, Vitest, Playwright
> Priorities: Performance, Security (CSP hardened), Accessibility (WCAG 2.2 AA), Enterprise patterns
> Development Style: AI-orchestrated, audit-driven, non-regression focused

This library is organized into:

1. 🔍 Structural & Architecture Diagnostics
2. ⚡ Performance Optimization
3. 🔐 Security Hardening
4. ♿ Accessibility & UX
5. 🧪 Testing & Reliability
6. 🧠 React Pattern & Rendering Optimization
7. 📦 Bundle & Build Optimization
8. 🧾 Technical Debt & Risk Audits
9. 🚀 Upgrade & Future-Readiness
10. 🧩 Master “Full-System Audit” Prompt

All prompts assume **PLAN mode first** unless explicitly stated.

---

# 🏗 1. Architecture & Structural Diagnostics

---

## 1.1 Repository Structural Integrity Audit

```
MODE: PLAN

Audit the repository architecture.

Context:
- Next.js 16 App Router
- React 19
- Strict TypeScript
- Enterprise-oriented patterns
- Security hardened (CSP, validation)
- Heavy testing culture

Evaluate:
- Folder structure consistency
- Separation of concerns
- Component coupling
- Data layer organization
- Hook placement correctness
- Reusable component boundaries
- Server vs Client component correctness
- Over-centralization of logic
- Violations of single responsibility principle

Deliver:
1. Structural strengths
2. Architectural weaknesses
3. Refactor candidates
4. Risk ranking (low/medium/high)
5. Recommended phased improvements

Do NOT modify files.
```

---

## 1.2 App Router & Server Component Audit

```
MODE: PLAN

Audit correct usage of Next.js 16 App Router.

Check:
- Unnecessary "use client" usage
- Server components that should be server-only
- Client components that could be server components
- Suspense boundary correctness
- Layout nesting inefficiencies
- Metadata usage correctness
- Route segment optimization

Deliver:
- Misuse list
- Performance impact assessment
- Refactor plan
```

---

# ⚡ 2. Performance Optimization Library

---

## 2.1 React Rendering Audit

```
MODE: PLAN

Perform deep React rendering audit.

Check:
- Unstable props
- Missing memoization
- Overuse of React.memo
- Inline object/function recreation
- useEffect misuse
- Derived state anti-patterns
- Context re-render cascades
- Large component re-render surfaces

Deliver:
- Rendering inefficiencies
- Estimated re-render impact
- Recommended fixes
- Complexity assessment
```

---

## 2.2 Image Optimization Audit

```
MODE: PLAN

Audit image performance implementation.

Evaluate:
- Next.js Image usage correctness
- Priority usage correctness
- Lazy loading correctness
- Blur placeholder usage
- Responsive sizing correctness
- Largest Contentful Paint impact
- Over-fetching image sizes

Deliver:
- Optimization gaps
- LCP risk areas
- Suggested improvements
```

---

## 2.3 Lighthouse Performance Preservation

```
MODE: PLAN

Simulate Lighthouse impact of current architecture.

Evaluate:
- Core Web Vitals risks
- Script hydration cost
- Client bundle weight
- Third-party script risk
- Font loading strategy
- Preconnect/preload effectiveness

Deliver:
- Risk ranking
- Likely Lighthouse score vulnerabilities
- Improvement plan
```

---

# 🔐 3. Security Audit Library

---

## 3.1 Frontend Security Audit

```
MODE: PLAN

Perform security review.

Check:
- XSS vectors
- dangerouslySetInnerHTML usage
- Unsanitized user input
- URL injection risks
- Booking link redirect vulnerabilities
- CSP violations
- Nonce correctness
- Environment variable exposure
- Client-side secret leakage

Deliver:
- Vulnerabilities
- Severity classification
- Patch recommendation
- Regression risk
```

---

## 3.2 Zod & Validation Audit

```
MODE: PLAN

Audit all user-input validation.

Check:
- Missing Zod schemas
- Weak validation rules
- Overly permissive schemas
- TypeScript mismatch risks
- Server/client validation parity
- Error handling consistency

Deliver:
- Validation gaps
- Hardening suggestions
```

---

# ♿ 4. Accessibility & UX Audit

---

## 4.1 WCAG 2.2 AA Audit

```
MODE: PLAN

Audit for WCAG 2.2 AA compliance.

Check:
- ARIA misuse
- Missing labels
- Keyboard navigation traps
- Focus management
- Screen reader announcements
- Error messaging accessibility
- Color contrast risks
- Semantic HTML correctness

Deliver:
- Violations
- Severity
- File paths
- Fix plan
```

---

## 4.2 Error Boundary Accessibility Audit

```
MODE: PLAN

Audit ErrorBoundary and SafeComponent patterns.

Evaluate:
- Focus shift on error
- Screen reader announcement
- Retry logic accessibility
- Error UI semantic correctness

Deliver:
- Accessibility gaps
- Improvement plan
```

---

# 🧪 5. Testing & Reliability Library

---

## 5.1 Coverage Gap Analysis

```
MODE: PLAN

Analyze test coverage gaps.

Check:
- Component edge cases
- Hook failure states
- Zod validation failures
- Accessibility failure scenarios
- Image load errors
- Suspense fallback states
- Error boundary triggers
- Booking CTA interactions

Deliver:
- Missing tests
- Recommended test file placement
- Mocking strategy
```

---

## 5.2 E2E Flow Integrity Audit

```
MODE: PLAN

Audit Playwright E2E tests.

Check:
- Critical booking flow coverage
- Mobile viewport coverage
- Failure scenario coverage
- Cross-browser realism
- Flaky test risks

Deliver:
- Missing flows
- Flakiness risks
- Stability improvements
```

---

# 🧠 6. React Pattern Modernization

---

## 6.1 Compound Component Audit

```
MODE: PLAN

Audit compound component usage.

Evaluate:
- Context misuse
- Over-nesting
- API surface complexity
- Consumer ergonomics
- Scalability risk

Deliver:
- API complexity rating
- Refactor suggestions
```

---

## 6.2 Hook Architecture Audit

```
MODE: PLAN

Audit custom hooks.

Check:
- State isolation correctness
- Side-effect handling
- Dependency array correctness
- Race conditions
- Memory leaks
- AbortController usage where needed

Deliver:
- Risk points
- Improvements
```

---

# 📦 7. Bundle & Build Optimization

---

## 7.1 Bundle Size Audit

```
MODE: PLAN

Audit bundle size risks.

Check:
- Large dependencies
- Duplicate dependencies
- Client component bloat
- Unused imports
- Heavy icon imports
- Tree-shaking issues

Deliver:
- Bundle weight risk areas
- Optimization plan
```

---

## 7.2 Hydration Risk Audit

```
MODE: PLAN

Audit hydration mismatch risk.

Check:
- Date usage
- Random values
- Window usage
- Client-only logic in server components
- Dynamic content mismatch

Deliver:
- High-risk files
- Fix recommendations
```

---

# 🧾 8. Technical Debt & Risk

---

## 8.1 Enterprise Risk Audit

```
MODE: PLAN

Conduct enterprise-level risk audit.

Assess:
- Scalability limits
- Multi-location future readiness
- Booking system integration risks
- API layer absence
- Maintainability concerns
- Code duplication
- Refactor debt

Deliver:
- Technical debt score (1–10)
- Scalability risk score
- Long-term refactor roadmap
```

---

# 🚀 9. Upgrade & Future Readiness

---

## 9.1 Future-Expansion Audit

```
MODE: PLAN

Assess readiness for:
- Multi-location support
- Customer accounts
- Payment processing
- SMS integration
- PWA conversion

Deliver:
- Structural blockers
- Required architectural shifts
- Refactor roadmap
```

---

# 🧩 10. MASTER SYSTEM AUDIT (Use Quarterly)

This is your nuclear option.

```
MODE: PLAN

Conduct full-system audit of The Barber Cave.

Context:
- Next.js 16
- React 19
- Strict TS
- CSP hardened
- WCAG 2.2 AA compliant
- Heavy testing
- Enterprise-forward roadmap

Evaluate:
- Architecture
- Performance
- Security
- Accessibility
- Testing coverage
- Scalability
- Bundle size
- Hydration risks
- Technical debt
- React pattern integrity
- Future expansion readiness

Deliver:
1. Executive summary
2. Risk matrix
3. Severity ranking
4. Technical debt score
5. Performance risk score
6. Security risk score
7. 90-day improvement roadmap
8. Immediate critical fixes
9. Non-regression enforcement checklist

Do NOT modify code.
```

---

# 🧠 How You Should Use This Library

For maximum reliability:

1. Always PLAN first
2. Review output
3. Ask for risk clarification
4. Approve implementation
5. Run performance audit
6. Run security audit
7. Run regression test expansion

This is how you orchestrate AI like a CTO.

---

