import { Code, Github, Twitter, Linkedin, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-background border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4 group">
                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                <Code className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Made</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The ultimate platform for developers to compete, learn, and grow through real-time coding battles.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/challenges" className="hover:text-primary-400 transition-colors">Challenges</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary-400 transition-colors">Leaderboard</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary-400 transition-colors">Pro Pricing</Link></li>
                            <li><Link href="/enterprise" className="hover:text-primary-400 transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/blog" className="hover:text-primary-400 transition-colors">Blog</Link></li>
                            <li><Link href="/docs" className="hover:text-primary-400 transition-colors">Documentation</Link></li>
                            <li><Link href="/guidelines" className="hover:text-primary-400 transition-colors">Community Guidelines</Link></li>
                            <li><Link href="/support" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                        <p className="text-xs text-gray-500">
                            Subscribe to our newsletter for updates.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 LearnMade. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>by Developers for Developers</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
