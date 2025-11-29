'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Clock, Trophy, CheckCircle, XCircle } from 'lucide-react'

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Mock battle history data
  const battleHistory = [
    {
      id: '1',
      title: 'Array Challenge #1',
      problem: 'Two Sum',
      difficulty: 'Easy',
      status: 'won',
      rank: 1,
      time: 45,
      xp: 200,
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'String Challenge',
      problem: 'Valid Palindrome',
      difficulty: 'Medium',
      status: 'completed',
      rank: 5,
      time: 120,
      xp: 50,
      date: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      title: 'Algorithm Battle',
      problem: 'Binary Search',
      difficulty: 'Hard',
      status: 'failed',
      rank: null,
      time: null,
      xp: 10,
      date: new Date(Date.now() - 259200000),
    },
  ]

  const getStatusIcon = (status) => {
    if (status === 'won') return <Trophy className="h-5 w-5 text-yellow-500" />
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Battle History</h1>
          <p className="text-gray-400">Review your past coding battles and performance</p>
        </div>

        <div className="space-y-4">
          {battleHistory.map((battle) => (
            <div
              key={battle.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-primary-500 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(battle.status)}
                    <h2 className="text-xl font-semibold text-white">{battle.title}</h2>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      battle.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                      battle.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {battle.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{battle.problem}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    {battle.rank && (
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-white font-semibold">{getRankBadge(battle.rank)}</span>
                        <span className="text-gray-400">Rank</span>
                      </div>
                    )}
                    {battle.time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{battle.time}s</span>
                        <span className="text-gray-400">Time</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-primary-400 font-semibold">+{battle.xp} XP</span>
                    </div>
                    <div className="text-gray-500">
                      {battle.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="ml-4 text-primary-400 hover:text-primary-300 font-medium">
                  View Solution →
                </button>
              </div>
            </div>
          ))}
        </div>

        {battleHistory.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No battle history yet</p>
            <p className="text-gray-500 text-sm mt-2">Participate in battles to see your history here</p>
          </div>
        )}
      </div>
    </div>
  )
}

