'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Trophy, Zap, Award, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
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

  const progressToNextLevel = (user.xp % 500) / 500 * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{user.xp}</span>
            </div>
            <p className="text-gray-400 text-sm">Total XP</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">Level {user.level}</span>
            </div>
            <p className="text-gray-400 text-sm">Current Level</p>
            <div className="mt-3 bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {500 - (user.xp % 500)} XP to next level
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <p className="text-gray-400 text-sm">Battles Won</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-white">#--</span>
            </div>
            <p className="text-gray-400 text-sm">Global Rank</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/battle"
            className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Join Active Battle</h2>
            <p className="text-gray-200">Participate in the current coding challenge</p>
          </Link>

          <Link
            href="/history"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-primary-500 transition-all"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Battle History</h2>
            <p className="text-gray-400">View your past battles and solutions</p>
          </Link>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-500" />
            Achievements
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-white mb-1">First Victory</h3>
              <p className="text-sm text-gray-400">Win your first battle</p>
              <div className="mt-2 text-xs text-gray-500">Locked</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-white mb-1">Speed Demon</h3>
              <p className="text-sm text-gray-400">Solve a problem in under 30 seconds</p>
              <div className="mt-2 text-xs text-gray-500">Locked</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="font-semibold text-white mb-1">On Fire</h3>
              <p className="text-sm text-gray-400">Win 5 battles in a row</p>
              <div className="mt-2 text-xs text-gray-500">Locked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

