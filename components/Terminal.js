'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Terminal as TerminalIcon, LayoutList, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Terminal({ output, error, submissionResult }) {
  const [activeTab, setActiveTab] = useState('output')

  // Auto-switch to test results if there is a submission result
  if (submissionResult && activeTab !== 'tests') {
    setActiveTab('tests')
  }

  return (
    <div className="bg-[#030712] rounded-xl border border-white/10 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Terminal Header & Tabs */}
      <div className="flex items-center border-b border-white/10 bg-[#0B1121]">
        <button
          onClick={() => setActiveTab('output')}
          className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output'
            ? 'border-primary-500 text-white bg-primary-500/5'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
        >
          <TerminalIcon className="h-4 w-4" />
          <span>Console Output</span>
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tests'
            ? 'border-primary-500 text-white bg-primary-500/5'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
        >
          <LayoutList className="h-4 w-4" />
          <span>Test Results</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'output' && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {error ? (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2 font-bold">
                    <AlertCircle className="h-4 w-4" /> Runtime Error
                  </div>
                  <pre className="text-red-300 bg-black/20 p-2 rounded overflow-x-auto">
                    {error}
                  </pre>
                </div>
              ) : output ? (
                <div className="text-gray-300 whitespace-pre-wrap">
                  <span className="text-green-500 mr-2">➜</span>
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                  <TerminalIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p>Run your code to see output here</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {submissionResult ? (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className={`p-4 rounded-xl border ${submissionResult.status === 'passed'
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${submissionResult.status === 'passed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                          {submissionResult.status === 'passed' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${submissionResult.status === 'passed' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {submissionResult.status === 'passed' ? 'All Tests Passed' : 'Tests Failed'}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            {submissionResult.testResults.filter(t => t.passed).length} / {submissionResult.testResults.length} test cases passed
                          </p>
                        </div>
                      </div>
                      {submissionResult.pointsEarned > 0 && (
                        <div className="text-center bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                          <p className="text-yellow-500 font-bold text-lg">+{submissionResult.pointsEarned}</p>
                          <p className="text-yellow-500/70 text-xs uppercase">Points</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Individual Test Cases */}
                  <div className="space-y-3">
                    {submissionResult.testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`group border rounded-lg overflow-hidden transition-all ${result.passed
                          ? 'bg-white/5 border-white/10 hover:border-green-500/30'
                          : 'bg-red-500/5 border-red-500/20'
                          }`}
                      >
                        <div className="flex items-center justify-between p-3 bg-white/5">
                          <span className="flex items-center gap-2 text-gray-300 font-medium">
                            {result.passed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                            Test Case #{index + 1}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {result.executionTime}ms
                          </span>
                        </div>

                        {!result.passed && (
                          <div className="p-3 border-t border-white/5 bg-black/20 text-xs space-y-2 font-mono">
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                              <span className="text-gray-500">Input:</span>
                              <span className="text-gray-300 break-all">{result.input || '(Hidden)'}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                              <span className="text-gray-500">Expected:</span>
                              <span className="text-green-400 break-all">{result.expectedOutput}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                              <span className="text-gray-500">Actual:</span>
                              <span className="text-red-400 break-all">{result.actualOutput || 'Empty'}</span>
                            </div>
                            {result.error && (
                              <div className="mt-2 p-2 bg-red-900/20 rounded text-red-300">
                                {result.error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                  <LayoutList className="h-12 w-12 mb-4 opacity-20" />
                  <p>Run checks to see test results</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

