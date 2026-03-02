// Chromatic configuration for visual testing
// See: https://www.chromatic.com/docs/setup

const config = {
  // Build configuration
  buildScript: 'build-storybook',
  
  // Testing thresholds and requirements
  thresholds: {
    // Pixel difference threshold (0-1, lower is stricter)
    pixelThreshold: 0.01,
    
    // Color difference threshold (0-1, lower is stricter)
    colorThreshold: 0.01,
    
    // Maximum number of differing pixels before failure
    maxDiffPixels: 100,
    
    // Maximum percentage of differing pixels before failure
    maxDiffPercentage: 0.1,
  },
  
  // Browser and viewport configuration
  browsers: ['chrome', 'firefox', 'safari', 'edge'],
  viewports: [
    320,   // Mobile
    768,   // Tablet
    1024,  // Small desktop
    1920,  // Large desktop
  ],
  
  // Story filtering
  storiesGlob: 'src/**/*.stories.@(js|jsx|ts|tsx)',
  
  // CI/CD configuration
  exitZeroOnChanges: true,
  autoAcceptChanges: 'main',
  onlyChanged: true,
  
  // Performance settings
  concurrency: 4,
  timeout: 30000,
  
  // Debug and logging
  trace: process.env.NODE_ENV === 'development',
};

export default config;
