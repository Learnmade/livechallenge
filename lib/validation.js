import { z } from 'zod'
import { sanitizeInput, sanitizeCode } from './security'

// User Validation Schemas
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform(sanitizeInput),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(sanitizeInput),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(sanitizeInput),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform(sanitizeInput)
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(sanitizeInput)
    .optional(),
})

// Battle Validation Schemas
export const createBattleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .transform(sanitizeInput),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Difficulty must be easy, medium, or hard' }),
  }),
  language: z.enum(['javascript', 'python', 'cpp', 'java'], {
    errorMap: () => ({ message: 'Invalid programming language' }),
  }),
  duration: z.number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(10, 'Duration must be at most 10 minutes'),
  problem: z.object({
    title: z.string()
      .min(3, 'Problem title must be at least 3 characters')
      .max(200, 'Problem title is too long')
      .transform(sanitizeInput),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description is too long')
      .transform(sanitizeInput),
    examples: z.array(z.object({
      input: z.string().max(1000).transform(sanitizeInput),
      output: z.string().max(1000).transform(sanitizeInput),
      explanation: z.string().max(500).transform(sanitizeInput).optional(),
    })).min(1, 'At least one example is required'),
    constraints: z.array(z.string().max(200).transform(sanitizeInput)).optional(),
    note: z.string().max(500).transform(sanitizeInput).optional(),
  }),
  starterCode: z.object({
    javascript: z.string().max(10000).transform(sanitizeCode).optional(),
    python: z.string().max(10000).transform(sanitizeCode).optional(),
    cpp: z.string().max(10000).transform(sanitizeCode).optional(),
    java: z.string().max(10000).transform(sanitizeCode).optional(),
  }).optional(),
})

export const submitSolutionSchema = z.object({
  battleId: z.string().min(1, 'Battle ID is required'), // MongoDB ObjectId or UUID
  code: z.string()
    .min(1, 'Code cannot be empty')
    .max(50000, 'Code is too long')
    .transform(sanitizeCode),
  language: z.enum(['javascript', 'python', 'cpp', 'java'], {
    errorMap: () => ({ message: 'Invalid programming language' }),
  }),
})

// Validation helper function
export function validateInput(schema, data) {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }
    }
    return {
      success: false,
      errors: [{ path: 'unknown', message: 'Validation failed' }],
    }
  }
}

