import { NextResponse } from 'next/server'
import { validateInput, submitSolutionSchema } from '@/lib/validation'
import { requireAuth } from '@/lib/auth'
import { checkSubmissionRateLimit } from '@/lib/security'
import { getBattleById, createSubmission, getSubmissionsByBattle, updateLeaderboard, updateUser, getUserSubmissionForBattle } from '@/lib/db'
import { executeCode } from '@/lib/codeExecution'
import mongoose from 'mongoose'

export async function POST(request) {
  try {
    // Require authentication
    const user = await requireAuth(request)

    // Rate limiting for submissions
    const rateLimit = await checkSubmissionRateLimit(user.id)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before submitting again.' },
        { status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = validateInput(submitSolutionSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { battleId, code, language } = validation.data

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(battleId)) {
      return NextResponse.json(
        { error: 'Invalid battle ID' },
        { status: 400 }
      )
    }

    // Check if battle exists and is active
    const battle = await getBattleById(battleId)
    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      )
    }

    if (battle.status !== 'active') {
      return NextResponse.json(
        { error: 'Battle is not active' },
        { status: 400 }
      )
    }

    // Check if user already submitted a correct solution
    const userSubmission = await getUserSubmissionForBattle(battleId, user.id)
    if (userSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted a correct solution' },
        { status: 400 }
      )
    }

    // Execute code (in secure sandbox)
    const startTime = Date.now()
    const executionResult = await executeCode(code, language, battle.problem?.testCases || [])
    const executionTime = Date.now() - startTime

    // Get existing passed submissions to determine rank
    const existingSubmissions = await getSubmissionsByBattle(battleId)
    const passedCount = existingSubmissions.filter(s => s.status === 'passed').length

    // Determine rank and XP
    let rank = null
    let xpEarned = 10 // Participation XP

    if (executionResult.passed) {
      rank = passedCount + 1
      if (rank === 1) xpEarned = 200
      else if (rank === 2) xpEarned = 150
      else if (rank === 3) xpEarned = 100
      else xpEarned = 50
    }

    // Create submission record
    const submission = await createSubmission({
      battleId: new mongoose.Types.ObjectId(battleId),
      userId: new mongoose.Types.ObjectId(user.id),
      code,
      language,
      status: executionResult.passed ? 'passed' : 'failed',
      time: executionTime,
      error: executionResult.error || null,
      testResults: executionResult.testResults || [],
      rank: rank,
      xpEarned: xpEarned,
    })

    // If passed, update leaderboard
    if (executionResult.passed) {
      await updateLeaderboard(
        new mongoose.Types.ObjectId(battleId),
        new mongoose.Types.ObjectId(user.id),
        {
          name: user.name,
          time: executionTime,
          xp: xpEarned,
          status: 'passed',
          rank: rank,
          submissionId: new mongoose.Types.ObjectId(submission.id),
        }
      )
    }

    // Update user XP
    const newXP = (user.xp || 0) + xpEarned
    const newLevel = Math.floor(newXP / 500) + 1
    await updateUser(user.id, { xp: newXP, level: newLevel })

    return NextResponse.json({
      submission: {
        id: submission.id,
        status: submission.status,
        time: submission.time,
        error: submission.error,
        testResults: submission.testResults,
      },
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Submit solution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

