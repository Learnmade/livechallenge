/**
 * Simple in-memory cache for API responses
 * For production, consider using Redis or a dedicated caching service
 */

const cache = new Map()
const DEFAULT_TTL = 300000 // 5 minutes in milliseconds

class CacheEntry {
  constructor(value, ttl = DEFAULT_TTL) {
    this.value = value
    this.expiresAt = Date.now() + ttl
  }

  isExpired() {
    return Date.now() > this.expiresAt
  }
}

export const cacheManager = {
  /**
   * Get a value from cache
   */
  get(key) {
    const entry = cache.get(key)
    if (!entry) return null
    
    if (entry.isExpired()) {
      cache.delete(key)
      return null
    }
    
    return entry.value
  },

  /**
   * Set a value in cache with optional TTL
   */
  set(key, value, ttl = DEFAULT_TTL) {
    cache.set(key, new CacheEntry(value, ttl))
  },

  /**
   * Delete a value from cache
   */
  delete(key) {
    cache.delete(key)
  },

  /**
   * Clear all cache entries
   */
  clear() {
    cache.clear()
  },

  /**
   * Clear expired entries
   */
  cleanup() {
    for (const [key, entry] of cache.entries()) {
      if (entry.isExpired()) {
        cache.delete(key)
      }
    }
  },

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    }
  },
}

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup()
  }, 5 * 60 * 1000)
}

/**
 * Generate cache key from request parameters
 */
export function generateCacheKey(prefix, ...params) {
  return `${prefix}:${params.map(p => 
    typeof p === 'object' ? JSON.stringify(p) : String(p)
  ).join(':')}`
}

/**
 * Cache middleware for API routes
 */
export function withCache(handler, options = {}) {
  const {
    ttl = DEFAULT_TTL,
    keyGenerator,
    enabled = true,
  } = options

  return async (request, context) => {
    if (!enabled || process.env.ENABLE_CACHE === 'false') {
      return handler(request, context)
    }

    const cacheKey = keyGenerator 
      ? keyGenerator(request, context)
      : generateCacheKey(
          request.nextUrl.pathname,
          request.nextUrl.searchParams.toString()
        )

    // Try to get from cache
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      })
    }

    // Execute handler
    const response = await handler(request, context)
    
    // Cache successful responses
    if (response.ok) {
      try {
        const data = await response.clone().json()
        cacheManager.set(cacheKey, data, ttl)
      } catch (e) {
        // Not JSON, don't cache
      }
    }

    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'X-Cache': 'MISS',
      },
    })
  }
}

