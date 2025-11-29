'use client'

import { Trophy, Medal, Award, CheckCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ChallengeLeaderboard({ leaderboard = [], language, challengeNumber, challengeSlug }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-500 font-bold text-sm">#{rank}</span>
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-gray-50 border-gray-200'
    if (rank === 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-gray-200'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-primary-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Leaderboard
        </h2>
      </div>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No submissions yet</p>
            <p className="text-xs text-gray-500 mt-1">Be the first to solve it!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              return (
                <div
                  key={entry.userId || index}
                  className={`p-3 rounded-lg border ${getRankColor(rank)} transition-all hover:shadow-md hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold truncate">{entry.name}</p>
                      </div>
                    </div>
                    {entry.status === 'passed' && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {entry.executionTime && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{entry.executionTime}ms</span>
                      </div>
                    )}
                    {entry.pointsEarned && (
                      <div className="text-primary-600 font-semibold text-right">
                        +{entry.pointsEarned} pts
                      </div>
                    )}
                  </div>

                  {entry.submittedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </div>
                  )}

                  {entry.submissionId && language && (challengeSlug || challengeNumber) && (
                    <Link
                      href={`/challenges/${language}/${challengeSlug || challengeNumber}/submissions/${entry.submissionId}`}
                      className="mt-2 inline-flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
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

