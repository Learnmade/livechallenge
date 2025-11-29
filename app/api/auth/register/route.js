import { NextResponse } from 'next/server'
import { validateInput, registerSchema } from '@/lib/validation'
import { hashPassword } from '@/lib/security'
import { createUser, getUserByEmail } from '@/lib/db'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
      isHost: false,
    })

    // Generate token (use _id for MongoDB)
    const userId = user._id ? user._id.toString() : user.id
    const token = generateToken({ userId, email: user.email })

    // Set cookie
    await setAuthCookie(token)

    // Return user (password already excluded by select)
    // Convert _id to id for consistency
    const userResponse = { ...user }
    if (userResponse._id) {
      userResponse.id = userResponse._id.toString()
      delete userResponse._id
    }
    return NextResponse.json(
      { user: userResponse, token },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

