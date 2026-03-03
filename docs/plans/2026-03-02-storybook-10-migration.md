# Storybook 10.2.14 Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate from mixed Storybook versions (8.6.14/10.2.14) to unified Storybook 10.2.14 with ESM compatibility and modern features.

**Architecture:** Automated upgrade using Storybook's migration tool, followed by manual configuration updates and verification testing.

**Tech Stack:** Storybook 10.2.14, React 19.2.3, Next.js 16.1.6, Node 24.13.0, Vite 7.3.1

---

## Pre-Migration Analysis

### Task 1: Backup Current State

**Files:**
- Read: `package.json`
- Read: `.storybook/main.ts`
- Read: `.storybook/preview.ts`

**Step 1: Document current Storybook configuration**

```bash
# Create migration backup
cp package.json package.json.backup
cp -r .storybook .storybook.backup
```

**Step 2: List current Storybook packages**

```bash
npm list @storybook/* --depth=0 > current-storybook-deps.txt
```

**Step 3: Commit backup**

```bash
git add package.json.backup .storybook.backup current-storybook-deps.txt
git commit -m "feat: backup pre-Storybook 10 migration state"
```

---

## Phase 1: Automated Migration

### Task 2: Run Storybook Automated Upgrade

**Files:**
- Modify: `package.json` (auto-updated)
- Modify: `.storybook/main.ts` (potentially auto-updated)

**Step 1: Clean existing node_modules**

```bash
rm -rf node_modules package-lock.json
```

**Step 2: Run automated upgrade**

```bash
npx storybook@latest upgrade
```

**Expected Output:**
- Detection of Storybook projects
- Breaking changes analysis
- Dependency updates to 10.2.14
- Automigration prompts

**Step 3: Review and accept automigration changes**

**Step 4: Install dependencies with legacy peer support**

```bash
npm install --legacy-peer-deps
```

**Step 5: Commit automated migration**

```bash
git add package.json .storybook/
git commit -m "feat: Storybook 10.2.14 automated migration"
```

---

## Phase 2: Configuration Updates

### Task 3: Verify ESM Configuration

**Files:**
- Verify: `.storybook/main.ts`
- Verify: `.storybook/preview.ts`

**Step 1: Check main.ts ESM compliance**

```typescript
// Should be ESM (already is)
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions', 
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // ... rest of config
};
```

**Step 2: Check preview.ts ESM compliance**

```typescript
// Should be ESM (already is)
import type { Preview } from '@storybook/react';

const preview: Preview = {
  // ... config
};
```

**Step 3: Verify no CommonJS syntax**

Search for: `require(`, `module.exports`, `__dirname`

**Step 4: Commit any ESM fixes**

```bash
git add .storybook/
git commit -m "fix: ensure Storybook configs are ESM compliant"
```

---

### Task 4: Update Addon Versions

**Files:**
- Modify: `package.json`

**Step 1: Check current addon versions**

```bash
npm list @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y
```

**Step 2: Manually align to 10.2.14 if needed**

Update `package.json`:
```json
{
  "devDependencies": {
    "@storybook/addon-essentials": "^10.2.14",
    "@storybook/addon-interactions": "^10.2.14", 
    "@storybook/addon-a11y": "^10.2.14",
    "@storybook/react": "^10.2.14",
    "@storybook/react-vite": "^10.2.14",
    "@storybook/builder-vite": "^10.2.14",
    "@storybook/test-runner": "^0.24.2"
  }
}
```

**Step 3: Install aligned versions**

```bash
npm install --legacy-peer-deps
```

**Step 4: Commit version alignment**

```bash
git add package.json
git commit -m "fix: align all Storybook packages to 10.2.14"
```

---

## Phase 3: Testing & Verification

### Task 5: Basic Storybook Startup Test

**Files:**
- Test: Storybook development server

**Step 1: Attempt Storybook startup**

```bash
npm run storybook
```

**Expected:** Storybook starts successfully on http://localhost:6006

**Step 2: Check for addon resolution errors**

Look for:
- "Could not resolve addon" errors
- JSON parsing errors
- ESM import errors

**Step 3: If errors occur, troubleshoot**

Common fixes:
- Clear cache: `rm -rf .storybook/storybook-static`
- Reinstall: `npm install --legacy-peer-deps`
- Check Node version: `node --version` (should be 24.13.0+)

**Step 4: Stop Storybook server**

```bash
Ctrl+C
```

**Step 5: Commit any troubleshooting fixes**

```bash
git add .
git commit -m "fix: resolve Storybook 10 startup issues"
```

---

### Task 6: Story Rendering Verification

**Files:**
- Test: Existing stories
- Verify: Component rendering

**Step 1: Start Storybook**

```bash
npm run storybook &
```

**Step 2: Test key stories**

Navigate to and verify:
- `Button` stories (if exist)
- `About` stories 
- Any component stories in `src/components/`

**Step 3: Check console for errors**

Look for:
- React 19 compatibility issues
- Import/export errors
- TypeScript errors

**Step 4: Test addon functionality**

Verify:
- Controls addon works
- Actions addon works
- Accessibility addon works

**Step 5: Stop Storybook and commit fixes**

