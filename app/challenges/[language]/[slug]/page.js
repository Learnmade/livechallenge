'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import CodeEditor from '@/components/CodeEditor'
import Terminal from '@/components/Terminal'
import ProblemDisplay from '@/components/ProblemDisplay'
import { ArrowLeft, Users, Clock, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function ChallengePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { language, slug: slugOrNumber } = params || {}

  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [participants, setParticipants] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  const fetchChallenge = useCallback(async () => {
    if (!language || !slugOrNumber) {
      setPageError('Invalid challenge parameters')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setPageError(null)
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data && data.challenge) {
          setChallenge(data.challenge)
          if (data.challenge?.starterCode) {
            setCode(data.challenge.starterCode || '')
          } else {
            setCode('')
          }
        } else {
          setPageError('Challenge data is invalid')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load challenge' }))
        console.error('Error fetching challenge:', errorData)
        setPageError(errorData.error || 'Failed to load challenge')
        toast.error(errorData.error || 'Failed to load challenge')
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      setPageError('Failed to load challenge due to network error')
      toast.error('Failed to load challenge due to network error')
    } finally {
      setLoading(false)
    }
  }, [language, slugOrNumber])

  const fetchParticipants = useCallback(async () => {
    if (!language || !slugOrNumber) return
    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/participants`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setParticipants(Array.isArray(data?.participants) ? data.participants : [])
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    }
  }, [language, slugOrNumber])

  const fetchLeaderboard = useCallback(async () => {
    if (!language || !slugOrNumber) return
    try {
      const response = await fetch(`/api/challenges/${language}/${slugOrNumber}/leaderboard`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(Array.isArray(data?.leaderboard) ? data.leaderboard : [])
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }, [language, slugOrNumber])

  /* New Layout State for Mobile */
  const [mobileTab, setMobileTab] = useState('problem') // 'problem' or 'code'

  // ... (existing helper functions: fetchChallenge, fetchParticipants, etc.)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!authLoading && user && language && slugOrNumber) {
      fetchChallenge()
      fetchParticipants()
      fetchLeaderboard()

      const interval = setInterval(() => {
        if (language && slugOrNumber) {
          fetchParticipants()
          fetchLeaderboard()
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [user, authLoading, router, language, slugOrNumber, fetchChallenge, fetchParticipants, fetchLeaderboard])

  // ... (existing handlers: handleRun, handleSubmit)

  // Loading States
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Initializing environment...</p>
        </div>
      </div>
    )
  }

  if (pageError || !challenge) {
    // ... (existing error UI)
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-8 text-center rounded-2xl">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Challenge</h2>
          <p className="text-gray-400 mb-6">{pageError || 'Challenge not found'}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/challenges">
              <Button variant="secondary">Back to Challenges</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#030712] text-white flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <header className="h-14 bg-[#0B1121] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/challenges" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
          <div>
            <h1 className="text-sm font-bold text-gray-200 hidden sm:block truncate max-w-[200px] lg:max-w-md">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setMobileTab('problem')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'problem' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
          >
            Problem
          </button>
          <button
            onClick={() => setMobileTab('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'code' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
          >
            Code
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="items-center gap-2 hidden md:flex bg-white/5 rounded-full px-3 py-1">
            <Clock className="h-3 w-3 text-primary-400" />
            <span className="text-xs font-mono text-gray-300">00:00:00</span>
          </div>
          <Badge variant="primary" className="hidden sm:flex items-center gap-1">
            <Users className="h-3 w-3" /> {participants.length} Online
          </Badge>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
            {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Problem Description */}
        {/* Hidden on mobile if tab is 'code', always visible on lg */}
        <div className={`
          flex-col h-full bg-[#030712] border-r border-white/5
          ${mobileTab === 'problem' ? 'flex w-full' : 'hidden'} 
          lg:flex lg:w-[40%]
        `}>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ProblemDisplay problem={challenge} />
          </div>
        </div>

        {/* Right Pane: Editor & Terminal */}
        {/* Hidden on mobile if tab is 'problem', always visible on lg */}
        <div className={`
          flex-col h-full bg-[#030712] relative
          ${mobileTab === 'code' ? 'flex w-full' : 'hidden'}
          lg:flex lg:flex-1
        `}>
          {/* Top: Editor */}
          <div className="flex-1 p-2 sm:p-4 min-h-0">
            <CodeEditor
              language={language}
              value={code}
              onChange={(val) => {
                if (val !== undefined) setCode(val)
              }}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              height="100%"
              fileName={`challenge-${challenge.slug}`}
            />
          </div>

          {/* Bottom: Terminal */}
          <div className="h-[40vh] lg:h-[35%] min-h-[200px] p-2 sm:p-4 pt-0">
            <Terminal
              output={output}
              error={error}
              submissionResult={submissionResult}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

