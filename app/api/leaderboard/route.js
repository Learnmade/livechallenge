import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const period = searchParams.get('period') || 'all'

    // Calculate date filter based on period
    let dateFilter = {}
    if (period === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = { submittedAt: { $gte: weekAgo } }
    } else if (period === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = { submittedAt: { $gte: monthAgo } }
    }

    // Build match filter
    const matchFilter = {
      status: 'passed',
      ...dateFilter,
    }

    if (language && language !== 'all') {
      matchFilter.language = language
    }

    // Aggregate leaderboard data
    const leaderboardData = await ChallengeSubmission.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$pointsEarned' },
          challengesCompleted: { $addToSet: '$challengeId' },
          totalSubmissions: { $sum: 1 },
          lastSubmission: { $max: '$submittedAt' },
        },
      },
      {
        $project: {
          userId: '$_id',
          totalPoints: 1,
          challengesCompleted: { $size: '$challengesCompleted' },
          totalSubmissions: 1,
          lastSubmission: 1,
        },
      },
      {
        $sort: { totalPoints: -1, lastSubmission: 1 },
      },
      {
        $limit: 100, // Top 100
      },
    ])

    // Get user details for each entry
    const userIds = leaderboardData.map(entry => entry.userId)
    const users = await User.find({ _id: { $in: userIds } })
      .select('_id name email xp level')
      .lean()

    const userMap = new Map(users.map(u => [u._id.toString(), u]))

    // Combine data
    const leaderboard = leaderboardData.map(entry => {
      const user = userMap.get(entry.userId.toString())
      return {
        userId: entry.userId.toString(),
        name: user?.name || 'Unknown',
        email: user?.email || '',
        totalPoints: entry.totalPoints || 0,
        challengesCompleted: entry.challengesCompleted || 0,
        totalSubmissions: entry.totalSubmissions || 0,
        level: user?.level || 1,
        xp: user?.xp || 0,
        lastSubmission: entry.lastSubmission,
      }
    })

    return NextResponse.json({
      leaderboard,
      total: leaderboard.length,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

