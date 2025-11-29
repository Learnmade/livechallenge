'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useBattle } from '@/contexts/BattleContext'
import Link from 'next/link'
import { useEffect } from 'react'
import { Trophy, Zap, Users, Clock, Code, TrendingUp } from 'lucide-react'

export default function Home() {
  const { user, login } = useAuth()
  const { activeBattle, leaderboard } = useBattle()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Coding Battles</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link 
                    href="/challenges" 
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    Challenges
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/history" 
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    History
                  </Link>
                  {user.isHost && (
                    <Link 
                      href="/admin" 
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900 font-medium">{user.name}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeBattle ? (
          <div className="mb-8">
            <Link 
              href="/battle"
              className="block bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-[1.01] shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white">Battle in Progress!</h2>
                  </div>
                  <p className="text-blue-100">{activeBattle.title}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-blue-100 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {activeBattle.timeRemaining}s remaining
                    </span>
                    <span className="text-sm text-blue-100 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {leaderboard.length} participants
                    </span>
                  </div>
                </div>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  Join Battle →
                </button>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Community Coding Battles
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Compete in real-time coding challenges during live streams
            </p>
            {!user && (
              <Link
                href="/login"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Trophy className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compete & Win</h3>
            <p className="text-gray-600">
              Solve coding problems faster than others and climb the leaderboard
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Zap className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Battles</h3>
            <p className="text-gray-600">
              Fast-paced 1-10 minute challenges during live streams
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <TrendingUp className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn XP & Badges</h3>
            <p className="text-gray-600">
              Gain experience points, unlock achievements, and track your progress
            </p>
          </div>
        </div>

        {/* Leaderboard Preview */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
              Current Leaderboard
            </h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div 
                  key={entry.userId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-gray-900 font-medium">{entry.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
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

