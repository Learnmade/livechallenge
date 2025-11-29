import { NextResponse } from 'next/server'
import { requireHost } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import ChallengeSubmission from '@/models/ChallengeSubmission'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

/**
 * GET - Get all participants with detailed timing information
 */
export async function GET(request, { params }) {
  try {
    const admin = await requireHost(request)
    await connectDB()

    const { language, number } = params
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

    // Get all participants with their submission history
    const submissions = await ChallengeSubmission.find({
      challengeId: challenge._id,
    })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })

    // Group by user and calculate timing
    const participantMap = new Map()

    submissions.forEach(sub => {
      const userId = sub.userId._id.toString()
      
      if (!participantMap.has(userId)) {
        participantMap.set(userId, {
          userId,
          name: sub.userId.name,
          email: sub.userId.email,
          firstSubmission: sub.submittedAt,
          lastSubmission: sub.submittedAt,
          totalSubmissions: 0,
          passedSubmissions: 0,
          totalTimeSpent: 0, // in milliseconds
          averageExecutionTime: 0,
          status: sub.status,
          bestExecutionTime: null,
          submissions: [],
        })
      }

      const participant = participantMap.get(userId)
      participant.totalSubmissions++
      participant.lastSubmission = sub.submittedAt
      if (sub.status === 'passed') {
        participant.passedSubmissions++
        participant.status = 'passed'
      }
      if (sub.executionTime) {
        participant.totalTimeSpent += sub.executionTime
        if (!participant.bestExecutionTime || sub.executionTime < participant.bestExecutionTime) {
          participant.bestExecutionTime = sub.executionTime
        }
      }
      participant.submissions.push({
        id: sub._id.toString(),
        status: sub.status,
        submittedAt: sub.submittedAt,
        executionTime: sub.executionTime,
        pointsEarned: sub.pointsEarned,
      })
    })

    // Calculate time spent (from first to last submission)
    const participants = Array.from(participantMap.values()).map(p => {
      const timeSpent = new Date(p.lastSubmission) - new Date(p.firstSubmission)
      const averageExecutionTime = p.totalSubmissions > 0 
        ? p.totalTimeSpent / p.totalSubmissions 
        : 0

      return {
        ...p,
        timeSpent: Math.round(timeSpent / 1000), // in seconds
        timeSpentFormatted: formatDuration(timeSpent),
        averageExecutionTime: Math.round(averageExecutionTime),
        firstSubmission: p.firstSubmission,
        lastSubmission: p.lastSubmission,
        lastActive: formatTimeAgo(p.lastSubmission),
      }
    })

    // Sort by last active (most recent first)
    participants.sort((a, b) => new Date(b.lastSubmission) - new Date(a.lastSubmission))

    return NextResponse.json({
      challenge: {
        id: challenge._id.toString(),
        title: challenge.title,
        language,
        challengeNumber,
      },
      participants,
      totalParticipants: participants.length,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Host access required')) {
      return NextResponse.json(
        { error: 'Unauthorized: Host access required' },
        { status: 403 }
      )
    }
    console.error('Get participants error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

function formatTimeAgo(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

