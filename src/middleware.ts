import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Strip CVE-2025-29927 bypass header unconditionally
  const headers = new Headers(request.headers)
  headers.delete('x-middleware-subrequest')

  // Clone request with cleaned headers
  const cleanRequest = new NextRequest(request.url, {
    headers,
    method: request.method,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
  })

  // Apply auth middleware for protected routes
  return withAuth(
    function onSuccess(req) {
      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  )(cleanRequest)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
