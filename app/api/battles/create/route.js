import { NextResponse } from 'next/server'
import { validateInput, createBattleSchema } from '@/lib/validation'
import { requireHost } from '@/lib/auth'
import { createBattle } from '@/lib/db'

export async function POST(request) {
  try {
    // Require host authentication
    const user = await requireHost(request)

    const body = await request.json()
    
    // Validate input
    const validation = validateInput(createBattleSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const mongoose = await import('mongoose')
    
    const battleData = {
      ...validation.data,
      hostId: new mongoose.default.Types.ObjectId(user.id),
      timeRemaining: validation.data.duration * 60,
      startTime: new Date(),
      status: 'pending',
    }

    // Create battle
    const battle = await createBattle(battleData)

    return NextResponse.json({ battle }, { status: 201 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      )
    }
    console.error('Create battle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

