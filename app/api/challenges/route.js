import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { cacheManager, generateCacheKey } from '@/lib/cache'
import { withPerformanceTracking } from '@/lib/performance'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

async function getChallengesHandler(request) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'javascript'

    // Convert user.id to ObjectId
    const userId = new mongoose.Types.ObjectId(user.id)
    
    // Check cache first (cache key includes user ID for personalized data)
    const cacheKey = generateCacheKey('challenges', language, user.id)
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached, { 
        status: 200,
        headers: { 'X-Cache': 'HIT' }
      })
    }

    // Get all challenges for the language
    const challenges = await Challenge.find({ 
      language,
      isActive: true 
    })
      .sort({ challengeNumber: 1 })
      .select('-testCases -solution') // Don't send test cases or solution to client
      .lean() // Use lean() for better performance
    
    console.log(`📊 Found ${challenges.length} challenges for language: ${language}`)
    
    // Log first challenge for debugging
    if (challenges.length > 0) {
      console.log(`📝 Sample challenge:`, {
        id: challenges[0]._id?.toString(),
        title: challenges[0].title,
        slug: challenges[0].slug,
        language: challenges[0].language,
        isActive: challenges[0].isActive,
        challengeNumber: challenges[0].challengeNumber,
      })
    } else {
      console.warn(`⚠️  No challenges found for language: ${language}`)
      // Double check with a direct query
      const directCheck = await Challenge.find({ language }).limit(1).lean()
      console.log(`🔍 Direct query check: Found ${directCheck.length} challenges (without isActive filter)`)
    }
    
    // Get user's submission status for each challenge
    const challengesWithStatus = await Promise.all(
      challenges.map(async (challenge) => {
        // Since we're using .lean(), challenge is already a plain object
        // Convert _id to id and ensure slug exists
        const challengeObj = {
          ...challenge,
          id: challenge._id ? challenge._id.toString() : challenge.id,
        }
        
        // Remove _id if it exists
        if (challengeObj._id) {
          delete challengeObj._id
        }
        
        // Ensure slug exists (fallback to generated slug if missing)
        if (!challengeObj.slug || challengeObj.slug.trim() === '') {
          // Generate slug from title if missing
          const { generateSlug } = await import('@/lib/slug')
          challengeObj.slug = generateSlug(challengeObj.title) || `challenge-${challengeObj.challengeNumber}`
        }

        // Use the challenge _id for queries
        const challengeId = challenge._id || challenge.id

        const submission = await ChallengeSubmission.findOne({
          challengeId: challengeId,
          userId: userId,
          status: 'passed',
        })

        const hasAttempted = await ChallengeSubmission.exists({ 
          challengeId: challengeId, 
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

    const response = {
      challenges: challengesWithStatus,
      stats,
    }
    
    // Cache the response for 2 minutes
    cacheManager.set(cacheKey, response, 120000)
    
    return NextResponse.json(response, { 
      status: 200,
      headers: { 'X-Cache': 'MISS' }
    })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    logger.error('Get challenges error', { error: error.message, stack: error.stack })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withPerformanceTracking(getChallengesHandler)

