'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, Trophy, CheckCircle, XCircle, Code } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/')
      return
    }
    // Only fetch submissions if user is authenticated
    if (!authLoading && user) {
      fetchSubmissions()
    }
  }, [user, authLoading, router])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/challenges/submissions', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    if (status === 'passed') return <Trophy className="h-5 w-5 text-yellow-500" />
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'hard': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      go: '🐹',
      rust: '🦀',
      csharp: '💜',
      typescript: '🔷',
    }
    return icons[language] || '💻'
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

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary-500" />
              Submission History
            </h1>
            <p className="text-gray-400">Track your progress and review past solutions.</p>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400">
            Total Submissions: <span className="text-white font-bold ml-1">{submissions.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-400">Loading history...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] rounded-xl border border-white/10">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No data recorded</h3>
            <p className="text-gray-400 mb-6">Start solving challenges to build your history.</p>
            <Link href="/challenges">
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Explore Challenges
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-[#111827] border border-white/5 rounded-xl p-6 hover:border-primary-500/30 transition-all group hover:bg-[#1a2333]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${submission.status === 'passed'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {getStatusIcon(submission.status)}
                        {submission.status === 'passed' ? 'Success' : 'Failed'}
                      </div>

                      <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                      <span className="text-2xl">{getLanguageIcon(submission.language)}</span>

                      <Link
                        href={`/challenges/${submission.language}/${submission.challengeSlug || submission.challengeNumber}`}
                        className="text-lg font-semibold text-white hover:text-primary-400 transition-colors"
                      >
                        {submission.challengeTitle || `Challenge #${submission.challengeNumber}`}
                      </Link>

                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${submission.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        submission.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                        {submission.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(submission.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {submission.executionTime && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Time:</span>
                          <span className="font-mono text-gray-300">{submission.executionTime}ms</span>
                        </div>
                      )}

                      {submission.pointsEarned > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500/80">
                          <Trophy className="h-3 w-3" />
                          <span>+{submission.pointsEarned} XP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {submission.submissionId && (
                    <Link
                      href={`/challenges/${submission.language}/${submission.challengeSlug || submission.challengeNumber}/submissions/${submission.submissionId}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium border border-white/5 opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Code className="h-4 w-4" />
                      View Code
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

