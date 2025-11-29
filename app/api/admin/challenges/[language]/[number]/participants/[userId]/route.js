import { NextResponse } from 'next/server'
import { requireHost } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

/**
 * DELETE - Remove a participant from a challenge
 */
export async function DELETE(request, { params }) {
  try {
    const admin = await requireHost(request)
    await connectDB()

    const { language, number, userId } = params
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

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId)

    // Remove user from participants array
    challenge.participants = challenge.participants.filter(
      p => !p.equals(userObjectId)
    )
    await challenge.save()

    // Optionally: Delete all submissions from this user for this challenge
    // Uncomment if you want to remove submissions as well
    // await ChallengeSubmission.deleteMany({
    //   challengeId: challenge._id,
    //   userId: userObjectId,
    // })

    return NextResponse.json({
      success: true,
      message: 'Participant removed successfully',
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Host access required')) {
      return NextResponse.json(
        { error: 'Unauthorized: Host access required' },
        { status: 403 }
      )
    }
    console.error('Remove participant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

