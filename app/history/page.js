'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, Trophy, CheckCircle, XCircle, Code } from 'lucide-react'

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    fetchSubmissions()
  }, [user, router])

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submission History</h1>
          <p className="text-gray-600">Review your past coding challenges and performance</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No submissions yet</p>
            <p className="text-gray-500 text-sm mt-2">Start solving challenges to see your history here</p>
            <Link
              href="/challenges"
              className="mt-4 inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Go to Challenges
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(submission.status)}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getLanguageIcon(submission.language)}</span>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Challenge #{submission.challengeNumber}: {submission.challengeTitle}
                        </h2>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(submission.difficulty)}`}>
                        {submission.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm mt-4">
                      {submission.status === 'passed' && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-900 font-semibold">Solved</span>
                        </div>
                      )}
                      {submission.executionTime && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{submission.executionTime}ms</span>
                          <span className="text-gray-600">Execution Time</span>
                        </div>
                      )}
                      {submission.pointsEarned > 0 && (
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-primary-600 font-semibold">+{submission.pointsEarned} XP</span>
                        </div>
                      )}
                      <div className="text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {submission.submissionId && submission.challengeId && (
                    <Link
                      href={`/challenges/${submission.language}/${submission.challengeNumber}/submissions/${submission.submissionId}`}
                      className="ml-4 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      View Solution →
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

