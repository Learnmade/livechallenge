// Simple logging utility for production

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
const LOG_FILE = process.env.LOG_FILE

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

function shouldLog(level) {
  return levels[level] <= levels[LOG_LEVEL]
}

function formatMessage(level, message, data) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(data && { data }),
  }
  return JSON.stringify(logEntry)
}

export const logger = {
  error(message, data) {
    if (shouldLog('error')) {
      const log = formatMessage('error', message, data)
      console.error(log)
      // In production, write to file or send to logging service
      if (LOG_FILE && typeof process !== 'undefined') {
        // Example: fs.appendFileSync(LOG_FILE, log + '\n')
      }
    }
  },

  warn(message, data) {
    if (shouldLog('warn')) {
      const log = formatMessage('warn', message, data)
      console.warn(log)
    }
  },

  info(message, data) {
    if (shouldLog('info')) {
      const log = formatMessage('info', message, data)
      console.log(log)
    }
  },

  debug(message, data) {
    if (shouldLog('debug')) {
      const log = formatMessage('debug', message, data)
      console.debug(log)
    }
  },
}

