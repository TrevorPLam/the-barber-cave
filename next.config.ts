import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  // Performance budget configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Performance budget warnings for bundle sizes
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 500000, // 500KB
        maxAssetSize: 300000,      // 300KB
        assetFilter: (assetFilename: string) => {
          return !assetFilename.endsWith('.map') && 
                 !assetFilename.endsWith('.hot-update.js');
        },
      };
    }
    return config;
  },
  // Turbopack configuration for Next.js 16
  turbopack: {},
};

export default nextConfig;
