import { NextResponse } from 'next/server'
import { getBattleById, updateBattle } from '@/lib/db'
import { requireAuth, requireHost } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const battle = await getBattleById(id)
    
    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ battle }, { status: 200 })
  } catch (error) {
    console.error('Get battle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await requireHost(request)
    const { id } = params
    const body = await request.json()

    const battle = await updateBattle(id, body)
    
    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ battle }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      )
    }
    console.error('Update battle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

