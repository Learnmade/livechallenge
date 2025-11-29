/**
 * Optimized API client with retry logic and error handling
 */

const DEFAULT_TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408)
    }
    throw error
  }
}

/**
 * Retry fetch with exponential backoff
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  let lastError

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options)
      
      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        const data = await response.json().catch(() => ({}))
        throw new ApiError(
          data.error || 'Client error',
          response.status,
          data
        )
      }

      // Retry on 5xx errors and network errors
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`)
      }

      return response
    } catch (error) {
      lastError = error

      // Don't retry on client errors or if no retries left
      if (error instanceof ApiError && error.status < 500) {
        throw error
      }

      if (i < retries) {
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * API client with automatic error handling
 */
export const apiClient = {
  async get(url, options = {}) {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      )
    }

    return data
  },

  async post(url, body, options = {}) {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      )
    }

    return data
  },

  async put(url, body, options = {}) {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      )
    }

    return data
  },

  async delete(url, options = {}) {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      )
    }

    return data
  },
}

export { ApiError }

