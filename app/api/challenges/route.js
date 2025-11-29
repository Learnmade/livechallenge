import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'javascript'

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
          userId: user.id,
          status: 'passed',
        })

        const challengeObj = challenge.toObject()
        challengeObj.id = challengeObj._id.toString()
        delete challengeObj._id

        return {
          ...challengeObj,
          userStatus: submission ? 'completed' : 
                     await ChallengeSubmission.exists({ challengeId: challenge._id, userId: user.id }) ? 'attempted' : 'not-started',
        }
      })
    )

    // Get stats
    const stats = {
      totalChallenges: challenges.length,
      completed: await ChallengeSubmission.countDocuments({
        userId: user.id,
        status: 'passed',
        challengeId: { $in: challenges.map(c => c._id) },
      }),
      participants: await ChallengeSubmission.distinct('userId', {
        challengeId: { $in: challenges.map(c => c._id) },
      }).then(ids => ids.length),
      points: await ChallengeSubmission.aggregate([
        {
          $match: {
            userId: new (await import('mongoose')).default.Types.ObjectId(user.id),
            status: 'passed',
            challengeId: { $in: challenges.map(c => c._id) },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$pointsEarned' },
          },
        },
      ]).then(result => result[0]?.total || 0),
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

