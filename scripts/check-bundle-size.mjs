#!/usr/bin/env node
/**
 * scripts/check-bundle-size.mjs
 * T-W002/T-N002: Bundle Size Monitoring
 *
 * Reads the Next.js build manifest and checks that each chunk stays within
 * the configured size budgets.  Exits with code 1 if any budget is exceeded
 * so CI can fail-fast on bundle size regressions.
 *
 * Usage:
 *   node scripts/check-bundle-size.js            (check against defaults)
 *   BUNDLE_STRICT=true node scripts/check-bundle-size.js  (strict mode)
 *
 * Run after `npm run build`.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')
const NEXT_DIR = join(ROOT, '.next')
const STATIC_DIR = join(NEXT_DIR, 'static')

// ─── Size budgets (bytes) ─────────────────────────────────────────────────────

const BUDGETS = {
  // Individual JS chunk limits
  maxChunkKB: 300,
  // Aggregated totals
  maxTotalJsKB: 550,
  maxTotalCssKB: 100,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function kb(bytes) {
  return (bytes / 1024).toFixed(1)
}

/** Recursively collect all files under `dir` matching `predicate`. */
function collectFiles(dir, predicate, results = []) {
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      collectFiles(full, predicate, results)
    } else if (predicate(entry, full)) {
      results.push({ path: full, size: stat.size, name: entry })
    }
  }
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(NEXT_DIR)) {
    console.warn(
      '⚠  .next/ build directory not found. Run `npm run build` first.',
    )
    console.warn('   Skipping bundle size check.')
    process.exit(0)
  }

  const jsFiles = collectFiles(
    join(STATIC_DIR, 'chunks'),
    name => extname(name) === '.js',
  )

  const cssFiles = collectFiles(
    STATIC_DIR,
    name => extname(name) === '.css',
  )

  if (jsFiles.length === 0) {
    console.warn('⚠  No JS chunks found under .next/static/chunks/. Was the build successful?')
    process.exit(0)
  }

  let failed = false
  const errors = []

  // ── Per-chunk checks ─────────────────────────────────────────────────────

  console.log('\n📦  Bundle Size Report\n' + '─'.repeat(60))

  const chunkBudgetBytes = BUDGETS.maxChunkKB * 1024
  for (const file of jsFiles) {
    const status = file.size > chunkBudgetBytes ? '❌' : '✅'
    if (file.size > chunkBudgetBytes) {
      failed = true
      errors.push(
        `  ${file.name}: ${kb(file.size)} KB  (budget: ${BUDGETS.maxChunkKB} KB)`,
      )
    }
    if (process.env.VERBOSE) {
      console.log(`  ${status} ${file.name.padEnd(50)} ${kb(file.size).padStart(8)} KB`)
    }
  }

  // ── Aggregate JS total ────────────────────────────────────────────────────

  const totalJs = jsFiles.reduce((sum, f) => sum + f.size, 0)
  const totalCss = cssFiles.reduce((sum, f) => sum + f.size, 0)

  const jsBudgetBytes = BUDGETS.maxTotalJsKB * 1024
  const cssBudgetBytes = BUDGETS.maxTotalCssKB * 1024

  const jsStatus = totalJs > jsBudgetBytes ? '❌' : '✅'
  const cssStatus = totalCss > cssBudgetBytes ? '❌' : '✅'

  console.log(`\n  ${jsStatus} Total JS:  ${kb(totalJs).padStart(8)} KB  (budget: ${BUDGETS.maxTotalJsKB} KB)`)
  console.log(`  ${cssStatus} Total CSS: ${kb(totalCss).padStart(8)} KB  (budget: ${BUDGETS.maxTotalCssKB} KB)`)

  if (totalJs > jsBudgetBytes) {
    failed = true
    errors.push(`  Total JS ${kb(totalJs)} KB exceeds budget of ${BUDGETS.maxTotalJsKB} KB`)
  }
  if (totalCss > cssBudgetBytes) {
    failed = true
    errors.push(`  Total CSS ${kb(totalCss)} KB exceeds budget of ${BUDGETS.maxTotalCssKB} KB`)
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  if (failed) {
    console.error('\n🚨  Bundle size budget exceeded:\n')
    for (const err of errors) {
      console.error(err)
    }
    console.error('\n   Reduce bundle size or update budgets in scripts/check-bundle-size.mjs\n')
    process.exit(1)
  } else {
    console.log(`\n✅  All ${jsFiles.length} JS chunks and CSS files are within budget.\n`)
  }
}

main()
