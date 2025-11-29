'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Users, Trophy, Clock, CheckCircle, TrendingUp } from 'lucide-react'

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
  const { user } = useAuth()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChallenges()
  }, [user, router, selectedLanguage])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges?language=${selectedLanguage}`)
      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges || [])
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900/30 text-green-400 border-green-700/50'
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50'
      case 'hard': return 'bg-red-900/30 text-red-400 border-red-700/50'
      default: return 'bg-gray-900/30 text-gray-400 border-gray-700/50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">Coding Challenges</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Select Programming Language</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedLanguage === lang.id
                    ? `bg-gradient-to-r ${lang.color} border-transparent text-white shadow-lg`
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{lang.icon}</div>
                <div className="font-semibold">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Code className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-bold text-white">{stats.totalChallenges || 0}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Total Challenges</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold text-white">{stats.completed || 0}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Completed</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold text-white">{stats.participants || 0}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Participants</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{stats.points || 0}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Points Earned</p>
            </div>
          </div>
        )}

        {/* Challenges List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {languages.find(l => l.id === selectedLanguage)?.name} Challenges
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
              <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No challenges available for this language yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.language}/${challenge.challengeNumber}`}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-primary-500 transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-primary-400">
                          #{challenge.challengeNumber}
                        </span>
                        <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-300">{challenge.points} points</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-300">{challenge.participants?.length || 0} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-300">{challenge.successfulSubmissions || 0} solved</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {challenge.userStatus === 'completed' && (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      )}
                      {challenge.userStatus === 'attempted' && (
                        <Clock className="h-8 w-8 text-yellow-500" />
                      )}
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

