import { NextResponse } from 'next/server'
import { getActiveBattle } from '@/lib/db'

export async function GET() {
  try {
    const battle = await getActiveBattle()
    
    if (!battle) {
      return NextResponse.json(
        { battle: null },
        { status: 200 }
      )
    }

    return NextResponse.json({ battle }, { status: 200 })
  } catch (error) {
    console.error('Get active battle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

