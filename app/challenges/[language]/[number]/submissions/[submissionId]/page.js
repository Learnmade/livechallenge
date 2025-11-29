'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import CodeEditor from '@/components/CodeEditor'
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SubmissionReviewPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { language, number, submissionId } = params

  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges/${language}/${number}/submissions/${submissionId}`, {
        credentials: 'include',
      })
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
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    // Only fetch submission if user is authenticated
    if (!authLoading && user) {
      fetchSubmission()
    }
  }, [user, authLoading, router, fetchSubmission])

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
          <p className="text-gray-600 mt-4">Loading submission...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Submission not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/challenges/${language}/${number}`}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Challenge</span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Review</h1>
              <p className="text-gray-600">
                Challenge #{submission.challengeId.challengeNumber}: {submission.challengeId.title}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              submission.status === 'passed'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
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
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Submitted By</div>
              <div className="text-gray-900 font-semibold">{submission.userId.name}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Execution Time</div>
              <div className="text-gray-900 font-semibold flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {submission.executionTime}ms
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Points Earned</div>
              <div className="text-gray-900 font-semibold flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                {submission.pointsEarned || 0} points
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-primary-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Submitted Code</h2>
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
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
            <div className="space-y-3">
              {submission.testResults && submission.testResults.length > 0 ? (
                submission.testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.passed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900 font-medium">
                        Test Case {result.testCaseIndex + 1}
                      </span>
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-700">Input:</span>
                        <pre className="mt-1 text-gray-900 bg-white p-2 rounded text-xs border border-gray-200">
                          {result.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-700">Expected:</span>
                        <pre className="mt-1 text-green-700 bg-white p-2 rounded text-xs border border-gray-200">
                          {result.expectedOutput}
                        </pre>
                      </div>
                      {!result.passed && (
                        <div>
                          <span className="text-gray-700">Got:</span>
                          <pre className="mt-1 text-red-700 bg-white p-2 rounded text-xs border border-gray-200">
                            {result.actualOutput || 'No output'}
                          </pre>
                        </div>
                      )}
                      {result.error && (
                        <div>
                          <span className="text-gray-700">Error:</span>
                          <pre className="mt-1 text-red-700 bg-white p-2 rounded text-xs border border-gray-200">
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
                <div className="text-center py-8 text-gray-600">
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

