'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for authenticated user on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success('Logged in successfully')
        return { success: true }
      } else {
        toast.error(data.error || 'Login failed')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (name, email, password, confirmPassword, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, confirmPassword, rememberMe }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success('Account created successfully')
        return { success: true }
      } else {
        toast.error(data.error || 'Registration failed')
        return { success: false, error: data.error, details: data.details }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration')
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
    }
  }

  const updateXP = (amount) => {
    if (!user) return
    const newXP = user.xp + amount
    const newLevel = Math.floor(newXP / 500) + 1
    const updatedUser = { ...user, xp: newXP, level: newLevel }
    setUser(updatedUser)
    // Sync with server in background
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .catch(console.error)
  }

  // Demo login for development (remove in production)
  const demoLogin = (isHost = false) => {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Demo login is disabled in production')
      return
    }
    const demoUser = {
      id: isHost ? 'host-1' : '1',
      name: isHost ? 'Host User' : 'Demo User',
      email: isHost ? 'host@example.com' : 'demo@example.com',
      xp: 1250,
      level: 5,
      isHost: isHost,
      avatar: null,
    }
    setUser(demoUser)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateXP, 
      loading,
      checkAuth,
      demoLogin, // Remove in production
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

