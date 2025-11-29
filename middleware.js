import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  const startTime = Date.now()

  // Security headers (additional to next.config.js)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://challenge.learn-made.in',
      'http://localhost:3000',
    ]
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
    
    // Add request timing header
    const duration = Date.now() - startTime
    response.headers.set('X-Response-Time', `${duration}ms`)
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

