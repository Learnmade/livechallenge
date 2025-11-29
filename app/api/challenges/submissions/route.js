import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get user's submissions
    const submissions = await ChallengeSubmission.find({
      userId: new mongoose.Types.ObjectId(user.id),
    })
      .populate('challengeId', 'title challengeNumber language difficulty points')
      .sort({ submittedAt: -1 })
      .limit(limit)
      .skip(skip)

    const submissionsWithDetails = submissions.map(sub => {
      const subObj = sub.toObject()
      subObj.id = subObj._id.toString()
      delete subObj._id
      
      if (subObj.challengeId) {
        subObj.challengeId.id = subObj.challengeId._id.toString()
        delete subObj.challengeId._id
      }

      return {
        id: subObj.id,
        challengeId: subObj.challengeId?.id,
        challengeTitle: subObj.challengeId?.title,
        challengeNumber: subObj.challengeId?.challengeNumber,
        language: subObj.challengeId?.language,
        difficulty: subObj.challengeId?.difficulty,
        status: subObj.status,
        executionTime: subObj.executionTime,
        pointsEarned: subObj.pointsEarned,
        submittedAt: subObj.submittedAt,
        submissionId: subObj.id,
      }
    })

    return NextResponse.json({
      submissions: submissionsWithDetails,
      total: submissionsWithDetails.length,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

