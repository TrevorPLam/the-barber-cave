# Repository Structural Integrity Audit

```
MODE: PLAN

Audit the repository architecture.

Context:
- Next.js 16 App Router
- React 19
- Strict TypeScript
- Supabase + Drizzle ORM
- NextAuth authentication
- Zustand state management
- Sentry error monitoring
- Enterprise-oriented patterns
- Security hardened (CSP, DOMPurify, validation)
- Heavy testing culture (Vitest, Playwright, Storybook)

Evaluate:
- Folder structure consistency
- Separation of concerns
- Component coupling
- Data layer organization (Supabase/Drizzle)
- Hook placement correctness
- Reusable component boundaries
- Server vs Client component correctness
- State management organization (Zustand)
- Authentication flow organization (NextAuth)
- Error handling integration (Sentry)
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
