'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useBattle } from '@/contexts/BattleContext'
import { useRouter } from 'next/navigation'
import { Play, Square, Plus, Settings, Users, TrendingUp, Clock, X, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { activeBattle, setActiveBattle, socket } = useBattle()
  const router = useRouter()
  
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState({ language: 'javascript', number: '1' })
  const [participants, setParticipants] = useState([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [challenges, setChallenges] = useState([])
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

  // Fetch challenges for participant management
  const fetchChallenges = useCallback(async () => {
    try {
      const response = await fetch('/api/challenges?language=javascript', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges || [])
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }, [])

  // Fetch participants with timing
  const fetchParticipants = useCallback(async () => {
    if (!selectedChallenge.language || !selectedChallenge.number) return

    setLoadingParticipants(true)
    try {
      const response = await fetch(
        `/api/admin/challenges/${selectedChallenge.language}/${selectedChallenge.number}/participants`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setParticipants(data.participants || [])
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to load participants')
        setParticipants([])
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
      toast.error('Failed to load participants')
      setParticipants([])
    } finally {
      setLoadingParticipants(false)
    }
  }, [selectedChallenge])

  // Remove participant
  const handleRemoveParticipant = async (userId, userName) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this challenge?`)) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/challenges/${selectedChallenge.language}/${selectedChallenge.number}/participants/${userId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (response.ok) {
        toast.success(`Removed ${userName} from challenge`)
        fetchParticipants() // Refresh list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to remove participant')
      }
    } catch (error) {
      console.error('Error removing participant:', error)
      toast.error('Failed to remove participant')
    }
  }

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && (!user || !user.isHost)) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (showParticipants) {
      fetchChallenges()
      fetchParticipants()
    }
  }, [showParticipants, fetchChallenges, fetchParticipants])

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

  // Redirect if not authenticated or not host (handled by useEffect, but show loading while redirecting)
  if (!user || !user.isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Redirecting...</p>
        </div>
      </div>
    )
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

        {/* Participants Management Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Participants Management</h2>
              <p className="text-gray-600">View and manage participants with timing information</p>
            </div>
            <button
              onClick={() => {
                setShowParticipants(!showParticipants)
                if (!showParticipants) {
                  fetchChallenges()
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
            >
              {showParticipants ? (
                <>
                  <EyeOff className="h-5 w-5" />
                  <span>Hide Participants</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  <span>View Participants</span>
                </>
              )}
            </button>
          </div>

          {showParticipants && (
            <div className="space-y-4">
              {/* Challenge Selector */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedChallenge.language}
                    onChange={(e) => {
                      setSelectedChallenge({ ...selectedChallenge, language: e.target.value, number: '1' })
                      setParticipants([])
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="csharp">C#</option>
                    <option value="typescript">TypeScript</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedChallenge.number}
                    onChange={(e) => {
                      setSelectedChallenge({ ...selectedChallenge, number: e.target.value })
                      setParticipants([])
                    }}
                    onBlur={fetchParticipants}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchParticipants}
                    disabled={loadingParticipants}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingParticipants ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Participants List */}
              {loadingParticipants ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading participants...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No participants found for this challenge</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{participants.length}</span> participant{participants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Submissions</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Time Spent</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Best Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Active</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.map((participant) => (
                        <tr key={participant.userId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold mr-3">
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                                <div className="text-xs text-gray-500">{participant.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              participant.status === 'passed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {participant.status === 'passed' ? 'Solved' : 'Solving'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {participant.passedSubmissions}/{participant.totalSubmissions}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              {participant.timeSpentFormatted}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {participant.bestExecutionTime ? `${participant.bestExecutionTime}ms` : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {participant.lastActive}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleRemoveParticipant(participant.userId, participant.name)}
                              className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                              title="Remove participant"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          )}
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

