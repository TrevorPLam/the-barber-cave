module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless',
        // Use system Chrome if available
        chromePath: 'chrome',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.92 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off',
        // Performance budgets based on current metrics + 10% buffer
        'resource-summary:script:size': ['warn', { maxSize: 300000, unit: 'bytes' }],
        'resource-summary:stylesheet:size': ['warn', { maxSize: 50000, unit: 'bytes' }],
        'resource-summary:image:size': ['warn', { maxSize: 400000, unit: 'bytes' }],
        'resource-summary:font:size': ['warn', { maxSize: 100000, unit: 'bytes' }],
        'resource-summary:total:size': ['error', { maxSize: 550000, unit: 'bytes' }],
        'resource-summary:script:count': ['warn', { maxCount: 10 }],
        'resource-summary:stylesheet:count': ['warn', { maxCount: 5 }],
        'resource-summary:image:count': ['warn', { maxCount: 20 }],
        // Core Web Vitals budgets
        'metrics:first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'metrics:largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'metrics:_cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'metrics:total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
