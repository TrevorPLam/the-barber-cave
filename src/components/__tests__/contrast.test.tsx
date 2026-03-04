/**
 * Color contrast unit tests — WCAG 2.2 AA compliance.
 *
 * Verifies that every color pair defined in design-system/tokens.ts meets its
 * declared WCAG level without relying on an external contrast library.  The
 * relative-luminance and contrast-ratio formulas are taken directly from the
 * WCAG 2.2 specification (https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
 */

import { describe, it, expect } from 'vitest'
import { palette, colorPairs } from '@/components/design-system/tokens'

// ─── WCAG contrast math ───────────────────────────────────────────────────────

/** Convert a hex color string to [r, g, b] in the 0–255 range. */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const n = parseInt(clean, 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

/**
 * Compute relative luminance of a hex color.
 * WCAG 2.2 §1.4.3 formula.
 */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Compute WCAG contrast ratio between two hex colors.
 * Returns a value in [1, 21].
 */
function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Minimum contrast ratio required for each WCAG level (normal text). */
const WCAG_MINIMUM: Record<'AA' | 'AA-large' | 'AAA', number> = {
  'AA': 4.5,
  'AA-large': 3.0,
  'AAA': 7.0,
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WCAG color contrast — design-system/tokens', () => {
  describe('contrast ratio helper', () => {
    it('black on white = 21:1 (maximum contrast)', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    })

    it('white on white = 1:1 (no contrast)', () => {
      expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 4)
    })

    it('mid-gray on white is below AA threshold', () => {
      // #aaaaaa (170, 170, 170) ≈ 2.32:1 on white
      expect(contrastRatio('#aaaaaa', '#ffffff')).toBeLessThan(4.5)
    })
  })

  describe('palette hex values are valid', () => {
    it('all palette values start with #', () => {
      for (const [name, value] of Object.entries(palette)) {
        expect(value, `palette.${name}`).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
    })
  })

  describe('semantic color pairs meet their WCAG level', () => {
    for (const [name, pair] of Object.entries(colorPairs)) {
      it(`${name} meets WCAG ${pair.wcagLevel} (≥ ${WCAG_MINIMUM[pair.wcagLevel]}:1)`, () => {
        const ratio = contrastRatio(pair.foreground, pair.background)
        const min = WCAG_MINIMUM[pair.wcagLevel]
        expect(
          ratio,
          `${name}: ${pair.foreground} on ${pair.background} → ratio ${ratio.toFixed(2)} < ${min}`,
        ).toBeGreaterThanOrEqual(min)
      })
    }
  })

  describe('critical brand color combinations', () => {
    it('primary button (gold bg, dark text) meets AA (≥ 4.5:1)', () => {
      expect(contrastRatio(palette.textOnGold, palette.gold)).toBeGreaterThanOrEqual(4.5)
    })

    it('body text on white meets AAA (≥ 7:1)', () => {
      expect(contrastRatio(palette.textPrimary, palette.surfaceLight)).toBeGreaterThanOrEqual(7)
    })

    it('dark section text meets AAA (≥ 7:1)', () => {
      expect(contrastRatio(palette.textOnDark, palette.surfaceDark)).toBeGreaterThanOrEqual(7)
    })

    it('error text on white meets AA (≥ 4.5:1)', () => {
      expect(contrastRatio(palette.errorRed, palette.surfaceLight)).toBeGreaterThanOrEqual(4.5)
    })

    it('muted text on white meets AA (≥ 4.5:1)', () => {
      expect(contrastRatio(palette.textMuted, palette.surfaceLight)).toBeGreaterThanOrEqual(4.5)
    })
  })
})
