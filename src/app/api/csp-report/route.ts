export async function POST(request: Request) {
  const report = await request.json()
  // Log to Axiom/Pino before enforcement — catch legitimate violations first
  console.warn('[CSP Violation]', JSON.stringify(report))
  return new Response(null, { status: 204 })
}
