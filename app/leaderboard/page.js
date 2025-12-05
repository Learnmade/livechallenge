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
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 blur-3xl -z-10" />
          <div className="bg-[#111827]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-xl mb-6 ring-1 ring-primary-500/50">
              <Trophy className="h-10 w-10 text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Leaderboard</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Compete with developers worldwide, climb the ranks, and prove your coding mastery.
            </p>

            {userRank && (
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-gray-300">Your Rank:</span>
                <span className="text-white font-bold text-lg">#{userRank}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="uppercase text-xs font-semibold tracking-wider">Filters</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedLanguage === lang.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Time Period</label>
              <div className="flex bg-white/5 rounded-lg p-1 w-fit">
                {['all', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all capitalize ${timeFilter === period
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-400">Updating rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] rounded-xl border border-white/10">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No rankings yet</h3>
            <p className="text-gray-400 mb-6">Be the first to claim your spot!</p>
            <Link href="/challenges">
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Start Coding
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-12 items-end max-w-4xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="order-2 md:order-1 relative group">
                    <div className="absolute inset-0 bg-gray-500/20 blur-xl rounded-2xl -z-10 group-hover:bg-gray-500/30 transition-all" />
                    <div className="bg-[#1F2937] border border-gray-700/50 rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <div className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center border-4 border-[#1F2937] text-gray-300 font-bold text-lg shadow-lg">2</div>
                      </div>
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 p-1 mb-4 mt-2">
                        <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center text-xl font-bold text-gray-400">
                          {topThree[1].name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{topThree[1].name}</h3>
                      <p className="text-gray-400 text-sm font-mono mb-3">{topThree[1].totalPoints} XP</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-black/20 rounded-full py-1">
                        <Target className="h-3 w-3" />
                        <span>{topThree[1].challengesCompleted} Solved</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="order-1 md:order-2 relative z-10 group">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                      <Crown className="h-10 w-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    </div>
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-2xl -z-10 group-hover:bg-yellow-500/30 transition-all" />
                    <div className="bg-gradient-to-b from-[#1F2937] to-[#111827] border border-yellow-500/30 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-[#1F2937] text-[#111827] font-bold text-xl shadow-lg shadow-yellow-500/20">1</div>
                      </div>
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-[2px] mb-4 mt-4 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center text-3xl font-bold text-yellow-500">
                          {topThree[0].name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{topThree[0].name}</h3>
                      <div className="inline-block bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold mb-4 border border-yellow-500/20">
                        {topThree[0].totalPoints} XP
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-gray-400 mb-1">Solved</div>
                          <div className="text-white font-bold">{topThree[0].challengesCompleted}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-gray-400 mb-1">Win Rate</div>
                          <div className="text-white font-bold">{Math.round((topThree[0].challengesCompleted / (topThree[0].totalSubmissions || 1)) * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="order-3 relative group">
                    <div className="absolute inset-0 bg-amber-700/20 blur-xl rounded-2xl -z-10 group-hover:bg-amber-700/30 transition-all" />
                    <div className="bg-[#1F2937] border border-amber-900/50 rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <div className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center border-4 border-[#1F2937] text-amber-500 font-bold text-lg shadow-lg">3</div>
                      </div>
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-700 to-amber-900 p-1 mb-4 mt-2">
                        <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center text-xl font-bold text-amber-600">
                          {topThree[2].name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{topThree[2].name}</h3>
                      <p className="text-gray-400 text-sm font-mono mb-3">{topThree[2].totalPoints} XP</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-black/20 rounded-full py-1">
                        <Target className="h-3 w-3" />
                        <span>{topThree[2].challengesCompleted} Solved</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <div className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-200">All Contestants</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Rankings</span>
                </div>
                <div className="divide-y divide-white/5">
                  {rest.map((entry, index) => {
                    const rank = index + 4
                    const isCurrentUser = entry.userId === user?.id
                    return (
                      <div
                        key={entry.userId}
                        className={`p-4 hover:bg-white/5 transition-colors ${isCurrentUser ? 'bg-primary-900/20 border-l-2 border-primary-500' : ''
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 flex items-center justify-center text-gray-500 font-mono font-bold">
                            #{rank}
                          </div>

                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold ring-2 ring-white/10">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex-1">
                            <h3 className={`font-semibold ${isCurrentUser ? 'text-primary-400' : 'text-gray-200'}`}>
                              {entry.name}
                              {isCurrentUser && <span className="ml-2 text-[10px] bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded border border-primary-500/30">YOU</span>}
                            </h3>
                            <p className="text-xs text-gray-500">Level {entry.level || 1} • {entry.challengesCompleted} Solved</p>
                          </div>

                          <div className="text-right">
                            <div className="text-white font-bold font-mono">{entry.totalPoints}</div>
                            <div className="text-xs text-gray-500">XP</div>
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

