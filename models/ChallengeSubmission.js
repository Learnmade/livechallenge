import mongoose from 'mongoose'

const TestResultSchema = new mongoose.Schema({
  testCaseIndex: Number,
  passed: Boolean,
  input: String,
  expectedOutput: String,
  actualOutput: String,
  error: String,
  executionTime: Number, // in milliseconds
}, { _id: false })

const ChallengeSubmissionSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
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
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'typescript'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'passed', 'failed', 'timeout', 'error'],
    default: 'pending',
  },
  testResults: [TestResultSchema],
  executionTime: {
    type: Number, // total execution time in milliseconds
    default: 0,
  },
  memoryUsed: {
    type: Number, // in MB
    default: 0,
  },
  error: {
    type: String,
    default: null,
  },
  output: {
    type: String,
    default: null,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  isFirstSubmission: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
})

// Compound indexes
ChallengeSubmissionSchema.index({ challengeId: 1, userId: 1 })
ChallengeSubmissionSchema.index({ challengeId: 1, status: 1, submittedAt: -1 })
ChallengeSubmissionSchema.index({ userId: 1, submittedAt: -1 })

export default mongoose.models.ChallengeSubmission || mongoose.model('ChallengeSubmission', ChallengeSubmissionSchema)

