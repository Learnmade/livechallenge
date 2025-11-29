'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const BattleContext = createContext()

export function BattleProvider({ children }) {
  const [activeBattle, setActiveBattle] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Initialize socket connection
    // In production, this would connect to your WebSocket server
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      console.log('Connected to battle server')
    })

    newSocket.on('battle:start', (battle) => {
      setActiveBattle(battle)
      setLeaderboard([])
    })

    newSocket.on('battle:end', () => {
      setActiveBattle(null)
    })

    newSocket.on('battle:update', (data) => {
      setActiveBattle((prev) => ({
        ...prev,
        timeRemaining: data.timeRemaining,
      }))
    })

    newSocket.on('leaderboard:update', (newLeaderboard) => {
      setLeaderboard(newLeaderboard)
    })

    newSocket.on('submission:result', (result) => {
      // Handle submission result
      console.log('Submission result:', result)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
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

