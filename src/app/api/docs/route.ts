// src/app/api/docs/route.ts
import { NextResponse } from 'next/server';
import { apiSpec } from '@/lib/api-docs';

/**
 * GET /api/docs
 *
 * Serves the OpenAPI 3.1 specification for The Barber Cave API as a JSON
 * document. Cached for 1 hour and accessible without authentication.
 */
export async function GET() {
  return NextResponse.json(apiSpec, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
