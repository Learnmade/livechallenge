import mongoose from 'mongoose'

const TestResultSchema = new mongoose.Schema({
  testCase: Number,
  passed: Boolean,
  input: String,
  expected: String,
  actual: String,
}, { _id: false })

const SubmissionSchema = new mongoose.Schema({
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
    index: true,
  },
  code: {
    type: String,
    required: true,
    maxlength: 50000,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp', 'java'],
    required: true,
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'timeout', 'error'],
    required: true,
  },
  time: {
    type: Number, // Execution time in milliseconds
    required: true,
  },
  error: {
    type: String,
    default: null,
  },
  testResults: [TestResultSchema],
  rank: {
    type: Number,
    default: null,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
})

// Compound index for faster queries
SubmissionSchema.index({ battleId: 1, userId: 1 })
SubmissionSchema.index({ battleId: 1, status: 1, time: 1 }) // For leaderboard
SubmissionSchema.index({ userId: 1, createdAt: -1 }) // For user history

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema)

