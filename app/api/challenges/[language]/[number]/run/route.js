import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeCode } from '@/lib/codeExecution'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request, { params }) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { language, number } = params
    const body = await request.json()
    const { code } = body

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    // Execute code (for testing, not submission)
    const result = await executeCode(code, language, [])

    return NextResponse.json({
      output: result.output || '',
      error: result.error || null,
      executionTime: result.executionTime || 0,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Run code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

