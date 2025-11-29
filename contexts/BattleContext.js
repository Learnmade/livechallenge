'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const BattleContext = createContext()

export function BattleProvider({ children }) {
  const [activeBattle, setActiveBattle] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Initialize socket connection with error handling
    // In production, this would connect to your WebSocket server
    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
      const newSocket = io(socketUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
      })

      newSocket.on('connect', () => {
        console.log('Connected to battle server')
      })

      newSocket.on('connect_error', (error) => {
        console.warn('Socket connection error (non-critical):', error.message)
        // Don't crash the app if socket fails to connect
      })

      newSocket.on('battle:start', (battle) => {
        try {
          setActiveBattle(battle)
          setLeaderboard([])
        } catch (error) {
          console.error('Error handling battle:start:', error)
        }
      })

      newSocket.on('battle:end', () => {
        try {
          setActiveBattle(null)
        } catch (error) {
          console.error('Error handling battle:end:', error)
        }
      })

      newSocket.on('battle:update', (data) => {
        try {
          setActiveBattle((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              timeRemaining: data.timeRemaining,
            }
          })
        } catch (error) {
          console.error('Error handling battle:update:', error)
        }
      })

      newSocket.on('leaderboard:update', (newLeaderboard) => {
        try {
          setLeaderboard(newLeaderboard || [])
        } catch (error) {
          console.error('Error handling leaderboard:update:', error)
        }
      })

      newSocket.on('submission:result', (result) => {
        try {
          // Handle submission result
          console.log('Submission result:', result)
        } catch (error) {
          console.error('Error handling submission:result:', error)
        }
      })

      setSocket(newSocket)

      return () => {
        if (newSocket) {
          newSocket.close()
        }
      }
    } catch (error) {
      console.error('Error initializing socket (non-critical):', error)
      // App continues to work without socket connection
    }
  }, [])

  const submitSolution = (code, language) => {
    if (!socket || !activeBattle) return

    socket.emit('battle:submit', {
      battleId: activeBattle.id,
      code,
      language,
      timestamp: Date.now(),
    })
  }

  return (
    <BattleContext.Provider value={{
      activeBattle,
      leaderboard,
      socket,
      submitSolution,
      setActiveBattle,
    }}>
      {children}
    </BattleContext.Provider>
  )
}

export function useBattle() {
  const context = useContext(BattleContext)
  if (!context) {
    throw new Error('useBattle must be used within BattleProvider')
  }
  return context
}

