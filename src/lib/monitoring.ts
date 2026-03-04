/**
 * Client-side performance monitoring using the Web Performance API.
 *
 * Tracks Core Web Vitals (LCP, FCP, CLS) and API call durations.  Metrics
 * are reported to the console in development and can be forwarded to an
 * external analytics service (e.g. Vercel Analytics, Datadog) in production
 * by providing a custom `reporter` function.
 * @example
 * ```ts
 * // In a client component or layout
 * import { initPerformanceMonitor } from '@/lib/monitoring'
 *
 * initPerformanceMonitor({
 *   reporter: (metric) => fetch('/api/metrics', { method: 'POST', body: JSON.stringify(metric) }),
 * })
 * ```
 */

'use client'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Names of supported performance metrics. */
export type MetricName =
  | 'FCP'   // First Contentful Paint
  | 'LCP'   // Largest Contentful Paint
  | 'CLS'   // Cumulative Layout Shift
  | 'FID'   // First Input Delay
  | 'TTFB'  // Time to First Byte
  | 'API'   // API call duration

/** A single observed performance measurement. */
export interface PerformanceMetric {
  /** Metric name. */
  name: MetricName
  /** Measured value.  Units vary by metric (ms for time, unitless for CLS). */
  value: number
  /** ISO 8601 timestamp when the metric was observed. */
  timestamp: string
  /** Optional label (e.g. API URL or page path). */
  label?: string
}

/** Callback invoked for each observed metric. */
export type MetricReporter = (metric: PerformanceMetric) => void

/** Options accepted by {@link PerformanceMonitor}. */
export interface MonitorOptions {
  /** Called for every metric.  Defaults to console output in development. */
  reporter?: MetricReporter
  /**
   * Thresholds for warning alerts.
   * Defaults: LCP > 2500 ms, FCP > 1800 ms, CLS > 0.1, API > 1000 ms
   */
  thresholds?: Partial<Record<MetricName, number>>
}

// ─── Default thresholds (WCAG / Google recommendations) ──────────────────────

/** Google Core Web Vitals "needs improvement" thresholds. */
const DEFAULT_THRESHOLDS: Record<MetricName, number> = {
  FCP: 1800,
  LCP: 2500,
  CLS: 0.1,
  FID: 100,
  TTFB: 800,
  API: 1000,
}

// ─── PerformanceMonitor class ─────────────────────────────────────────────────

/**
 * Observes Core Web Vitals and API durations, reporting each metric via a
 * configurable reporter function.
 */
export class PerformanceMonitor {
  private readonly reporter: MetricReporter
  private readonly thresholds: Record<MetricName, number>
  private readonly observers: PerformanceObserver[] = []

  /** @param options Configuration options. */
  constructor(options: MonitorOptions = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds }
    this.reporter = options.reporter ?? this.defaultReporter.bind(this)
  }

  /** Start observing Core Web Vitals. Call once during app initialization. */
  observe(): void {
    if (typeof window === 'undefined') return
    this.observePaint()
    this.observeLCP()
    this.observeCLS()
    this.observeFID()
  }

  /** Stop all PerformanceObserver instances. */
  disconnect(): void {
    this.observers.forEach((o) => o.disconnect())
    this.observers.length = 0
  }

  /**
   * Return the current high-resolution timestamp (milliseconds).
   * @returns Start time to pass to `recordAPICall`.
   */
  startTimer(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now()
  }

  /**
   * Record the duration of a completed API call.
   * @param label     Descriptive label (e.g. URL or route name).
   * @param startTime Value returned by `startTimer` before the call.
   */
  recordAPICall(label: string, startTime: number): void {
    const value = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime
    this.report({ name: 'API', value, label })
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Emit a metric through the reporter, injecting the current timestamp.
   * @param metric
   */
  private report(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    this.reporter({ ...metric, timestamp: new Date().toISOString() })
  }

  /**
   * Default reporter: warns to console in development when threshold exceeded.
   * @param metric
   */
  private defaultReporter(metric: PerformanceMetric): void {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return
    const threshold = this.thresholds[metric.name]
    if (threshold !== undefined && metric.value > threshold) {
      console.warn(
        `[monitoring] ⚠ ${metric.name} ${metric.value.toFixed(2)} exceeds threshold ${threshold}`,
        metric.label ?? '',
      )
    }
  }

  /** Register a PerformanceObserver for the 'paint' entry type (FCP). */
  private observePaint(): void {
    if (!this.supportsObserver('paint')) return
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.report({ name: 'FCP', value: entry.startTime })
        }
      }
    })
    observer.observe({ type: 'paint', buffered: true })
    this.observers.push(observer)
  }

  /** Register a PerformanceObserver for the 'largest-contentful-paint' entry type (LCP). */
  private observeLCP(): void {
    if (!this.supportsObserver('largest-contentful-paint')) return
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      if (last) this.report({ name: 'LCP', value: last.startTime })
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    this.observers.push(observer)
  }

  /** Register a PerformanceObserver for the 'layout-shift' entry type (CLS). */
  private observeCLS(): void {
    if (!this.supportsObserver('layout-shift')) return
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const ls = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!ls.hadRecentInput) clsValue += ls.value
      }
      this.report({ name: 'CLS', value: clsValue })
    })
    observer.observe({ type: 'layout-shift', buffered: true })
    this.observers.push(observer)
  }

  /** Register a PerformanceObserver for the 'first-input' entry type (FID). */
  private observeFID(): void {
    if (!this.supportsObserver('first-input')) return
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fi = entry as PerformanceEntry & { processingStart: number }
        this.report({ name: 'FID', value: fi.processingStart - entry.startTime })
      }
    })
    observer.observe({ type: 'first-input', buffered: true })
    this.observers.push(observer)
  }

  /**
   * Check whether PerformanceObserver supports a given entry type.
   * @param type PerformanceObserver entry type string.
   * @returns true when the entry type is supported by the current browser.
   */
  private supportsObserver(type: string): boolean {
    try {
      return typeof PerformanceObserver !== 'undefined' &&
        PerformanceObserver.supportedEntryTypes?.includes(type)
    } catch {
      return false
    }
  }
}

// ─── Module-level singleton ───────────────────────────────────────────────────

let _monitor: PerformanceMonitor | null = null

/**
 * Initialize the global performance monitor.
 * Safe to call multiple times — subsequent calls are no-ops.
 * @param options Configuration options forwarded to `PerformanceMonitor`.
 * @returns The (possibly existing) singleton monitor instance.
 */
export function initPerformanceMonitor(options: MonitorOptions = {}): PerformanceMonitor {
  if (_monitor) return _monitor
  _monitor = new PerformanceMonitor(options)
  _monitor.observe()
  return _monitor
}

/**
 * Access the initialized monitor.
 * @returns The singleton `PerformanceMonitor` instance.
 * @throws {Error} When called before `initPerformanceMonitor`.
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!_monitor) throw new Error('Performance monitor not initialized. Call initPerformanceMonitor() first.')
  return _monitor
}

/**
 * Reset the singleton — disconnects active observers and removes the instance.
 * Intended for use in tests only.
 */
export function _resetMonitor(): void {
  _monitor?.disconnect()
  _monitor = null
}
