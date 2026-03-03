const formFactor = process.env.LHCI_FORM_FACTOR || 'mobile';
const isMobile = formFactor === 'mobile';

// Performance budgets: mobile-first for local businesses (more lenient)
// Mobile typically scores 5-10 points lower than desktop
const performanceThreshold = isMobile ? 0.85 : 0.92;
const lcpThreshold = isMobile ? 2500 : 2000;
const tbtThreshold = isMobile ? 350 : 200;

module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        preset: isMobile ? 'mobile' : 'desktop',
        formFactor: formFactor,
        screenEmulation: {
          mobile: isMobile,
          width: isMobile ? 390 : 1350,
          height: isMobile ? 844 : 940,
          deviceScaleFactor: isMobile ? 3 : 1,
          disabled: false,
        },
        chromeFlags: '--no-sandbox --headless',
        chromePath: process.env.CHROME_PATH || undefined,
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: performanceThreshold }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off',
        // Performance budgets from performance-budgets.json
        'resource-summary:script:size': ['warn', { maxSize: 300000, unit: 'bytes' }],
        'resource-summary:stylesheet:size': ['warn', { maxSize: 50000, unit: 'bytes' }],
        'resource-summary:image:size': ['warn', { maxSize: 400000, unit: 'bytes' }],
        'resource-summary:font:size': ['warn', { maxSize: 100000, unit: 'bytes' }],
        'resource-summary:total:size': ['error', { maxSize: 550000, unit: 'bytes' }],
        'resource-summary:script:count': ['warn', { maxCount: 10 }],
        'resource-summary:stylesheet:count': ['warn', { maxCount: 5 }],
        'resource-summary:image:count': ['warn', { maxCount: 20 }],
        // Core Web Vitals - form-factor specific
        'metrics:largest-contentful-paint': ['warn', { maxNumericValue: lcpThreshold }],
        'metrics:total-blocking-time': ['warn', { maxNumericValue: tbtThreshold }],
        'metrics:cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
