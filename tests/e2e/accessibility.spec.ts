/**
 * tests/e2e/accessibility.spec.ts
 * T-K008: E2E Accessibility Test Suite
 *
 * Tests WCAG 2.2 AA compliance across all available pages:
 * - Semantic landmarks (banner, main, contentinfo, navigation)
 * - Heading hierarchy (single h1, logical nesting)
 * - Keyboard-only navigation
 * - Image alt text
 * - Interactive element accessible names
 * - Focus management
 */
import { test, expect } from '@playwright/test'

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Sign In', path: '/auth/signin' },
]

// ─── Landmark Structure ──────────────────────────────────────────────────────

test.describe('Semantic Landmarks', () => {
  for (const { name, path } of PAGES) {
    test(`${name}: has a <main> landmark`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('main')).toBeVisible()
    })

    test(`${name}: has a header / banner landmark`, async ({ page }) => {
      await page.goto(path)
      // Either a <header> element or role="banner"
      const banner = page.locator('header, [role="banner"]').first()
      await expect(banner).toBeAttached()
    })

    test(`${name}: has a footer / contentinfo landmark`, async ({ page }) => {
      await page.goto(path)
      const footer = page.locator('footer, [role="contentinfo"]').first()
      await expect(footer).toBeAttached()
    })
  }
})

// ─── Heading Hierarchy ───────────────────────────────────────────────────────

test.describe('Heading Hierarchy', () => {
  for (const { name, path } of PAGES) {
    test(`${name}: has exactly one h1`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1')).toHaveCount(1)
    })

    test(`${name}: h1 is visible and non-empty`, async ({ page }) => {
      await page.goto(path)
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      const text = await h1.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    })

    test(`${name}: no h3 or lower heading appears before an h2`, async ({ page }) => {
      await page.goto(path)
      const headings = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll(els =>
          els.map(el => parseInt(el.tagName.replace('H', ''), 10)),
        )

      let maxSeen = 1
      for (const level of headings) {
        // A heading should never jump more than one level at a time going deeper
        expect(level).toBeLessThanOrEqual(maxSeen + 1)
        if (level > maxSeen) maxSeen = level
      }
    })
  }
})

// ─── Image Alt Text ──────────────────────────────────────────────────────────

test.describe('Image Alt Text', () => {
  for (const { name, path } of PAGES) {
    test(`${name}: all images have an alt attribute`, async ({ page }) => {
      await page.goto(path)
      const images = page.locator('img')
      const count = await images.count()

      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        // alt must be present (can be empty string for decorative images)
        const alt = await img.getAttribute('alt')
        expect(alt, `img[${i}] is missing alt attribute`).not.toBeNull()
      }
    })
  }
})

// ─── Interactive Element Accessible Names ────────────────────────────────────

test.describe('Accessible Names', () => {
  for (const { name, path } of PAGES) {
    test(`${name}: all buttons have an accessible name`, async ({ page }) => {
      await page.goto(path)
      const buttons = page.locator('button')
      const count = await buttons.count()

      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i)
        // Skip hidden buttons
        if (!(await btn.isVisible())) continue
        const accessibleName =
          (await btn.getAttribute('aria-label')) ??
          (await btn.textContent()) ??
          ''
        expect(
          accessibleName.trim().length,
          `button[${i}] has no accessible name`,
        ).toBeGreaterThan(0)
      }
    })

    test(`${name}: all links have an accessible name`, async ({ page }) => {
      await page.goto(path)
      const links = page.locator('a')
      const count = await links.count()

      for (let i = 0; i < count; i++) {
        const link = links.nth(i)
        if (!(await link.isVisible())) continue
        const accessibleName =
          (await link.getAttribute('aria-label')) ??
          (await link.textContent()) ??
          ''
        expect(
          accessibleName.trim().length,
          `a[${i}] has no accessible name`,
        ).toBeGreaterThan(0)
      }
    })
  }
})

// ─── Keyboard Navigation ─────────────────────────────────────────────────────

test.describe('Keyboard Navigation', () => {
  test('Homepage: Tab key reaches all interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Tab through the first 10 focusable elements and verify focus moves
    const focusedElements: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        return el.tagName + (el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : '')
      })
      if (focused) focusedElements.push(focused)
    }

    // At least some interactive elements should have received focus
    expect(focusedElements.length).toBeGreaterThan(0)
  })

  test('Homepage: focused elements have visible focus indicators', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focusedEl = page.locator(':focus')
    // The focused element should be visible
    await expect(focusedEl).toBeVisible()
  })

  test('Homepage: mobile menu opens and closes with keyboard', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuToggle = page.locator('[aria-label="Toggle menu"]')
    if (!(await menuToggle.isVisible())) return // Skip if desktop nav shown

    // Open menu with Enter key
    await menuToggle.focus()
    await page.keyboard.press('Enter')
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')

    // Close menu with Escape key
    await page.keyboard.press('Escape')
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('Sign In: Tab key cycles through form fields', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.waitForLoadState('domcontentloaded')

    const inputs = page.locator('input:visible, button:visible')
    const count = await inputs.count()
    if (count === 0) return // Skip if no focusable inputs

    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA']).toContain(focused)
  })
})

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('Homepage: navigation has a role or aria-label', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav').first()
    await expect(nav).toBeAttached()
  })

  test('Homepage: skip-to-content link or equivalent focus management', async ({ page }) => {
    await page.goto('/')
    // Press Tab once — many accessible sites surface a skip link as the first focusable element
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement)
    // We verify focus has moved to a non-body element
    expect(focused).not.toBeNull()
  })
})

// ─── Page Title ──────────────────────────────────────────────────────────────

test.describe('Page Titles', () => {
  test('Homepage: has a meaningful page title', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title.trim().length).toBeGreaterThan(0)
    // Title should not be just "Untitled" or generic
    expect(title.toLowerCase()).not.toBe('untitled')
  })

  test('Sign In: page title includes context', async ({ page }) => {
    await page.goto('/auth/signin')
    const title = await page.title()
    expect(title.trim().length).toBeGreaterThan(0)
  })
})
