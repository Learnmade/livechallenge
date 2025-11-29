import { NextResponse } from 'next/server'
import { validateInput, loginSchema } from '@/lib/validation'
import { comparePassword, checkRateLimit } from '@/lib/security'
import { getUserByEmailWithPassword } from '@/lib/db'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkRateLimit(`login:${ip}`)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = validateInput(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { email, password, rememberMe = false } = validation.data

    // Get user with password
    const user = await getUserByEmailWithPassword(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token (use _id for MongoDB)
    const userId = user._id ? user._id.toString() : user.id
    const token = generateToken({ userId, email: user.email }, rememberMe)

    // Set cookie with rememberMe option
    await setAuthCookie(token, rememberMe)

    // Return user (password already excluded by select)
    // Convert _id to id for consistency
    const userResponse = { ...user }
    if (userResponse._id) {
      userResponse.id = userResponse._id.toString()
      delete userResponse._id
    }
    return NextResponse.json(
      { user: userResponse, token },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

