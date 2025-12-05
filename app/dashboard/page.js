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
    <div className="min-h-screen bg-[#030712] text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-900/40 to-blue-900/40 border border-primary-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Trophy className="w-64 h-64 text-white transform rotate-12" />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-400 text-lg">Ready to push your coding skills to the next limit?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#111827] border border-white/5 p-6 rounded-xl hover:border-yellow-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{user.xp}</span>
            </div>
            <p className="text-sm text-gray-400">Total Experience</p>
          </div>

          <div className="bg-[#111827] border border-white/5 p-6 rounded-xl hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Level {user.level}</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full mb-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{500 - (user.xp % 500)} XP to level up</p>
          </div>

          <div className="bg-[#111827] border border-white/5 p-6 rounded-xl hover:border-purple-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">0</span>
            </div>
            <p className="text-sm text-gray-400">Battles Won</p>
          </div>

          <div className="bg-[#111827] border border-white/5 p-6 rounded-xl hover:border-green-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">#--</span>
            </div>
            <p className="text-sm text-gray-400">Global Rank</p>
          </div>
        </div>

        {/* Quick Actions & Achievements Grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Recent Achievements */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Recent Achievements
              </h2>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-xl p-1">
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                {[
                  { icon: '🎯', title: 'First Victory', desc: 'Win your first battle', color: 'text-red-400' },
                  { icon: '⚡', title: 'Speed Demon', desc: 'Solve in < 30s', color: 'text-yellow-400' },
                  { icon: '🔥', title: 'On Fire', desc: '5 win streak', color: 'text-orange-400' }
                ].map((item, i) => (
                  <div key={i} className="p-6 text-center hover:bg-white/[0.02] transition-colors group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform inline-block grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-gray-300 group-hover:text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                    <span className="inline-block px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                      Locked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>

            <Link
              href="/challenges"
              className="block group relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 transition-all duration-300" />
              <div className="relative p-6 flex flex-col items-start h-full">
                <div className="bg-white/20 p-3 rounded-lg mb-4 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Start Coding</h3>
                <p className="text-blue-100 text-sm mb-4">Solve a random challenge now</p>
                <div className="mt-auto flex items-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Go Now <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="block group bg-[#1F2937] hover:bg-[#2D3748] border border-white/5 p-6 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-200 mb-1">Leaderboard</h3>
                  <p className="text-sm text-gray-500">View global rankings</p>
                </div>
                <Trophy className="h-5 w-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
              </div>
            </Link>

            <Link
              href="/history"
              className="block group bg-[#1F2937] hover:bg-[#2D3748] border border-white/5 p-6 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-200 mb-1">History</h3>
                  <p className="text-sm text-gray-500">Your past submissions</p>
                </div>
                <Code className="h-5 w-5 text-gray-600 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

