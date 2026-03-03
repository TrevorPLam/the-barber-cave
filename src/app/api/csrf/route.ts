import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateCSRFToken } from '@/lib/security';

// Generate CSRF token for forms
export async function GET(request: NextRequest) {
  try {
    // Optional: require authentication for sensitive forms
    const session = await getServerSession(authOptions);

    const token = generateCSRFToken();

    // Store token in session/database for validation
    // For demo, we'll just return it (in production, store securely)

    return NextResponse.json({ csrfToken: token });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
