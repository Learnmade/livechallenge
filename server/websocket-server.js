// WebSocket Server Setup Guide
// This file shows how to set up a secure Socket.io server for production

/*
Install dependencies:
npm install socket.io express cors helmet

Example server setup:

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}))

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

// Authentication middleware for Socket.io
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.userId
    socket.userEmail = decoded.email
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
})

// Rate limiting per connection
const rateLimitMap = new Map()

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`)

  // Rate limiting
  const userRateLimit = rateLimitMap.get(socket.userId) || { count: 0, resetTime: Date.now() + 60000 }
  if (Date.now() > userRateLimit.resetTime) {
    userRateLimit.count = 0
    userRateLimit.resetTime = Date.now() + 60000
  }
  if (userRateLimit.count > 100) {
    socket.emit('error', { message: 'Rate limit exceeded' })
    socket.disconnect()
    return
  }
  userRateLimit.count++
  rateLimitMap.set(socket.userId, userRateLimit)

  // Join battle room
  socket.on('battle:join', (battleId) => {
    socket.join(`battle:${battleId}`)
    socket.emit('battle:joined', { battleId })
  })

  // Leave battle room
  socket.on('battle:leave', (battleId) => {
    socket.leave(`battle:${battleId}`)
  })

  // Submit solution (validate and process)
  socket.on('battle:submit', async (data) => {
    try {
      // Validate input
      if (!data.battleId || !data.code || !data.language) {
        socket.emit('submission:error', { message: 'Invalid submission data' })
        return
      }

      // Process submission (call your API)
      // This should call your secure code execution service
      const result = await processSubmission(data, socket.userId)

      // Broadcast to battle room
      io.to(`battle:${data.battleId}`).emit('submission:result', {
        userId: socket.userId,
        ...result,
      })

      // Update leaderboard
      const leaderboard = await getLeaderboard(data.battleId)
      io.to(`battle:${data.battleId}`).emit('leaderboard:update', leaderboard)
    } catch (error) {
      socket.emit('submission:error', { message: error.message })
    }
  })

  // Host: Start battle
  socket.on('battle:create', async (battleData) => {
    // Verify user is host
    const user = await getUserById(socket.userId)
    if (!user || !user.isHost) {
      socket.emit('error', { message: 'Unauthorized' })
      return
    }

    const battle = await createBattle(battleData)
    io.emit('battle:start', battle)
  })

  // Host: End battle
  socket.on('battle:end', async ({ battleId }) => {
    const user = await getUserById(socket.userId)
    if (!user || !user.isHost) {
      socket.emit('error', { message: 'Unauthorized' })
      return
    }

    await endBattle(battleId)
    io.emit('battle:end', { battleId })
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

// Helper functions (implement based on your database)
async function processSubmission(data, userId) {
  // Call code execution service
  // Update database
  // Return result
}

async function getLeaderboard(battleId) {
  // Fetch from database
}

async function createBattle(battleData) {
  // Create in database
}

async function endBattle(battleId) {
  // Update in database
}

async function getUserById(userId) {
  // Fetch from database
}
*/

