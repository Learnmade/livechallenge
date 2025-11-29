'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import CodeEditor from '@/components/CodeEditor'
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SubmissionReviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { language, number, submissionId } = params

  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges/${language}/${number}/submissions/${submissionId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmission(data.submission)
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
    } finally {
      setLoading(false)
    }
  }, [language, number, submissionId])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchSubmission()
  }, [user, router, fetchSubmission])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading submission...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Submission not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/challenges/${language}/${number}`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Challenge</span>
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Submission Review</h1>
              <p className="text-gray-400">
                Challenge #{submission.challengeId.challengeNumber}: {submission.challengeId.title}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              submission.status === 'passed'
                ? 'bg-green-900/30 text-green-400'
                : 'bg-red-900/30 text-red-400'
            }`}>
              {submission.status === 'passed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {submission.status === 'passed' ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Submitted By</div>
              <div className="text-white font-semibold">{submission.userId.name}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Execution Time</div>
              <div className="text-white font-semibold flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {submission.executionTime}ms
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Points Earned</div>
              <div className="text-white font-semibold flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                {submission.pointsEarned || 0} points
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Submitted Code</h2>
            </div>
            <CodeEditor
              language={submission.language}
              value={submission.code}
              onChange={() => {}} // Read-only
              theme="vs-dark"
              height="600px"
              readOnly={true}
            />
          </div>

          {/* Test Results */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Test Results</h2>
            <div className="space-y-3">
              {submission.testResults && submission.testResults.length > 0 ? (
                submission.testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.passed
                        ? 'bg-green-900/20 border-green-700/50'
                        : 'bg-red-900/20 border-red-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">
                        Test Case {result.testCaseIndex + 1}
                      </span>
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Input:</span>
                        <pre className="mt-1 text-gray-200 bg-gray-900 p-2 rounded text-xs">
                          {result.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-400">Expected:</span>
                        <pre className="mt-1 text-green-400 bg-gray-900 p-2 rounded text-xs">
                          {result.expectedOutput}
                        </pre>
                      </div>
                      {!result.passed && (
                        <div>
                          <span className="text-gray-400">Got:</span>
                          <pre className="mt-1 text-red-400 bg-gray-900 p-2 rounded text-xs">
                            {result.actualOutput || 'No output'}
                          </pre>
                        </div>
                      )}
                      {result.error && (
                        <div>
                          <span className="text-gray-400">Error:</span>
                          <pre className="mt-1 text-red-400 bg-gray-900 p-2 rounded text-xs">
                            {result.error}
                          </pre>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Execution time: {result.executionTime}ms
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No test results available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

