import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    await requireAuth(request)
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

    // Get successful submissions sorted by submission time
    const submissions = await ChallengeSubmission.find({
      challengeId: challenge._id,
      status: 'passed',
    })
      .populate('userId', 'name email')
      .sort({ submittedAt: 1 }) // First to solve gets rank 1
      .limit(100)

    const leaderboard = submissions.map((sub, index) => ({
      userId: sub.userId._id.toString(),
      name: sub.userId.name,
      rank: index + 1,
      executionTime: sub.executionTime,
      pointsEarned: sub.pointsEarned,
      status: sub.status,
      submittedAt: sub.submittedAt,
      submissionId: sub._id.toString(),
    }))

    return NextResponse.json({ leaderboard }, { status: 200 })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

