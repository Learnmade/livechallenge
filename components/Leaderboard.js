'use client'

import { Trophy, Medal, Award } from 'lucide-react'

export default function Leaderboard({ entries = [] }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-gray-500 font-bold">#{rank}</span>
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-900/20 border-yellow-700/50'
    if (rank === 2) return 'bg-gray-700/30 border-gray-600/50'
    if (rank === 3) return 'bg-amber-900/20 border-amber-700/50'
    return 'bg-gray-800/30 border-gray-700/50'
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden sticky top-20">
      <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Leaderboard
        </h2>
      </div>
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No submissions yet</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to solve it!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const rank = index + 1
              return (
                <div
                  key={entry.userId || index}
                  className={`p-4 rounded-lg border ${getRankColor(rank)} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{entry.name}</p>
                        <p className="text-sm text-gray-400">{entry.time}s</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-primary-400 font-bold">+{entry.xp} XP</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

