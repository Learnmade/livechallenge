'use client'

import { CheckCircle, XCircle, AlertCircle, Terminal as TerminalIcon } from 'lucide-react'

export default function Terminal({ output, error, submissionResult }) {
  const hasContent = output || error || submissionResult

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex items-center space-x-2">
        <TerminalIcon className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-semibold text-white">Terminal</h2>
      </div>
      
      <div className="p-4 font-mono text-sm">
        {!hasContent ? (
          <div className="text-gray-500 text-center py-8">
            <TerminalIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Output will appear here</p>
            <p className="text-xs mt-1">Run your code or submit to see results</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Submission Results */}
            {submissionResult && (
              <div className={`p-4 rounded-lg border ${
                submissionResult.status === 'passed'
                  ? 'bg-green-900/20 border-green-700/50'
                  : 'bg-red-900/20 border-red-700/50'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {submissionResult.status === 'passed' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className={`font-semibold ${
                    submissionResult.status === 'passed' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {submissionResult.status === 'passed' ? 'All Test Cases Passed!' : 'Test Cases Failed'}
                  </span>
                </div>

                {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                  <div className="space-y-2">
                    {submissionResult.testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          result.passed
                            ? 'bg-green-900/10 border-green-700/30'
                            : 'bg-red-900/10 border-red-700/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 font-medium">
                            Test Case {result.testCaseIndex + 1}
                          </span>
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        {!result.passed && (
                          <div className="space-y-1 text-xs">
                            <div>
                              <span className="text-gray-400">Expected: </span>
                              <span className="text-green-400">{result.expectedOutput}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Got: </span>
                              <span className="text-red-400">{result.actualOutput || 'No output'}</span>
                            </div>
                            {result.error && (
                              <div>
                                <span className="text-gray-400">Error: </span>
                                <span className="text-red-400">{result.error}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {result.executionTime && (
                          <div className="text-xs text-gray-500 mt-1">
                            Execution time: {result.executionTime}ms
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {submissionResult.status === 'passed' && submissionResult.pointsEarned && (
                  <div className="mt-3 pt-3 border-t border-green-700/30">
                    <span className="text-green-400 font-semibold">
                      +{submissionResult.pointsEarned} points earned!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Output */}
            {output && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TerminalIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400 font-medium">Output:</span>
                </div>
                <pre className="bg-gray-900 p-3 rounded text-gray-200 whitespace-pre-wrap overflow-x-auto">
                  {output}
                </pre>
              </div>
            )}

            {/* Error */}
            {error && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-medium">Error:</span>
                </div>
                <pre className="bg-red-900/20 p-3 rounded text-red-400 whitespace-pre-wrap overflow-x-auto border border-red-700/30">
                  {error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

