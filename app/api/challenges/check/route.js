import { NextResponse } from 'next/server'
import Challenge from '@/models/Challenge'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

// Public endpoint to check if challenges exist (for debugging)
export async function GET(request) {
  try {
    await connectDB()

    const totalChallenges = await Challenge.countDocuments({})
    const byLanguage = await Challenge.aggregate([
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
        },
      },
    ])

    return NextResponse.json({
      total: totalChallenges,
      byLanguage: byLanguage.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      message: totalChallenges === 0 
        ? 'No challenges found. Please seed challenges from /admin panel.'
        : `Found ${totalChallenges} challenges.`,
    }, { status: 200 })
  } catch (error) {
    console.error('Check challenges error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