```bash
git add .
git commit -m "fix: resolve story rendering issues in Storybook 10"
```

---

### Task 7: Build Process Verification

**Files:**
- Test: Storybook build

**Step 1: Test Storybook build**

```bash
npm run build-storybook
```

**Expected:** Successful build to `.storybook-static`

**Step 2: Verify build output**

```bash
ls -la .storybook-static/
```

**Step 3: Test static build serves**

```bash
npx serve .storybook-static -p 6007 &
```

**Step 4: Navigate to http://localhost:6007 and verify**

**Step 5: Stop server and commit build fixes**

```bash
pkill serve
git add .
git commit -m "fix: resolve Storybook 10 build issues"
```

---

## Phase 4: Modern Features Adoption

### Task 8: Enable CSF Factories (Optional)

**Files:**
- Modify: Sample story files
- Test: CSF Factory syntax

**Step 1: Choose one story to convert**

Example: `src/components/About.stories.tsx`

**Step 2: Convert to CSF Factory syntax**

```typescript
// Before (CSF 3)
import type { Meta, StoryObj } from '@storybook/react';
import About from './About';

const meta = {
  component: About,
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// After (CSF Factory)
import preview from '../.storybook/preview';
import About from './About';

const meta = preview.meta({ component: About });
export const Default = meta.story({});
```

**Step 3: Test converted story**

**Step 4: Commit CSF Factory example**

```bash
git add src/components/About.stories.tsx
git commit -m "feat: adopt CSF Factory syntax for About component"
```

---

### Task 9: Module Mocking Setup (Optional)

**Files:**
- Create: `.storybook/test.ts`
- Test: Mock functionality

**Step 1: Create test configuration**

```typescript
// .storybook/test.ts
import { beforeAll } from '@storybook/test';

beforeAll(() => {
  // Set up global mocks
});
```

**Step 2: Test sb.mock in a story**

```typescript
// Example in a story file
export const WithMock = {
  play: async () => {
    sb.mock('./api', () => ({
      fetchData: () => Promise.resolve('mocked data')
    }));
  }
};
```

**Step 3: Commit mocking setup**

```bash
git add .storybook/test.ts
git commit -m "feat: set up Storybook 10 module mocking"
```

---

## Phase 5: Integration Testing

### Task 10: Full Integration Test

**Files:**
- Test: Complete workflow
- Verify: All integrations

**Step 1: Test complete development workflow**

```bash
# Clean start
rm -rf .storybook-static node_modules/.cache
npm install --legacy-peer-deps

# Start dev server
npm run storybook &
sleep 10

# Test all major stories
# (Manual verification step)

# Stop dev server
pkill -f storybook
```

**Step 2: Test build workflow**

```bash
npm run build-storybook
```

**Step 3: Test Chromatic integration**

```bash
npm run test:visual
```

**Step 4: Verify all tests pass**

```bash
npm run test:coverage
npm run lint
```

**Step 5: Final integration commit**

```bash
git add .
git commit -m "feat: complete Storybook 10.2.14 migration - all integrations verified"
```

---

## Phase 6: Documentation & Cleanup

### Task 11: Update Documentation

**Files:**
- Modify: `README.md`
- Create: `docs/STORYBOOK.md`

**Step 1: Update README.md**

Add Storybook 10 section:
```markdown
## Storybook Development

This project uses Storybook 10.2.14 for component development and testing.

### Starting Storybook
```bash
npm run storybook
```

### Building Storybook
```bash
npm run build-storybook
```

### Features
- CSF Factory syntax support
- Module mocking with sb.mock
- Enhanced accessibility testing
- Vite-based development server
```

**Step 2: Create Storybook documentation**

```markdown
# Storybook Configuration

## Version
- Storybook 10.2.14
- React 19.2.3 compatible
- Next.js 16.1.6 integration

## Migration Notes
Migrated from mixed 8.6.14/10.2.14 to unified 10.2.14 on 2026-03-02.

## Features Enabled
- ESM-only configuration
- CSF Factory syntax (preview)
- Module mocking capabilities
- Enhanced addon ecosystem
```

**Step 3: Commit documentation**

```bash
git add README.md docs/STORYBOOK.md
git commit -m "docs: update Storybook 10 documentation and migration notes"
```

---

### Task 12: Final Cleanup

**Files:**
- Remove: Backup files
- Clean: Cache files

**Step 1: Remove backup files**

```bash
rm package.json.backup
rm -rf .storybook.backup
rm current-storybook-deps.txt
```

**Step 2: Clean caches**

```bash
rm -rf .storybook/storybook-static
rm -rf node_modules/.cache
npm run build-storybook  # Fresh build
```

**Step 3: Final verification test**

```bash
npm run storybook &
sleep 5
curl -s http://localhost:6006 > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Storybook 10.2.14 migration successful"
else
  echo "❌ Storybook migration failed"
  exit 1
fi
pkill -f storybook
```

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: complete Storybook 10.2.14 migration - cleanup and verification"
```

---

## Migration Success Criteria

✅ **Storybook starts without errors**  
✅ **All stories render correctly**  
✅ **Build process works**  
✅ **All addons functional**  
✅ **No console errors**  
✅ **Tests pass**  
✅ **Documentation updated**  

---
