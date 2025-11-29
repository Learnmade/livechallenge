import mongoose from 'mongoose'

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
}, { _id: false })

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'typescript'],
    required: true,
    index: true,
  },
  challengeNumber: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  examples: [{
    input: String,
    output: String,
    explanation: String,
  }],
  constraints: [String],
  starterCode: {
    type: String,
    default: '',
  },
  testCases: {
    type: [TestCaseSchema],
    required: true,
  },
  hints: [String],
  solution: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 100,
  },
  timeLimit: {
    type: Number, // in seconds
    default: 10,
  },
  memoryLimit: {
    type: Number, // in MB
    default: 256,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  totalSubmissions: {
    type: Number,
    default: 0,
  },
  successfulSubmissions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Compound index for language and challenge number
ChallengeSchema.index({ language: 1, challengeNumber: 1 }, { unique: true })
// Compound index for language and slug (for URL routing)
ChallengeSchema.index({ language: 1, slug: 1 }, { unique: true })
ChallengeSchema.index({ language: 1, isActive: 1 })
ChallengeSchema.index({ slug: 1 })

export default mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema)

