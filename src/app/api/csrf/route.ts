import { createHmac, randomBytes } from 'crypto'
import { NextResponse } from 'next/server'

function generateHmacCsrfToken(): { token: string; signature: string } {
  const token = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(token)
    .digest('hex')
  return { token, signature: `${token}.${signature}` }
}

export function GET() {
  const { signature } = generateHmacCsrfToken()
  const response = NextResponse.json({ csrfToken: signature })
  // HttpOnly:false — must be readable by JS to include in request header
  // SameSite:Strict — prevents cross-site submission entirely
  response.cookies.set('csrf-token', signature, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1h
  })
  return response
}
