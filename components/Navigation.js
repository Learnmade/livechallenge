'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Menu, X, Trophy, LayoutDashboard, History, Shield, LogOut, User, ChevronDown } from 'lucide-react'
import Button from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const navLinks = user ? [
    { href: '/challenges', label: 'Challenges', icon: Code },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/history', label: 'History', icon: History },
  ] : []

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen])

  const handleLogout = async () => {
    await logout()
    setProfileMenuOpen(false)
    router.push('/')
  }

  return (
    <nav className="fixed w-full top-0 z-50 glass-panel border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block tracking-tight">
              Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Made</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium group relative overflow-hidden"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform text-primary-400" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {user?.isHost && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="ml-2 !text-primary-400 hover:!bg-primary-500/10">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            {user && (
              <div className="relative ml-4 pl-4 border-l border-white/10" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold shadow-inner border border-white/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-200 font-medium hidden lg:block">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 hidden lg:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-[#111827] rounded-xl shadow-2xl border border-white/10 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        <User className="h-4 w-4 text-primary-400" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!user && (
              <Link href="/login" className="ml-4">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 overflow-hidden bg-[#111827]"
            >
              <div className="py-2 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary-400" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
                {!user && (
                  <div className="p-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">Login</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

