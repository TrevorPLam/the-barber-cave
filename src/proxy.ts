// Next.js 16 Proxy Configuration
// This file replaces middleware.ts in Next.js 16
// Currently no proxy functionality is needed, but this template is ready for future use

import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Add your proxy logic here
  // Examples: authentication, redirects, header manipulation, etc.
  
  // For now, just continue with the request
  return NextResponse.next();
}

// Optional: Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
