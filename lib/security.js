import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// JWT Token Management
export function generateToken(payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token, secret = process.env.JWT_SECRET) {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

export function generateRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  return generateToken(payload, secret, expiresIn)
}

// Password Hashing
export async function hashPassword(password) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
  return bcrypt.hash(password, rounds)
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Rate Limiting
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') / 1000,
})

const submissionLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_SUBMISSION_MAX || '10'),
  duration: 60, // 1 minute
})

export async function checkRateLimit(identifier) {
  try {
    await rateLimiter.consume(identifier)
    return { allowed: true }
  } catch (rejRes) {
    return {
      allowed: false,
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    }
  }
}

export async function checkSubmissionRateLimit(userId) {
  try {
    await submissionLimiter.consume(userId)
    return { allowed: true }
  } catch (rejRes) {
    return {
      allowed: false,
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    }
  }
}

// Input Sanitization
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function sanitizeCode(code) {
  if (typeof code !== 'string') return ''
  
  // Remove null bytes and control characters except newlines and tabs
  return code.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
}

// XSS Prevention
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// CSRF Token
export function generateCSRFToken() {
  return require('crypto').randomBytes(32).toString('hex')
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: [
      password.length < minLength && 'Password must be at least 8 characters',
      !hasUpperCase && 'Password must contain at least one uppercase letter',
      !hasLowerCase && 'Password must contain at least one lowercase letter',
      !hasNumbers && 'Password must contain at least one number',
      !hasSpecialChar && 'Password should contain at least one special character',
    ].filter(Boolean),
  }
}

