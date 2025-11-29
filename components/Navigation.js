'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Code, Menu, X, Trophy, LayoutDashboard, History, Shield } from 'lucide-react'

export default function Navigation() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = user ? [
    { href: '/challenges', label: 'Challenges', icon: Code },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/history', label: 'History', icon: History },
  ] : []

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary-600 to-blue-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent hidden sm:block">
              Coding Battles
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
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all font-medium group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            {user?.isHost && (
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-blue-700 text-white hover:from-primary-700 hover:to-blue-800 transition-all font-medium shadow-sm ml-2"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-900 font-medium hidden lg:block">{user.name}</span>
              </div>
            )}
            {!user && (
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-blue-700 text-white hover:from-primary-700 hover:to-blue-800 transition-all font-medium shadow-sm ml-4"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all font-medium"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              {user?.isHost && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-blue-700 text-white font-medium"
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              {user && (
                <div className="flex items-center space-x-3 px-4 py-3 border-t border-gray-200 mt-2 pt-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              )}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-blue-700 text-white text-center font-medium mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

