'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useBattle } from '@/contexts/BattleContext'
import { useRouter } from 'next/navigation'
import { Play, Square, Plus, Settings, Users, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user } = useAuth()
  const { activeBattle, setActiveBattle, socket } = useBattle()
  const router = useRouter()
  
  useEffect(() => {
    if (!user || !user.isHost) {
      router.push('/')
    }
  }, [user, router])
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [newBattle, setNewBattle] = useState({
    title: '',
    difficulty: 'easy',
    language: 'javascript',
    duration: 5,
    problem: {
      title: '',
      description: '',
      examples: [{ input: '', output: '', explanation: '' }],
      constraints: [],
      note: '',
    },
    starterCode: {
      javascript: 'function solve(input) {\n  // Your code here\n  return input;\n}',
      python: 'def solve(input):\n    # Your code here\n    return input',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
    },
  })

  // Loading state - will redirect in useEffect if not authorized
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    )
  }
  
  if (!user.isHost) {
    return null // useEffect will handle redirect
  }

  const handleStartBattle = () => {
    if (!newBattle.title || !newBattle.problem.title) {
      toast.error('Please fill in all required fields')
      return
    }

    const battle = {
      id: Date.now().toString(),
      ...newBattle,
      timeRemaining: newBattle.duration * 60,
      startTime: Date.now(),
    }

    if (socket) {
      socket.emit('battle:create', battle)
    }
    
    setActiveBattle(battle)
    toast.success('Battle started!')
    setIsCreating(false)
  }

  const handleEndBattle = () => {
    if (socket) {
      socket.emit('battle:end', { battleId: activeBattle.id })
    }
    setActiveBattle(null)
    toast.success('Battle ended')
  }

  const handleSeedChallenges = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch('/api/admin/seed-challenges', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully created ${data.totalCreated} challenges!`)
      } else {
        toast.error(data.error || 'Failed to seed challenges')
      }
    } catch (error) {
      console.error('Seed challenges error:', error)
      toast.error('Failed to seed challenges')
    } finally {
      setIsSeeding(false)
    }
  }

  const addExample = () => {
    setNewBattle({
      ...newBattle,
      problem: {
        ...newBattle.problem,
        examples: [...newBattle.problem.examples, { input: '', output: '', explanation: '' }],
      },
    })
  }

  const updateExample = (index, field, value) => {
    const examples = [...newBattle.problem.examples]
    examples[index][field] = value
    setNewBattle({
      ...newBattle,
      problem: { ...newBattle.problem, examples },
    })
  }

  const addConstraint = () => {
    setNewBattle({
      ...newBattle,
      problem: {
        ...newBattle.problem,
        constraints: [...newBattle.problem.constraints, ''],
      },
    })
  }

  const updateConstraint = (index, value) => {
    const constraints = [...newBattle.problem.constraints]
    constraints[index] = value
    setNewBattle({
      ...newBattle,
      problem: { ...newBattle.problem, constraints },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Host Control Panel</h1>
          <p className="text-gray-600">Manage coding battles and monitor participants</p>
        </div>

        {/* Seed Challenges Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Challenge Database</h2>
              <p className="text-gray-600">Seed 10 challenges for each programming language</p>
            </div>
            <button
              onClick={handleSeedChallenges}
              disabled={isSeeding}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
            >
              {isSeeding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Seeding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Seed Challenges</span>
                </>
              )}
            </button>
          </div>
        </div>

        {activeBattle ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Battle</h2>
                <p className="text-gray-700">{activeBattle.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Duration: {activeBattle.duration} minutes | Difficulty: {activeBattle.difficulty}
                </p>
              </div>
              <button
                onClick={handleEndBattle}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Square className="h-5 w-5" />
                <span>End Battle</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">No Active Battle</h2>
                <p className="text-gray-600">Start a new battle to engage your viewers</p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                <span>Create Battle</span>
              </button>
            </div>
          </div>
        )}

        {isCreating && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Create New Battle</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Battle Title
                </label>
                <input
                  type="text"
                  value={newBattle.title}
                  onChange={(e) => setNewBattle({ ...newBattle, title: e.target.value })}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Array Challenge #1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={newBattle.difficulty}
                  onChange={(e) => setNewBattle({ ...newBattle, difficulty: e.target.value })}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={newBattle.language}
                  onChange={(e) => setNewBattle({ ...newBattle, language: e.target.value })}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newBattle.duration}
                  onChange={(e) => setNewBattle({ ...newBattle, duration: parseInt(e.target.value) })}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problem Title
              </label>
              <input
                type="text"
                value={newBattle.problem.title}
                onChange={(e) => setNewBattle({
                  ...newBattle,
                  problem: { ...newBattle.problem, title: e.target.value },
                })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Two Sum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problem Description
              </label>
              <textarea
                value={newBattle.problem.description}
                onChange={(e) => setNewBattle({
                  ...newBattle,
                  problem: { ...newBattle.problem, description: e.target.value },
                })}
                rows={6}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the problem..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Examples
                </label>
                <button
                  onClick={addExample}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  + Add Example
                </button>
              </div>
              {newBattle.problem.examples.map((example, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Input</label>
                      <textarea
                        value={example.input}
                        onChange={(e) => updateExample(index, 'input', e.target.value)}
                        rows={3}
                        className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Output</label>
                      <textarea
                        value={example.output}
                        onChange={(e) => updateExample(index, 'output', e.target.value)}
                        rows={3}
                        className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Explanation (optional)</label>
                    <input
                      type="text"
                      value={example.explanation}
                      onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Constraints
                </label>
                <button
                  onClick={addConstraint}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  + Add Constraint
                </button>
              </div>
              {newBattle.problem.constraints.map((constraint, index) => (
                <input
                  key={index}
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                  placeholder="e.g., 1 <= n <= 100"
                />
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleStartBattle}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Start Battle</span>
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

