import { cookies } from 'next/headers'
import { verifyToken, generateToken } from './security'
import { getUserById } from './db'

// Re-export generateToken for convenience
export { generateToken }

// Get authenticated user from request
export async function getAuthUser(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return null
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return null
    }

    // Convert MongoDB _id to id for consistency
    if (user._id) {
      user.id = user._id.toString()
      delete user._id
    }

    // Remove sensitive data (password already excluded by select)
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Require authentication middleware
export async function requireAuth(request) {
  const user = await getAuthUser(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

// Require host/admin role
export async function requireHost(request) {
  const user = await requireAuth(request)
  if (!user.isHost) {
    throw new Error('Forbidden: Host access required')
  }
  return user
}

// Set auth cookie
export async function setAuthCookie(token, rememberMe = false) {
  const cookieStore = await cookies()
  // If rememberMe is true, set cookie for 30 days, otherwise 7 days
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAge,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.learn-made.in' : undefined,
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

// Client-side auth helper (for API routes)
export function getAuthToken() {
  if (typeof window === 'undefined') return null
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find((c) => c.trim().startsWith('auth_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

