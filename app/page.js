'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useBattle } from '@/contexts/BattleContext'
import Link from 'next/link'
import { useEffect } from 'react'
import { Trophy, Zap, Users, Clock, TrendingUp } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function Home() {
  const { user, login } = useAuth()
  const { activeBattle, leaderboard } = useBattle()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeBattle ? (
          <div className="mb-6 sm:mb-8">
            <Link 
              href="/battle"
              className="block bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all transform hover:scale-[1.01] shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 animate-pulse" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Battle in Progress!</h2>
                  </div>
                  <p className="text-blue-100 text-sm sm:text-base">{activeBattle.title}</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                    <span className="text-xs sm:text-sm text-blue-100 flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {activeBattle.timeRemaining}s remaining
                    </span>
                    <span className="text-xs sm:text-sm text-blue-100 flex items-center">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {leaderboard.length} participants
                    </span>
                  </div>
                </div>
                <button className="w-full sm:w-auto bg-white text-primary-600 px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  Join Battle →
                </button>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Community Coding Battles
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
              Compete in real-time coding challenges during live streams
            </p>
            {!user && (
              <Link
                href="/login"
                className="inline-block bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all shadow-lg transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all transform hover:scale-105">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Compete & Win</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Solve coding problems faster than others and climb the leaderboard
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all transform hover:scale-105">
            <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Real-Time Battles</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Fast-paced 1-10 minute challenges during live streams
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all transform hover:scale-105 sm:col-span-2 lg:col-span-1">
            <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Earn XP & Badges</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Gain experience points, unlock achievements, and track your progress
            </p>
          </div>
        </div>

        {/* Leaderboard Preview */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-yellow-500" />
              Current Leaderboard
            </h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div 
                  key={entry.userId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2 sm:gap-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-base sm:text-lg font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-gray-900 font-medium">{entry.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
                    <span className="text-gray-600">{entry.time}s</span>
                    <span className="text-primary-600 font-semibold">+{entry.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

