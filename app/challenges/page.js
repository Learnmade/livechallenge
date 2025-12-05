'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Users, Trophy, Clock, CheckCircle, TrendingUp, Sparkles, Zap, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '@/components/ui/Badge'

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'from-yellow-400/20 to-yellow-600/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-400' },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-orange-400/20 to-orange-600/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  { id: 'cpp', name: 'C++', icon: '⚡', color: 'from-blue-500/20 to-indigo-600/20', border: 'border-blue-500/50', text: 'text-blue-400' },
  { id: 'go', name: 'Go', icon: '🐹', color: 'from-cyan-400/20 to-cyan-600/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
  { id: 'rust', name: 'Rust', icon: '🦀', color: 'from-orange-500/20 to-red-600/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  { id: 'csharp', name: 'C#', icon: '💜', color: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-400' },
]

export default function ChallengesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [isSeeding, setIsSeeding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true)
      const timestamp = Date.now()
      const response = await fetch(`/api/challenges?language=${selectedLanguage}&_t=${timestamp}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges || [])
        setStats(data.stats || {})
      } else {
        setChallenges([])
        setStats({})
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      setChallenges([])
      setStats({})
    } finally {
      setLoading(false)
    }
  }, [selectedLanguage])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
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

      if (response.ok || response.status === 207) {
        toast.success(`Generated ${data.totalCreated} challenges!`, { icon: '🚀' })
        setTimeout(() => fetchChallenges(), 1000)
      } else {
        toast.error(data.message || 'Failed to seed challenges')
      }
    } catch (error) {
      toast.error('Failed to seed challenges')
    } finally {
      setIsSeeding(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const filteredChallenges = challenges.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading) return null // Or a loading spinner handled globally

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] -z-10" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white"
          >
            Master Your Craft
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Select your preferred language and tackle challenges designed to push your skills to the limit. Join thousands of developers competing globally.
          </motion.p>
        </div>

        {/* Language Selector */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code className="text-primary-400" />
              <span>Languages</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {languages.map((lang, idx) => (
              <motion.button
                key={lang.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`
                  relative p-4 rounded-xl border transition-all duration-300 group
                  ${selectedLanguage === lang.id
                    ? `bg-gradient-to-br ${lang.color} ${lang.border} ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/20`
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
                `}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{lang.icon}</div>
                <div className={`font-semibold text-sm ${selectedLanguage === lang.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {lang.name}
                </div>
                {selectedLanguage === lang.id && (
                  <motion.div
                    layoutId="activeLang"
                    className="absolute inset-0 rounded-xl bg-primary-500/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Available Challenges', value: stats.totalChallenges || 0, icon: Sparkles, color: 'text-purple-400' },
            { label: 'Completed', value: stats.completed || 0, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Total Points', value: stats.points || 0, icon: Trophy, color: 'text-yellow-400' },
            { label: 'Participants', value: stats.participants || 0, icon: Users, color: 'text-blue-400' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Challenges List Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">
            {languages.find(l => l.id === selectedLanguage)?.name} Challenges
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading challenges...</p>
              </motion.div>
            ) : filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="group relative bg-[#0B1121] border border-white/10 rounded-xl p-6 transition-all hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10"
                >
                  <Link href={`/challenges/${challenge.language}/${challenge.slug || challenge.challengeNumber}`} className="flex flex-col md:flex-row gap-6">
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center border
                        ${challenge.userStatus === 'completed'
                          ? 'bg-green-500/10 border-green-500/20 text-green-500'
                          : 'bg-primary-500/10 border-primary-500/20 text-primary-500'}
                      `}>
                        {challenge.userStatus === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                          #{challenge.challengeNumber}
                        </span>
                        <h3 className="text-xl font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                          {challenge.title}
                        </h3>
                        {challenge.userStatus === 'completed' && (
                          <Badge variant="success" size="sm">Solved</Badge>
                        )}
                      </div>

                      <p className="text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-semibold uppercase text-[10px]">{challenge.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-300">{challenge.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-300">{challenge.participants?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="hidden md:flex items-center justify-center w-12 border-l border-white/5 pl-6">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
                <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Challenges Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search terms.' : 'There are no challenges available for this language yet.'}
                </p>
                {user?.isHost && !searchQuery && (
                  <button
                    onClick={handleSeedChallenges}
                    disabled={isSeeding}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSeeding ? 'Generating...' : 'Generate Challenges'}
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

