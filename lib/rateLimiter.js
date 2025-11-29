/**
 * Rate limiting utility
 * Uses in-memory storage for simplicity
 * For production at scale, consider using Redis
 */

const rateLimitStore = new Map()

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000 // 1 minute default
    this.maxRequests = options.maxRequests || 100
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false
    this.skipFailedRequests = options.skipFailedRequests || false
  }

  /**
   * Get client identifier from request
   */
  getClientId(request) {
    // Try to get user ID from auth token first
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      // Extract user ID from token if possible
      // For now, fall back to IP
    }
    
    // Fall back to IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    return ip
  }

  /**
   * Check if request should be rate limited
   */
  async checkLimit(request) {
    const clientId = this.getClientId(request)
    const key = `${clientId}:${Date.now() - (Date.now() % this.windowMs)}`
    
    const current = rateLimitStore.get(key) || 0
    
    if (current >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + this.windowMs,
      }
    }
    
    rateLimitStore.set(key, current + 1)
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      this.cleanup()
    }
    
    return {
      allowed: true,
      remaining: this.maxRequests - current - 1,
      resetTime: Date.now() + this.windowMs,
    }
  }

  /**
   * Cleanup old entries
   */
  cleanup() {
    const now = Date.now()
    const cutoff = now - this.windowMs * 2
    
    for (const [key] of rateLimitStore.entries()) {
      const timestamp = parseInt(key.split(':')[1])
      if (timestamp < cutoff) {
        rateLimitStore.delete(key)
      }
    }
  }
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(options) {
  const limiter = new RateLimiter(options)
  
  return async (request) => {
    const result = await limiter.checkLimit(request)
    
    if (!result.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(options.maxRequests || 100),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }
    
    return null // Continue to next handler
  }
}

/**
 * Default rate limiters
 */
export const defaultRateLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

export const strictRateLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})

export const authRateLimiter = createRateLimiter({
  windowMs: 900000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
})

