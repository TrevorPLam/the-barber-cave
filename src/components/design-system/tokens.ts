/**
 * Design-system color tokens for The Barber Cave.
 *
 * All foreground/background pairs are annotated with their WCAG 2.2 contrast
 * ratio so contrast tests can import this file as the single source of truth.
 *
 * Ratios are pre-computed (see contrast.test.tsx for verification):
 *  - AA normal text  requires ≥ 4.5 : 1
 *  - AA large text   requires ≥ 3.0 : 1
 *  - AAA normal text requires ≥ 7.0 : 1
 */

// ─── Raw palette ──────────────────────────────────────────────────────────────

/** Raw hex color values that make up the brand palette. */
export const palette = {
  // Brand gold
  gold: '#d4af37',
  goldDark: '#b8960c',

  // Neutrals
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray300: '#d1d5db',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827',
  black: '#000000',

  // Surface / backgrounds
  surfaceLight: '#ffffff',
  surfaceDark: '#0a0a0a',

  // Semantic
  errorRed: '#dc2626',    // red-600
  errorRedLight: '#fca5a5', // red-300 – for dark backgrounds
  successGreen: '#16a34a', // green-600
  warningAmber: '#d97706', // amber-600

  // Text
  textPrimary: '#111827',    // gray-900 on white — ratio ≈ 16 : 1
  textSecondary: '#374151',  // gray-700 on white — ratio ≈ 10.7 : 1
  textMuted: '#6b7280',      // gray-500 on white — ratio ≈ 4.6 : 1
  textOnDark: '#f9fafb',     // gray-50  on #0a0a0a — ratio ≈ 19.2 : 1
  textOnGold: '#111827',     // gray-900 on gold   — ratio ≈ 4.6 : 1
} as const

// ─── Semantic token pairs ─────────────────────────────────────────────────────
// Each entry names a foreground+background combination used in the UI.

/** A foreground/background color pair with its required WCAG compliance level. */
export interface ColorPair {
  /** Foreground (text or icon) hex color. */
  foreground: string
  /** Background hex color. */
  background: string
  /** Minimum required WCAG ratio for this usage. */
  wcagLevel: 'AA' | 'AA-large' | 'AAA'
}

/** Named foreground/background pairs used across the UI. */
export const colorPairs: Record<string, ColorPair> = {
  /** Default body text */
  bodyText: {
    foreground: palette.textPrimary,
    background: palette.surfaceLight,
    wcagLevel: 'AAA',
  },
  /** Secondary / supporting text */
  secondaryText: {
    foreground: palette.textSecondary,
    background: palette.surfaceLight,
    wcagLevel: 'AAA',
  },
  /** Muted / placeholder text */
  mutedText: {
    foreground: palette.textMuted,
    background: palette.surfaceLight,
    wcagLevel: 'AA',
  },
  /** Primary (gold) button — dark text on gold background */
  primaryButton: {
    foreground: palette.textOnGold,
    background: palette.gold,
    wcagLevel: 'AA',
  },
  /** Dark-section text — light text on near-black background */
  darkSectionText: {
    foreground: palette.textOnDark,
    background: palette.surfaceDark,
    wcagLevel: 'AAA',
  },
  /** Error message text on white */
  errorText: {
    foreground: palette.errorRed,
    background: palette.surfaceLight,
    wcagLevel: 'AA',
  },
  /** Barber card label on white */
  cardLabel: {
    foreground: palette.gray700,
    background: palette.surfaceLight,
    wcagLevel: 'AA',
  },
} as const
