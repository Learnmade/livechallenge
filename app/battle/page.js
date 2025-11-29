'use client'

import { useState, useEffect } from 'react'
import { useBattle } from '@/contexts/BattleContext'
import { useAuth } from '@/contexts/AuthContext'
import CodeEditor from '@/components/CodeEditor'
import Leaderboard from '@/components/Leaderboard'
import ProblemDisplay from '@/components/ProblemDisplay'
import { Clock, Trophy, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function BattlePage() {
  const { activeBattle, submitSolution, leaderboard } = useBattle()
  const { user, updateXP } = useAuth()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [userSubmission, setUserSubmission] = useState(null)

  useEffect(() => {
    if (!activeBattle) {
      if (typeof window !== 'undefined') {
        router.push('/')
      }
      return
    }

    setTimeRemaining(activeBattle.timeRemaining || 600)
    setCode(activeBattle.starterCode?.[language] || '')

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeBattle, language, router])

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Mock submission result
      const isCorrect = Math.random() > 0.3 // 70% chance of being correct for demo
      const result = {
        status: isCorrect ? 'passed' : 'failed',
        message: isCorrect ? 'All test cases passed!' : 'Some test cases failed',
        time: Math.floor(Math.random() * 300) + 10,
      }

      setUserSubmission(result)

      if (isCorrect) {
        submitSolution(code, language)
        const rank = leaderboard.length + 1
        let xpEarned = 50

        if (rank === 1) xpEarned = 200
        else if (rank === 2) xpEarned = 150
        else if (rank === 3) xpEarned = 100

        updateXP(xpEarned)
        toast.success(`Correct! You earned ${xpEarned} XP`)
      } else {
        updateXP(10)
        toast.error('Incorrect solution. Try again!')
      }
    } catch (error) {
      toast.error('Error submitting solution')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!activeBattle) {
    return null
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{activeBattle.title}</h1>
              <p className="text-gray-400 text-sm">Difficulty: {activeBattle.difficulty}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-white'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>
              {userSubmission && (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  userSubmission.status === 'passed' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {userSubmission.status === 'passed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {userSubmission.status === 'passed' ? 'Passed' : 'Failed'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Problem & Editor - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ProblemDisplay problem={activeBattle.problem} />
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Code Editor</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                theme="vs-dark"
              />
              <div className="bg-gray-900/50 px-4 py-3 border-t border-gray-700">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || timeRemaining === 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard - Takes 1 column */}
          <div className="lg:col-span-1">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  )
}

