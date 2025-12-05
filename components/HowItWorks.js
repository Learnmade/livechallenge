'use client'

import { motion } from 'framer-motion'
import { Code, Swords, Trophy, Users } from 'lucide-react'

const steps = [
    {
        icon: Users,
        title: "Join the Lobby",
        description: "Enter the matchmaking queue and get paired with an opponent of similar skill level."
    },
    {
        icon: Code,
        title: "Code Battle",
        description: "Solve the algorithmic challenge in real-time. Use your preferred language and see your opponent's progress."
    },
    {
        icon: Trophy,
        title: "Win & Rank Up",
        description: "Submit correct solutions faster to win. Earn XP, climb the leaderboard, and unlock achievements."
    }
]

export default function HowItWorks() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Three simple steps to become a coding legend.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="relative z-10 text-center group"
                            >
                                <div className="w-24 h-24 mx-auto bg-[#111827] border border-primary-500/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                                    <Icon className="h-10 w-10 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 px-4">
                                    {step.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
