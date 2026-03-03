import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  
  // Image optimization configuration for Next.js 16
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Configure remote image patterns (temporarily for Unsplash during migration)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    
    // Device screen density multiplier
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Enable image optimization in development
    unoptimized: false,
    
    // Minimum cache TTL in seconds
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
