/**
 * Utility functions for generating and working with slugs
 */

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 */
export function generateUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

