/**
 * Helper functions for finding challenges by slug or number
 */
import Challenge from '@/models/Challenge'

/**
 * Find a challenge by slug or number (for backward compatibility)
 */
export async function findChallengeBySlugOrNumber(language, slugOrNumber) {
  // Try to find by slug first
  let challenge = await Challenge.findOne({
    language,
    slug: slugOrNumber,
    isActive: true,
  })
  
  // Fallback to challengeNumber if slug not found
  if (!challenge) {
    const challengeNumber = parseInt(slugOrNumber)
    if (!isNaN(challengeNumber)) {
      challenge = await Challenge.findOne({
        language,
        challengeNumber,
        isActive: true,
      })
    }
  }
  
  return challenge
}

