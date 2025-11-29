import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { submissionId } = params

    const submission = await ChallengeSubmission.findById(submissionId)
      .populate('challengeId', 'title challengeNumber slug language')
      .populate('userId', 'name email')

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Only allow users to view their own submissions or admins
    if (submission.userId._id.toString() !== user.id && !user.isHost) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const submissionObj = submission.toObject()
    submissionObj.id = submissionObj._id.toString()
    delete submissionObj._id

    return NextResponse.json({ submission: submissionObj }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Get submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

