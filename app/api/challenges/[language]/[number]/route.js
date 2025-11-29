import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { language, number } = params
    const challengeNumber = parseInt(number)

    const challenge = await Challenge.findOne({
      language,
      challengeNumber,
      isActive: true,
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Add user to participants if not already there
    if (!challenge.participants.includes(user.id)) {
      challenge.participants.push(user.id)
      await challenge.save()
    }

    const challengeObj = challenge.toObject()
    challengeObj.id = challengeObj._id.toString()
    delete challengeObj._id
    // Don't send test cases or solution to client
    delete challengeObj.testCases
    delete challengeObj.solution

    return NextResponse.json({ challenge: challengeObj }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Get challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

