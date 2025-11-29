// MongoDB database operations using Mongoose
import connectDB from './mongodb'
import User from '@/models/User'
import Battle from '@/models/Battle'
import Submission from '@/models/Submission'
import Leaderboard from '@/models/Leaderboard'

// Helper to convert MongoDB document to plain object with id
function toPlainObject(doc) {
  if (!doc) return null
  const obj = doc.toObject ? doc.toObject() : doc
  if (obj._id) {
    obj.id = obj._id.toString()
    delete obj._id
  }
  return obj
}

// User operations
export async function createUser(userData) {
  await connectDB()
  const user = await User.create(userData)
  return toPlainObject(user)
}

export async function getUserById(userId) {
  await connectDB()
  const user = await User.findById(userId).select('-password')
  return toPlainObject(user)
}

export async function getUserByEmail(email) {
  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase() })
  return toPlainObject(user)
}

export async function getUserByEmailWithPassword(email) {
  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  return toPlainObject(user)
}

export async function updateUser(userId, updates) {
  await connectDB()
  const user = await User.findByIdAndUpdate(
    userId,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password')
  return toPlainObject(user)
}

// Battle operations
export async function createBattle(battleData) {
  await connectDB()
  const battle = await Battle.create(battleData)
  return toPlainObject(battle)
}

export async function getBattleById(battleId) {
  await connectDB()
  const battle = await Battle.findById(battleId).populate('hostId', 'name email')
  return toPlainObject(battle)
}

export async function getActiveBattle() {
  await connectDB()
  const battle = await Battle.findOne({ status: 'active' })
    .populate('hostId', 'name email')
    .sort({ createdAt: -1 })
  return toPlainObject(battle)
}

export async function updateBattle(battleId, updates) {
  await connectDB()
  const battle = await Battle.findByIdAndUpdate(
    battleId,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
  return toPlainObject(battle)
}

export async function getAllBattles(limit = 50, skip = 0) {
  await connectDB()
  const battles = await Battle.find()
    .populate('hostId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
  return battles.map(toPlainObject)
}

// Submission operations
export async function createSubmission(submissionData) {
  await connectDB()
  const submission = await Submission.create(submissionData)
  return toPlainObject(submission)
}

export async function getSubmissionsByBattle(battleId) {
  await connectDB()
  const submissions = await Submission.find({ battleId })
    .populate('userId', 'name email')
    .sort({ 
      status: 1, // passed first
      time: 1, // then by time
      createdAt: 1 
    })
  return submissions.map(toPlainObject)
}

export async function getUserSubmissions(userId, limit = 50) {
  await connectDB()
  const submissions = await Submission.find({ userId })
    .populate('battleId', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(limit)
  return submissions.map(toPlainObject)
}

export async function getUserSubmissionForBattle(battleId, userId) {
  await connectDB()
  const submission = await Submission.findOne({ battleId, userId, status: 'passed' })
  return toPlainObject(submission)
}

// Leaderboard operations
export async function updateLeaderboard(battleId, userId, entry) {
  await connectDB()
  const leaderboardEntry = await Leaderboard.findOneAndUpdate(
    { battleId, userId },
    {
      battleId,
      userId,
      ...entry,
      updatedAt: new Date(),
    },
    { upsert: true, new: true, runValidators: true }
  )
  return toPlainObject(leaderboardEntry)
}

export async function getLeaderboard(battleId) {
  await connectDB()
  const entries = await Leaderboard.find({ 
    battleId, 
    status: 'passed' 
  })
    .populate('userId', 'name email')
    .sort({ time: 1 }) // Sort by time ascending
    .limit(100) // Top 100
  return entries.map(toPlainObject)
}

export async function getGlobalLeaderboard(limit = 100) {
  await connectDB()
  const users = await User.find()
    .select('name email xp level battlesWon')
    .sort({ xp: -1 })
    .limit(limit)
  return users.map(toPlainObject)
}

