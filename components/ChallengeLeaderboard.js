'use client'

import { Trophy, Medal, Award, CheckCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ChallengeLeaderboard({ leaderboard = [], language, challengeNumber }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-500 font-bold text-sm">#{rank}</span>
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-900/20 border-yellow-700/50'
    if (rank === 2) return 'bg-gray-700/30 border-gray-600/50'
    if (rank === 3) return 'bg-amber-900/20 border-amber-700/50'
    return 'bg-gray-800/30 border-gray-700/50'
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Leaderboard
        </h2>
      </div>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No submissions yet</p>
            <p className="text-xs text-gray-500 mt-1">Be the first to solve it!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              return (
                <div
                  key={entry.userId || index}
                  className={`p-3 rounded-lg border ${getRankColor(rank)} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{entry.name}</p>
                      </div>
                    </div>
                    {entry.status === 'passed' && (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {entry.executionTime && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{entry.executionTime}ms</span>
                      </div>
                    )}
                    {entry.pointsEarned && (
                      <div className="text-primary-400 font-semibold text-right">
                        +{entry.pointsEarned} pts
                      </div>
                    )}
                  </div>

                  {entry.submittedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </div>
                  )}

                  {entry.submissionId && language && challengeNumber && (
                    <Link
                      href={`/challenges/${language}/${challengeNumber}/submissions/${entry.submissionId}`}
                      className="mt-2 inline-flex items-center space-x-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Review Code</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

