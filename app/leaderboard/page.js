'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Medal, Award, TrendingUp, Users, Zap, Target, Crown, ArrowLeft, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'

const languages = [
  { id: 'all', name: 'All Languages', icon: '🌐' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'csharp', name: 'C#', icon: '💜' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
]

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all') // all, week, month

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedLanguage !== 'all') {
        params.append('language', selectedLanguage)
      }
      if (timeFilter !== 'all') {
        params.append('period', timeFilter)
      }

      const response = await fetch(`/api/leaderboard?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      } else {
        const errorData = await response.json()
        console.error('Error fetching leaderboard:', errorData)
        toast.error(errorData.error || 'Failed to load leaderboard')
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      toast.error('Failed to load leaderboard due to network error')
    } finally {
      setLoading(false)
    }
  }, [selectedLanguage, timeFilter])

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    // Only fetch leaderboard if user is authenticated
    if (!authLoading && user) {
      fetchLeaderboard()
    }
  }, [user, authLoading, router, fetchLeaderboard])

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return null
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white'
    return 'bg-gray-100 text-gray-700'
  }

  const getUserRank = () => {
    if (!user) return null
    const rank = leaderboard.findIndex(entry => entry.userId === user.id) + 1
    return rank > 0 ? rank : null
  }

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

  const userRank = getUserRank()
  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl mb-6">
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              <Trophy className="h-10 w-10 mr-3" />
              Global Leaderboard
            </h1>
            <p className="text-blue-100 text-lg">Compete with developers worldwide and climb the ranks!</p>
            {userRank && (
              <div className="mt-4 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-blue-100 mb-1">Your Current Rank</p>
                <p className="text-3xl font-bold">#{userRank}</p>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedLanguage === lang.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.icon}</div>
                    <div className="text-xs">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="flex space-x-2">
                {['all', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                      timeFilter === period
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No rankings yet</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to solve challenges and appear on the leaderboard!</p>
            <Link
              href="/challenges"
              className="mt-4 inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Start Solving Challenges
            </Link>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-300 p-6 text-center transform hover:scale-105 transition-all shadow-lg">
                      <div className="mb-4">
                        <Medal className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <div className="bg-gray-300 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold">
                          2
                        </div>
                      </div>
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                        {topThree[1].name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{topThree[1].name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-700 font-semibold">{topThree[1].totalPoints || 0} XP</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Target className="h-4 w-4 text-primary-600" />
                          <span className="text-gray-600 text-sm">{topThree[1].challengesCompleted || 0} Solved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="order-1 md:order-2">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-400 p-6 text-center transform hover:scale-105 transition-all shadow-xl relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Crown className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="mb-4 mt-4">
                        <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold">
                          1
                        </div>
                      </div>
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 shadow-lg">
                        {topThree[0].name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{topThree[0].name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                          <span className="text-gray-900 font-bold text-lg">{topThree[0].totalPoints || 0} XP</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Target className="h-5 w-5 text-primary-600" />
                          <span className="text-gray-700 font-semibold">{topThree[0].challengesCompleted || 0} Solved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="order-3">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-300 p-6 text-center transform hover:scale-105 transition-all shadow-lg">
                      <div className="mb-4">
                        <Award className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                        <div className="bg-amber-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold">
                          3
                        </div>
                      </div>
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                        {topThree[2].name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{topThree[2].name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-700 font-semibold">{topThree[2].totalPoints || 0} XP</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Target className="h-4 w-4 text-primary-600" />
                          <span className="text-gray-600 text-sm">{topThree[2].challengesCompleted || 0} Solved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-primary-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-2 text-primary-600" />
                    All Rankings
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {rest.map((entry, index) => {
                    const rank = index + 4
                    const isCurrentUser = entry.userId === user?.id
                    return (
                      <div
                        key={entry.userId}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          isCurrentUser ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadge(rank)}`}>
                              {getRankIcon(rank) || `#${rank}`}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                                {entry.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">You</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">Level {entry.level || 1}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <div className="flex items-center space-x-1 text-gray-600 mb-1">
                                <Zap className="h-4 w-4" />
                                <span className="text-xs">XP</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">{entry.totalPoints || 0}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center space-x-1 text-gray-600 mb-1">
                                <Target className="h-4 w-4" />
                                <span className="text-xs">Solved</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">{entry.challengesCompleted || 0}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center space-x-1 text-gray-600 mb-1">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs">Win Rate</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {entry.totalSubmissions > 0
                                  ? Math.round((entry.challengesCompleted / entry.totalSubmissions) * 100)
                                  : 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

