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
import Navigation from '@/components/Navigation'

export default function ChallengePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { language, slug: slugOrNumber } = params || {}

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
  const [pageError, setPageError] = useState(null)

  const fetchChallenge = useCallback(async () => {
    if (!language || !slugOrNumber) {
      setPageError('Invalid challenge parameters')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setPageError(null)
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.challenge) {
          setChallenge(data.challenge)
          if (data.challenge?.starterCode) {
            setCode(data.challenge.starterCode || '')
          } else {
            setCode('')
          }
        } else {
          setPageError('Challenge data is invalid')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load challenge' }))
        console.error('Error fetching challenge:', errorData)
        setPageError(errorData.error || 'Failed to load challenge')
        toast.error(errorData.error || 'Failed to load challenge')
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      setPageError('Failed to load challenge due to network error')
      toast.error('Failed to load challenge due to network error')
    } finally {
      setLoading(false)
    }
  }, [language, slugOrNumber])

  const fetchParticipants = useCallback(async () => {
    if (!language || !slugOrNumber) return
    
    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/participants`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setParticipants(Array.isArray(data?.participants) ? data.participants : [])
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
      // Don't crash on participant fetch errors
    }
  }, [language, slugOrNumber])

  const fetchLeaderboard = useCallback(async () => {
    if (!language || !slugOrNumber) return
    
    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/leaderboard`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(Array.isArray(data?.leaderboard) ? data.leaderboard : [])
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Don't crash on leaderboard fetch errors
    }
  }, [language, slugOrNumber])

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    // Only fetch data if user is authenticated and params are available
    if (!authLoading && user && language && slugOrNumber) {
      fetchChallenge()
      fetchParticipants()
      fetchLeaderboard()
      
      // Set up polling for live updates
      const interval = setInterval(() => {
        if (language && slugOrNumber) {
          fetchParticipants()
          fetchLeaderboard()
        }
      }, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [user, authLoading, router, language, slugOrNumber, fetchChallenge, fetchParticipants, fetchLeaderboard])

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    if (!language || !slugOrNumber) {
      toast.error('Invalid challenge parameters')
      return
    }

    setIsRunning(true)
    setOutput('')
    setError('')

    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to parse response' }))

      if (response.ok) {
        setOutput(data.output || '')
        if (data.error) {
          setError(data.error)
        }
      } else {
        setError(data.error || 'Execution failed')
      }
    } catch (error) {
      console.error('Run code error:', error)
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

    if (!language || !slugOrNumber) {
      toast.error('Invalid challenge parameters')
      return
    }

    setIsSubmitting(true)
    setSubmissionResult(null)
    setOutput('')
    setError('')

    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to parse response' }))

      if (response.ok) {
        setSubmissionResult(data)
        if (data.status === 'passed') {
          toast.success(`Congratulations! All test cases passed. You earned ${data.pointsEarned || 0} points!`)
          // Refresh challenge data and leaderboard
          if (fetchChallenge) fetchChallenge()
          if (fetchLeaderboard) fetchLeaderboard()
        } else {
          toast.error('Some test cases failed. Check the results below.')
        }
      } else {
        toast.error(data.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate params
  if (!language || !slugOrNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid challenge URL</p>
          <button
            onClick={() => router.push('/challenges')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Challenges
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (handled by useEffect, but show loading while redirecting)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Redirecting...</p>
        </div>
      </div>
    )
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

  if (pageError || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md">
            <p className="text-gray-600 mb-4">{pageError || 'Challenge not found'}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/challenges')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go to Challenges
              </button>
              <button
                onClick={() => {
                  setPageError(null)
                  fetchChallenge()
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                Challenge #{challenge?.challengeNumber || slugOrNumber}: {challenge?.title || 'Loading...'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                {challenge?.difficulty && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    challenge.difficulty === 'easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {challenge.difficulty}
                  </span>
                )}
                {challenge?.points !== undefined && (
                  <span className="text-gray-600 text-xs sm:text-sm flex items-center">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                    {challenge.points} points
                  </span>
                )}
                <span className="text-gray-600 text-xs sm:text-sm flex items-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary-600" />
                  {Array.isArray(participants) ? participants.length : 0} active
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push('/challenges')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column - Problem & Editor */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Problem Description */}
            {challenge && <ProblemDisplay problem={challenge} />}

            {/* Code Editor */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              {language && (
                <CodeEditor
                  language={language}
                  value={code || ''}
                  onChange={(value) => {
                    if (value !== undefined && value !== null) {
                      setCode(value)
                    }
                  }}
                  height="400px"
                  showThemeToggle={true}
                  fileName={`challenge-${challenge?.slug || slugOrNumber || '1'}`}
                />
              )}
              <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm text-sm sm:text-base"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isRunning}
                  className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm text-sm sm:text-base"
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
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <LiveParticipants participants={Array.isArray(participants) ? participants : []} />
            {language && slugOrNumber && (
              <ChallengeLeaderboard 
                leaderboard={Array.isArray(leaderboard) ? leaderboard : []}
                language={language}
                challengeNumber={challenge?.challengeNumber}
                challengeSlug={challenge?.slug || slugOrNumber}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

