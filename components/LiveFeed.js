'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle, Trophy, Code } from 'lucide-react'

const MOCK_ACTIVITIES = [
    { id: 1, user: 'AlexDev', action: 'solved', challenge: 'Two Sum', time: '2s ago', xp: 50 },
    { id: 2, user: 'SarahCode', action: 'won', challenge: 'Battle #42', time: '15s ago', xp: 200 },
    { id: 3, user: 'VimMaster', action: 'joined', challenge: 'Battle Royale', time: '32s ago', xp: 0 },
    { id: 4, user: 'JuniorDev', action: 'failed', challenge: 'Reverse Linked List', time: '45s ago', xp: -10 },
]

export default function LiveFeed() {
    const [activities, setActivities] = useState(MOCK_ACTIVITIES)

    useEffect(() => {
        // Simulate live updates
        const interval = setInterval(() => {
            const actions = ['solved', 'won', 'joined']
            const challenges = ['Binary Search', 'Merge Sort', 'Tree Traversal', 'Battle Arena']
            const users = ['NinjaCoder', 'Pythonista', 'JSDev', 'Rustacean', 'GoGopher']

            const newActivity = {
                id: Date.now(),
                user: users[Math.floor(Math.random() * users.length)],
                action: actions[Math.floor(Math.random() * actions.length)],
                challenge: challenges[Math.floor(Math.random() * challenges.length)],
                time: 'Just now',
                xp: Math.floor(Math.random() * 100) + 10
            }

            setActivities(prev => [newActivity, ...prev.slice(0, 4)])
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full max-w-sm bg-surface/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Activity
                </h3>
                <span className="text-xs text-gray-500">Real-time</span>
            </div>
            <div className="p-2 space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                    {activities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className={`
                p-2 rounded-full 
                ${activity.action === 'won' ? 'bg-yellow-500/20 text-yellow-500' :
                                    activity.action === 'solved' ? 'bg-green-500/20 text-green-500' :
                                        'bg-blue-500/20 text-blue-500'}
              `}>
                                {activity.action === 'won' ? <Trophy className="h-4 w-4" /> :
                                    activity.action === 'solved' ? <CheckCircle className="h-4 w-4" /> :
                                        <Zap className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-200 truncate">
                                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-primary-400">{activity.challenge}</span>
                                </p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                            {activity.xp > 0 && (
                                <span className="text-xs font-bold text-primary-400">+{activity.xp} XP</span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
