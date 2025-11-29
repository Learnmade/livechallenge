'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Users, Trophy, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'from-yellow-500 to-yellow-600' },
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-blue-500 to-blue-600' },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-orange-500 to-orange-600' },
  { id: 'cpp', name: 'C++', icon: '⚡', color: 'from-blue-600 to-blue-700' },
  { id: 'go', name: 'Go', icon: '🐹', color: 'from-cyan-500 to-cyan-600' },
  { id: 'rust', name: 'Rust', icon: '🦀', color: 'from-orange-600 to-orange-700' },
  { id: 'csharp', name: 'C#', icon: '💜', color: 'from-purple-500 to-purple-600' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-500 to-indigo-600' },
]

export default function ChallengesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [isSeeding, setIsSeeding] = useState(false)

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges?language=${selectedLanguage}`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges || [])
        setStats(data.stats || {})
      } else {
        const errorData = await response.json()
        console.error('Error fetching challenges:', errorData)
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedLanguage])

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    // Only fetch challenges if user is authenticated
    if (!authLoading && user) {
      fetchChallenges()
    }
  }, [user, authLoading, router, fetchChallenges])

  const handleSeedChallenges = async () => {
    if (!confirm('This will create 80 challenges (10 per language). Continue?')) {
      return
    }
    
    setIsSeeding(true)
    try {
      const response = await fetch('/api/admin/seed-challenges', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully created ${data.totalCreated} challenges!`)
        // Refresh challenges
        await fetchChallenges()
      } else {
        toast.error(data.error || 'Failed to seed challenges')
      }
    } catch (error) {
      console.error('Seed challenges error:', error)
      toast.error('Failed to seed challenges. Make sure you are logged in as admin.')
    } finally {
      setIsSeeding(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'hard': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Choose Your Challenge 🚀</h1>
            <p className="text-blue-100 text-base sm:text-lg">Select a programming language and start solving challenges</p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <span className="bg-primary-100 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </span>
            Programming Languages
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`group relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  selectedLanguage === lang.id
                    ? `bg-gradient-to-r ${lang.color} border-transparent text-white shadow-xl`
                    : 'bg-white border-gray-200 text-gray-700 hover:border-primary-400 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform">{lang.icon}</div>
                <div className="font-bold text-base sm:text-lg">{lang.name}</div>
                {selectedLanguage === lang.id && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="bg-primary-600 rounded-lg p-2 sm:p-3">
                  <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalChallenges || 0}</span>
              </div>
              <p className="text-gray-700 font-semibold text-sm sm:text-base">Total Challenges</p>
              <p className="text-xs text-gray-600 mt-1">Available to solve</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-500 rounded-lg p-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.completed || 0}</span>
              </div>
              <p className="text-gray-700 font-semibold">Completed</p>
              <p className="text-xs text-gray-600 mt-1">Great progress!</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-500 rounded-lg p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.participants || 0}</span>
              </div>
              <p className="text-gray-700 font-semibold">Participants</p>
              <p className="text-xs text-gray-600 mt-1">Join the community</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-yellow-500 rounded-lg p-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.points || 0}</span>
              </div>
              <p className="text-gray-700 font-semibold">Points Earned</p>
              <p className="text-xs text-gray-600 mt-1">Keep earning!</p>
            </div>
          </div>
        )}

        {/* Challenges List */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {languages.find(l => l.id === selectedLanguage)?.name} Challenges
          </h2>
          
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200 shadow-sm px-4">
              <Code className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 text-sm sm:text-base">No challenges available for this language yet.</p>
              <div className="space-y-2">
                {user?.isHost ? (
                  <>
                    <button
                      onClick={handleSeedChallenges}
                      disabled={isSeeding}
                      className="inline-block bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      {isSeeding ? 'Seeding Challenges...' : 'Seed All Challenges (80 total)'}
                    </button>
                    <p className="text-gray-500 text-xs mt-2">
                      This will create 10 challenges for each of 8 programming languages
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Please contact an administrator to seed challenges.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.language}/${challenge.challengeNumber}`}
                  className="group bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 hover:border-primary-400 hover:shadow-xl transition-all transform hover:scale-[1.01] sm:hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <div className="bg-primary-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
                          <span className="text-lg sm:text-xl font-bold text-primary-600">
                            #{challenge.challengeNumber}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{challenge.title}</h3>
                        <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold border-2 ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 sm:mb-5 line-clamp-2 text-sm sm:text-base md:text-lg">{challenge.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-yellow-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                          <span className="text-gray-900 font-semibold">{challenge.points} points</span>
                        </div>
                        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          <span className="text-gray-900 font-semibold">{challenge.participants?.length || 0} participants</span>
                        </div>
                        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-green-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          <span className="text-gray-900 font-semibold">{challenge.successfulSubmissions || 0} solved</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:ml-4 flex flex-row sm:flex-col items-center gap-3 sm:gap-0 w-full sm:w-auto">
                      {challenge.userStatus === 'completed' && (
                        <div className="bg-green-100 rounded-full p-2 sm:p-3">
                          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                        </div>
                      )}
                      {challenge.userStatus === 'attempted' && (
                        <div className="bg-yellow-100 rounded-full p-2 sm:p-3">
                          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                        </div>
                      )}
                      <span className="text-xs sm:text-sm text-gray-500 font-medium group-hover:text-primary-600 transition-colors">
                        {challenge.userStatus === 'completed' ? 'Solved' : challenge.userStatus === 'attempted' ? 'In Progress' : 'Start →'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

