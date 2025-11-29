/**
 * Health check endpoint for monitoring
 */
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { performanceMonitor } from '@/lib/performance'
import { cacheManager } from '@/lib/cache'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  }

  try {
    // Check database connection
    await connectDB()
    health.database = 'connected'
  } catch (error) {
    health.database = 'disconnected'
    health.status = 'degraded'
  }

  // Add performance metrics
  health.metrics = performanceMonitor.getMetrics()
  
  // Add cache stats
  health.cache = cacheManager.getStats()

  // Add memory usage
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage()
    health.memory = {
      rss: Math.round(memory.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024), // MB
      external: Math.round(memory.external / 1024 / 1024), // MB
    }
  }

  const statusCode = health.status === 'ok' ? 200 : 503

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

