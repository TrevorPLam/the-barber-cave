import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const report = await request.json();
    
    // Log to Axiom/Pino for structured monitoring
    logger.warn({
      event: '[CSP Violation]',
      cspReport: report,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    logger.error({
      event: 'CSP report processing error',
      error: String(error),
      endpoint: '/api/csp-report',
      method: 'POST' 
    });
    
    return new Response(null, { status: 400 });
  }
}
