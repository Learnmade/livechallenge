'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Trophy, Zap, Award, TrendingUp, Target, Code } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

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

  const progressToNextLevel = (user.xp % 500) / 500 * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-blue-100 text-base sm:text-lg">Ready to tackle some coding challenges today?</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-yellow-500 rounded-lg p-2 sm:p-3">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{user.xp}</span>
            </div>
            <p className="text-gray-700 font-semibold text-sm sm:text-base">Total XP</p>
            <p className="text-xs text-gray-600 mt-1">Keep coding to earn more!</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary-600 rounded-lg p-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">Level {user.level}</span>
            </div>
            <p className="text-gray-700 font-semibold">Current Level</p>
            <div className="mt-3 bg-white rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-primary-600 to-blue-600 h-3 rounded-full transition-all shadow-sm"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {500 - (user.xp % 500)} XP to next level
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-500 rounded-lg p-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-700 font-semibold">Battles Won</p>
            <p className="text-xs text-gray-600 mt-1">Start winning challenges!</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">#--</span>
            </div>
            <p className="text-gray-700 font-semibold">Global Rank</p>
            <p className="text-xs text-gray-600 mt-1">Climb the leaderboard!</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link
            href="/challenges"
            className="group relative bg-gradient-to-r from-primary-600 via-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:scale-[1.01] sm:hover:scale-[1.02] shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <Code className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl">🚀</div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Start Challenges</h2>
              <p className="text-blue-100 text-base sm:text-lg mb-3 sm:mb-4">Solve coding challenges in multiple languages</p>
              <div className="flex items-center text-white font-semibold text-sm sm:text-base">
                <span>Explore Now</span>
                <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="group bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl border-2 border-yellow-200 p-6 sm:p-8 hover:border-yellow-400 hover:shadow-xl transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-yellow-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <div className="text-3xl sm:text-4xl">🏆</div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Leaderboard</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">See global rankings and compete with others</p>
            <div className="flex items-center text-yellow-700 font-semibold text-sm sm:text-base">
              <span>View Rankings</span>
              <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
          <Link
            href="/history"
            className="group bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-6 sm:p-8 hover:border-primary-400 hover:shadow-xl transition-all shadow-lg sm:col-span-2"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-primary-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              </div>
              <div className="text-3xl sm:text-4xl">📊</div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Submission History</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">View your past submissions and solutions</p>
            <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base">
              <span>View History</span>
              <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <div className="bg-yellow-100 rounded-xl p-3 mr-3">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              Achievements
            </h2>
            <span className="text-sm text-gray-500 font-medium">Unlock more by solving challenges</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-100 hover:border-red-300 transition-all transform hover:scale-105">
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">First Victory</h3>
              <p className="text-sm text-gray-600 mb-3">Win your first battle</p>
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">Locked</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-100 hover:border-yellow-300 transition-all transform hover:scale-105">
              <div className="text-5xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Speed Demon</h3>
              <p className="text-sm text-gray-600 mb-3">Solve a problem in under 30 seconds</p>
              <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">Locked</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all transform hover:scale-105">
              <div className="text-5xl mb-3">🔥</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">On Fire</h3>
              <p className="text-sm text-gray-600 mb-3">Win 5 battles in a row</p>
              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">Locked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

