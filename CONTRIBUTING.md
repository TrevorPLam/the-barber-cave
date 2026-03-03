# Contributing to The Barber Cave

Thank you for contributing! This guide explains the Git workflow, branch conventions, PR standards, and code quality requirements.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Branch Conventions](#branch-conventions)
- [Commit Message Standards](#commit-message-standards)
- [Pull Request Process](#pull-request-process)
- [Code Quality Standards](#code-quality-standards)
- [Testing Requirements](#testing-requirements)
- [Review Checklist](#review-checklist)

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/the-barber-cave.git
   cd the-barber-cave
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a `.env.local`** file from the template:
   ```bash
   cp .env.example .env.local
   # Fill in the required values
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. **Verify tests pass** before making changes:
   ```bash
   npm test -- --run
   ```

---

## Branch Conventions

| Branch Type   | Pattern                         | Example                          |
| ------------- | ------------------------------- | -------------------------------- |
| Feature       | `feat/<short-description>`      | `feat/navigation-split`          |
| Bug fix       | `fix/<short-description>`       | `fix/mobile-menu-focus-trap`     |
| Documentation | `docs/<short-description>`      | `docs/testing-guide`             |
| Refactor      | `refactor/<short-description>`  | `refactor/design-system`         |
| Chore         | `chore/<short-description>`     | `chore/update-dependencies`      |
| Hotfix        | `hotfix/<short-description>`    | `hotfix/booking-ts-error`        |

All branches should be cut from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/my-feature
```

---

## Commit Message Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                        |
| ---------- | -------------------------------------------------- |
| `feat`     | New feature or capability                          |
| `fix`      | Bug fix                                            |
| `docs`     | Documentation changes only                        |
| `style`    | Formatting, whitespace (no logic change)           |
| `refactor` | Code restructuring (no feature / bug change)       |
| `test`     | Adding or updating tests                           |
| `chore`    | Build process, dependency updates, tooling         |
| `perf`     | Performance improvements                           |
| `ci`       | CI/CD configuration changes                        |

### Examples

```
feat(navigation): split Navigation into sub-components

Extracts NavigationBrand, DesktopNavigation, MobileNavigation,
MobileMenuButton, and AuthenticationSection from monolithic Navigation.tsx.
No behavior changes; each component now has single responsibility.

Closes T-I001
```

```
fix(store): rename booking-store.ts to .tsx for JSX support

TypeScript could not parse JSX syntax in a .ts file.
```

---

## Pull Request Process

1. **Push your branch** to your fork:
   ```bash
   git push origin feat/my-feature
   ```

2. **Open a PR** against the `main` branch of the upstream repository.

3. **Fill out the PR template** (title, description, linked TODO item, screenshots for UI changes).

4. **Ensure all CI checks pass**:
   - Lint (`npm run lint`)
   - Type check (`tsc --noEmit`)
   - Unit tests (`npm test -- --run`)
   - Accessibility audit

5. **Request at least one review** before merging.

6. **Squash commits** when merging to keep `main` history clean.

### PR Title Format

```
<type>(<scope>): <summary>  [T-XXXX]
```

Example: `feat(navigation): split Navigation into sub-components [T-I001]`

---

## Code Quality Standards

### TypeScript

- **Strict mode** is enabled. All new code must be fully typed.
- No `any` unless absolutely necessary — prefer `unknown` with type guards.
- JSX code must live in `.tsx` files.
- Run `tsc --noEmit` before pushing.

### React

- Prefer **server components** for non-interactive UI.
- Use `'use client'` only when the component needs browser APIs or React hooks.
- All components should have a JSDoc comment block explaining purpose, props, and accessibility considerations.
- Use `memo()` for expensive or frequently re-rendered components.
- Avoid prop drilling beyond 2 levels — use Zustand or React context.

### Styling

- Use **Tailwind CSS** utility classes.
- No inline styles unless absolutely necessary.
- Follow the existing spacing and color token conventions from `globals.css`.

### File Structure

- Components: `src/components/<ComponentName>.tsx`
- Sub-components: `src/components/<FeatureName>/<SubComponentName>.tsx`
- Design system: `src/components/design-system/<ComponentName>.tsx`
- Hooks: `src/hooks/use<HookName>.ts`
- Utilities: `src/utils/<utility-name>.ts`
- Data: `src/data/<data-name>.ts`

---

## Testing Requirements

Every PR must include or update tests for the changed code:

- **New components** → add a test file in `__tests__/` adjacent to the component.
- **Bug fixes** → add a regression test that would have caught the bug.
- **Utility functions** → 90%+ coverage required.
- **Accessibility** → run `axe` on new or modified components.

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for full details.

---

## Review Checklist

Before requesting a review, verify:

- [ ] `npm run lint` passes with no errors
- [ ] `tsc --noEmit` passes with no errors  
- [ ] `npm test -- --run` passes (or new test failures are explained)
- [ ] New/changed components have JSDoc comments
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast checked
- [ ] No `console.log` statements left in code
- [ ] PR description includes the linked TODO task ID (e.g., `T-I001`)
- [ ] Screenshots attached for UI changes
