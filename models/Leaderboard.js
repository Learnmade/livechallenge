import mongoose from 'mongoose'

const LeaderboardSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battle',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number, // Time in milliseconds
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['passed', 'failed'],
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
})

// Compound index for faster leaderboard queries
LeaderboardSchema.index({ battleId: 1, status: 1, time: 1 })
LeaderboardSchema.index({ battleId: 1, rank: 1 })

// Ensure one entry per user per battle
LeaderboardSchema.index({ battleId: 1, userId: 1 }, { unique: true })

export default mongoose.models.Leaderboard || mongoose.model('Leaderboard', LeaderboardSchema)

