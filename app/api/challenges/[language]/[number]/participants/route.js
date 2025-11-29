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

    // Get recent active participants (submitted in last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const recentSubmissions = await ChallengeSubmission.find({
      challengeId: challenge._id,
      submittedAt: { $gte: thirtyMinutesAgo },
    })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })
      .limit(50)

    const participants = recentSubmissions.map(sub => ({
      userId: sub.userId._id.toString(),
      name: sub.userId.name,
      status: sub.status === 'passed' ? 'solved' : 'solving',
      lastActive: new Date(sub.submittedAt).toLocaleTimeString(),
    }))

    // Remove duplicates (keep most recent)
    const uniqueParticipants = Array.from(
      new Map(participants.map(p => [p.userId, p])).values()
    )

    return NextResponse.json({ participants: uniqueParticipants }, { status: 200 })
  } catch (error) {
    console.error('Get participants error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

