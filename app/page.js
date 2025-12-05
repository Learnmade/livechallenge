'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useBattle } from '@/contexts/BattleContext'
import Link from 'next/link'
import { Trophy, Zap, Users, Clock, TrendingUp, Code, ArrowRight, Star } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LiveFeed from '@/components/LiveFeed'
import HowItWorks from '@/components/HowItWorks'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const { user } = useAuth()
  const { activeBattle, leaderboard } = useBattle()

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary-500/30">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-primary-900/40 via-background to-background opacity-50 -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] animate-pulse-slow -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-600/20 rounded-full blur-[100px] animate-pulse-slow -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="primary" className="mb-6 px-4 py-1 text-sm border-primary-500/50">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    v2.0 Now Live
                  </span>
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                  Master Coding <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-gradient">
                    Real-Time Combat
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                  Compete with developers worldwide in adrenaline-fueled coding battles.
                  Rank up, earn XP, and prove your skills in the ultimate dev arena.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {!user ? (
                    <>
                      <Link href="/login">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
                          Start Battling <Zap className="ml-2 h-5 w-5 fill-current" />
                        </Button>
                      </Link>
                      <Link href="/demo">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                          Watch Demo
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/battle">
                      <Button variant="primary" size="lg" className="w-full sm:w-auto">
                        Enter Arena <Trophy className="ml-2 h-5 w-5 fill-current" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex flex-col gap-6"
            >
              <LiveFeed />

              {/* Mini Leaderboard Preview for Hero */}
              <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full -z-10" />
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" /> Top Performers
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 3).map((entry, index) => (
                    <div key={entry.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                          #{index + 1}
                        </div>
                        <span className="text-sm text-gray-200">{entry.name}</span>
                      </div>
                      <span className="text-xs font-mono text-primary-400">{entry.xp} XP</span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <p className="text-gray-500 text-sm">No active players yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Active Battle Card */}
          <AnimatePresence>
            {activeBattle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto mb-20"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-[#111827] ring-1 ring-gray-900/5 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="animate-pulse flex h-3 w-3 rounded-full bg-red-500"></span>
                          <h3 className="text-red-400 font-mono text-sm uppercase tracking-wider">Live Battle In Progress</h3>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{activeBattle.title}</h2>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {activeBattle.timeRemaining}s left</span>
                          <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {leaderboard.length} fighters</span>
                        </div>
                      </div>
                      <Link href="/battle">
                        <Button variant="primary" className="w-full md:w-auto shadow-none">
                          Join Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <HowItWorks />

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <Card className="group">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compete & Win</h3>
              <p className="text-gray-400 leading-relaxed">
                Rise through the ranks by solving complex algorithms faster than your opponents.
              </p>
            </Card>

            <Card className="group">
              <div className="h-12 w-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Sync</h3>
              <p className="text-gray-400 leading-relaxed">
                Experience zero-latency battles with our WebSocket powered synchronization engine.
              </p>
            </Card>

            <Card className="group">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
              <p className="text-gray-400 leading-relaxed">
                Detailed analytics and insights into your coding performance and improvement over time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
