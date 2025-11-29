import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { battleId } = params
    const leaderboard = await getLeaderboard(battleId)
    
    return NextResponse.json({ leaderboard }, { status: 200 })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

