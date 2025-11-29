import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const isProduction = process.env.NODE_ENV === 'production'
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: isProduction ? 10 : 5, // Maximum number of connections in the pool
      minPoolSize: isProduction ? 2 : 1, // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
      retryWrites: true,
      retryReads: true,
      // Enable compression for better performance
      compressors: ['zlib'],
      zlibCompressionLevel: 6,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        // Set up connection event handlers
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message)
        })
        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB disconnected')
        })
        mongoose.connection.on('reconnected', () => {
          console.log('✅ MongoDB reconnected')
        })
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message)
        // Provide helpful error messages
        if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
          console.error('\n💡 Connection String Help:')
          console.error('1. Check your MONGODB_URI in .env.local')
          console.error('2. For MongoDB Atlas, ensure the connection string includes your cluster name')
          console.error('3. Format: mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database?retryWrites=true&w=majority')
          console.error('4. Make sure your IP is whitelisted in MongoDB Atlas Network Access')
          console.error('5. Verify your database user credentials are correct\n')
        }
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

