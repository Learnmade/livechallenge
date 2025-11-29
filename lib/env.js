/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are set in production
 */

const requiredEnvVars = {
  production: [
    'MONGODB_URI',
    'JWT_SECRET',
  ],
  development: [
    'MONGODB_URI',
  ],
}

const optionalEnvVars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://challenge.learn-made.in',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  CODE_EXECUTION_SERVICE_URL: process.env.CODE_EXECUTION_SERVICE_URL,
  ENABLE_CACHE: process.env.ENABLE_CACHE !== 'false',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
}

export function validateEnv() {
  const env = process.env.NODE_ENV || 'development'
  const required = requiredEnvVars[env] || requiredEnvVars.development
  const missing = []

  for (const varName of required) {
    if (!process.env[varName] && !optionalEnvVars[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these in your .env.local file`
    )
  }

  // Warn about weak secrets in production
  if (env === 'production') {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for production')
    }
    if (process.env.JWT_SECRET === 'dev-secret-change-in-production') {
      throw new Error('❌ JWT_SECRET must be changed from default value in production')
    }
  }

  return true
}

// Validate on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  try {
    validateEnv()
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

export const env = optionalEnvVars

