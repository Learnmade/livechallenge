/**
 * Performance monitoring and metrics
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      averageResponseTime: 0,
      responseTimes: [],
    }
  }

  /**
   * Track API request performance
   */
  trackRequest(duration, success = true) {
    this.metrics.requests++
    if (!success) {
      this.metrics.errors++
    }
    
    this.metrics.responseTimes.push(duration)
    
    // Keep only last 100 response times
    if (this.metrics.responseTimes.length > 100) {
      this.metrics.responseTimes.shift()
    }
    
    // Calculate average
    const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0)
    this.metrics.averageResponseTime = sum / this.metrics.responseTimes.length
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0,
    }
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {
      requests: 0,
      errors: 0,
      averageResponseTime: 0,
      responseTimes: [],
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Performance middleware for API routes
 */
export function withPerformanceTracking(handler) {
  return async (request, context) => {
    const startTime = Date.now()
    let success = true

    try {
      const response = await handler(request, context)
      success = response.ok
      return response
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - startTime
      performanceMonitor.trackRequest(duration, success)
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(`⚠️  Slow request: ${request.nextUrl.pathname} took ${duration}ms`)
      }
    }
  }
}

/**
 * Measure function execution time
 */
export async function measureTime(fn, label = 'Operation') {
  const startTime = Date.now()
  try {
    const result = await fn()
    const duration = Date.now() - startTime
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  ${label} took ${duration}ms`)
    }
    return { result, duration }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ ${label} failed after ${duration}ms:`, error)
    throw error
  }
}

