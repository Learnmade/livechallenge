import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'javascript'

    // Convert user.id to ObjectId
    const userId = new mongoose.Types.ObjectId(user.id)

    // Get all challenges for the language
    const challenges = await Challenge.find({ 
      language,
      isActive: true 
    })
      .sort({ challengeNumber: 1 })
      .select('-testCases -solution') // Don't send test cases or solution to client

    // Get user's submission status for each challenge
    const challengesWithStatus = await Promise.all(
      challenges.map(async (challenge) => {
        const submission = await ChallengeSubmission.findOne({
          challengeId: challenge._id,
          userId: userId,
          status: 'passed',
        })

        const challengeObj = challenge.toObject()
        challengeObj.id = challengeObj._id.toString()
        delete challengeObj._id

        const hasAttempted = await ChallengeSubmission.exists({ 
          challengeId: challenge._id, 
          userId: userId 
        })

        return {
          ...challengeObj,
          userStatus: submission ? 'completed' : (hasAttempted ? 'attempted' : 'not-started'),
        }
      })
    )

    // Get stats
    const challengeIds = challenges.map(c => c._id)
    const stats = {
      totalChallenges: challenges.length,
      completed: challengeIds.length > 0 ? await ChallengeSubmission.countDocuments({
        userId: userId,
        status: 'passed',
        challengeId: { $in: challengeIds },
      }) : 0,
      participants: challengeIds.length > 0 ? await ChallengeSubmission.distinct('userId', {
        challengeId: { $in: challengeIds },
      }).then(ids => ids.length) : 0,
      points: challengeIds.length > 0 ? await ChallengeSubmission.aggregate([
        {
          $match: {
            userId: userId,
            status: 'passed',
            challengeId: { $in: challengeIds },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$pointsEarned' },
          },
        },
      ]).then(result => result[0]?.total || 0) : 0,
    }

    return NextResponse.json({
      challenges: challengesWithStatus,
      stats,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Get challenges error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

