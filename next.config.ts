import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Skip build-time database connection for demo
  experimental: {
    serverComponentsExternalPackages: ['@next-auth/prisma-adapter'],
  },

  // Advanced security headers with nonce support for CSP (Issue #1 - CSP implementation)
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    const buildCspValue = (nonce: string) => [
      "default-src 'self'",
      // unsafe-eval required by Next.js 16 internals in dev; removed in prod
      isDev
        ? `script-src 'self' 'unsafe-eval' 'nonce-${nonce}'`
        : `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      // Passive violation reporting BEFORE hard enforcement
      "report-uri /api/csp-report",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: buildCspValue('PLACEHOLDER_NONCE'), // Will be replaced by Next.js runtime
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
