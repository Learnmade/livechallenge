import mongoose from 'mongoose'

const ExampleSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  output: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  explanation: {
    type: String,
    maxlength: 500,
  },
}, { _id: false })

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  examples: {
    type: [ExampleSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'At least one example is required',
    },
  },
  constraints: [{
    type: String,
    maxlength: 200,
  }],
  note: {
    type: String,
    maxlength: 500,
  },
  testCases: [{
    input: String,
    output: String,
  }],
}, { _id: false })

const StarterCodeSchema = new mongoose.Schema({
  javascript: String,
  python: String,
  cpp: String,
  java: String,
}, { _id: false })

const BattleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Battle title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must be less than 100 characters'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp', 'java'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 minute'],
    max: [10, 'Duration must be at most 10 minutes'],
  },
  timeRemaining: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'ended'],
    default: 'pending',
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: ProblemSchema,
    required: true,
  },
  starterCode: {
    type: StarterCodeSchema,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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

// Indexes
BattleSchema.index({ status: 1 })
BattleSchema.index({ hostId: 1 })
BattleSchema.index({ createdAt: -1 })

// Update updatedAt on save
BattleSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Battle || mongoose.model('Battle', BattleSchema)

