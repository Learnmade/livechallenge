'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import CodeEditor from '@/components/CodeEditor'
import Terminal from '@/components/Terminal'
import LiveParticipants from '@/components/LiveParticipants'
import ChallengeLeaderboard from '@/components/ChallengeLeaderboard'
import ProblemDisplay from '@/components/ProblemDisplay'
import { Play, CheckCircle, XCircle, Users, Trophy, Clock, Code as CodeIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChallengePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { language, number } = params

  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [participants, setParticipants] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchChallenge = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges/${language}/${number}`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
        if (data.challenge?.starterCode) {
          setCode(data.challenge.starterCode)
        } else {
          setCode('')
        }
      } else {
        const errorData = await response.json()
        console.error('Error fetching challenge:', errorData)
        toast.error(errorData.error || 'Failed to load challenge')
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      toast.error('Failed to load challenge due to network error')
    } finally {
      setLoading(false)
    }
  }, [language, number])

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch(`/api/challenges/${language}/${number}/participants`)
      if (response.ok) {
        const data = await response.json()
        setParticipants(data.participants || [])
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    }
  }, [language, number])

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/challenges/${language}/${number}/leaderboard`)
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }, [language, number])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChallenge()
    fetchParticipants()
    fetchLeaderboard()
    
    // Set up polling for live updates
    const interval = setInterval(() => {
      fetchParticipants()
      fetchLeaderboard()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [user, router, fetchChallenge, fetchParticipants, fetchLeaderboard])

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsRunning(true)
    setOutput('')
    setError('')

    try {
      const response = await fetch(`/api/challenges/${language}/${number}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(data.output || '')
        if (data.error) {
          setError(data.error)
        }
      } else {
        setError(data.error || 'Execution failed')
      }
    } catch (error) {
      setError('Failed to run code. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsSubmitting(true)
    setSubmissionResult(null)
    setOutput('')
    setError('')

    try {
      const response = await fetch(`/api/challenges/${language}/${number}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmissionResult(data)
        if (data.status === 'passed') {
          toast.success(`Congratulations! All test cases passed. You earned ${data.pointsEarned} points!`)
          fetchChallenge() // Refresh challenge data
          fetchLeaderboard() // Refresh leaderboard
        } else {
          toast.error('Some test cases failed. Check the results below.')
        }
      } else {
        toast.error(data.error || 'Submission failed')
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading challenge...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Challenge not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Challenge #{challenge.challengeNumber}: {challenge.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  challenge.difficulty === 'easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="text-gray-600 text-sm flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                  {challenge.points} points
                </span>
                <span className="text-gray-600 text-sm flex items-center">
                  <Users className="h-4 w-4 mr-1 text-primary-600" />
                  {participants.length} active
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push('/challenges')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              ← Back to Challenges
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Problem & Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Problem Description */}
            <ProblemDisplay problem={challenge} />

            {/* Code Editor */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              <CodeEditor
                language={language}
                value={code}
                onChange={(value) => {
                  if (value !== undefined && value !== null) {
                    setCode(value)
                  }
                }}
                height="500px"
                showThemeToggle={true}
                fileName={`challenge-${number}`}
              />
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center space-x-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isRunning}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Terminal/Output */}
            <Terminal
              output={output}
              error={error}
              submissionResult={submissionResult}
            />
          </div>

          {/* Right Column - Live Participants & Leaderboard */}
          <div className="lg:col-span-1 space-y-6">
            <LiveParticipants participants={participants} />
            <ChallengeLeaderboard 
              leaderboard={leaderboard}
              language={language}
              challengeNumber={number}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

