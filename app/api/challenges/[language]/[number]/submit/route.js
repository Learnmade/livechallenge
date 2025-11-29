import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeCode } from '@/lib/codeExecution'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import { updateUser } from '@/lib/db'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function POST(request, { params }) {
  try {
    const user = await requireAuth(request)
    await connectDB()

    const { language, number } = params
    const challengeNumber = parseInt(number)
    const body = await request.json()
    const { code } = body

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    // Get challenge
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

    // Check if user already solved it
    const existingSubmission = await ChallengeSubmission.findOne({
      challengeId: challenge._id,
      userId: user.id,
      status: 'passed',
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already solved this challenge' },
        { status: 400 }
      )
    }

    // Execute code against test cases
    const startTime = Date.now()
    const testResults = []
    let allPassed = true

    for (let i = 0; i < challenge.testCases.length; i++) {
      const testCase = challenge.testCases[i]
      const result = await executeCode(code, language, [{
        input: testCase.input,
        output: testCase.expectedOutput,
      }])

      const actualOutput = result.testResults?.[0]?.actual || result.output || ''
      const passed = result.passed && actualOutput.trim() === testCase.expectedOutput.trim()
      allPassed = allPassed && passed

      testResults.push({
        testCaseIndex: i,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: actualOutput,
        error: result.error || null,
        executionTime: result.executionTime || 0,
      })
    }

    const executionTime = Date.now() - startTime
    const status = allPassed ? 'passed' : 'failed'

    // Calculate points
    let pointsEarned = 0
    if (allPassed) {
      // Check if this is the first submission
      const isFirstSubmission = !await ChallengeSubmission.exists({
        challengeId: challenge._id,
        status: 'passed',
      })

      if (isFirstSubmission) {
        pointsEarned = challenge.points // Full points for first solver
      } else {
        pointsEarned = Math.floor(challenge.points * 0.8) // 80% for others
      }
    }

    // Create submission
    const submission = await ChallengeSubmission.create({
      challengeId: challenge._id,
      userId: new mongoose.Types.ObjectId(user.id),
      code,
      language,
      status,
      testResults,
      executionTime,
      pointsEarned,
      isFirstSubmission: allPassed && pointsEarned === challenge.points,
    })

    // Update challenge stats
    challenge.totalSubmissions += 1
    if (allPassed) {
      challenge.successfulSubmissions += 1
    }
    await challenge.save()

    // Update user XP
    if (allPassed) {
      await updateUser(user.id, {
        xp: (user.xp || 0) + pointsEarned,
      })
    }

    return NextResponse.json({
      status,
      testResults,
      executionTime,
      pointsEarned,
      submissionId: submission._id.toString(),
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Submit challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

