import pico from 'picocolors'

/**
 * Generates a formatted timestamp string.
 * @param date - Optional Date object. Defaults to current date/time.
 * @param localtime - Whether to use local time. Defaults to true.
 * @returns Formatted timestamp string.
 */
function logTimestamp(date, localtime = true) {
  const now = date ?? new Date()
  const useUTC = !localtime

  const year = useUTC ? now.getUTCFullYear() : now.getFullYear()
  const month = String(useUTC ? now.getUTCMonth() + 1 : now.getMonth() + 1).padStart(2, '0')
  const day = String(useUTC ? now.getUTCDate() : now.getDate()).padStart(2, '0')
  const hours = String(useUTC ? now.getUTCHours() : now.getHours()).padStart(2, '0')
  const minutes = String(useUTC ? now.getUTCMinutes() : now.getMinutes()).padStart(2, '0')
  const seconds = String(useUTC ? now.getUTCSeconds() : now.getSeconds()).padStart(2, '0')

  return pico.dim(`[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`)
}

// Constants for log colors
const LOG_COLORS = {
  info: pico.green,
  warn: pico.yellow,
  error: pico.red,
  debug: pico.magenta,
  query: pico.blue,
  server: pico.cyan,
}

// Constants for log methods with uppercase keys
const LOG_METHODS = {
  INFO: console.info,
  WARN: console.warn,
  ERROR: console.error,
  DEBUG: console.debug,
  QUERY: console.log,
  SERVER: console.log,
}

// Fallback constants
const DEFAULT_COLOR = pico.gray
const DEFAULT_LOG_METHOD = console.log
const LOG_LEVELS = Object.keys(LOG_METHODS)
const MAX_LEVEL_LENGTH = Math.max(...LOG_LEVELS.map((level) => level.length))

/**
 * Logs a message with the specified log level.
 * @param level - The log level.
 * @param message - The message to log.
 * @param args - Additional arguments to log.
 */
function log(level, message, ...args) {
  // Determine log color and method
  const colorFunc = LOG_COLORS[level] || DEFAULT_COLOR
  const logFunc = LOG_METHODS[level.toUpperCase()] || DEFAULT_LOG_METHOD

  // Strip newlines, tabs, and 4 spaces from string content but keep the color formatting
  const stripNewLinesAndSpaces = (content) =>
    typeof content === 'string'
      ? content
          .replace(/\r?\n|\r/g, '') // Remove newlines
          .replace(/\t/g, '') // Remove tabs
          .replace(/ {4}/g, '') // Remove 4 spaces
      : content // If not a string, return the content as-is

  // Build the log message
  const cleanedMessage = stripNewLinesAndSpaces(message)
  const paddedLevel = level.toUpperCase().padEnd(MAX_LEVEL_LENGTH)
  const logPrefix = `${logTimestamp()} ${colorFunc(paddedLevel)}`
  const logMessage = ` ${cleanedMessage}` // Space after prefix for consistent alignment

  // Handle silent mode for debug logs
  if (level === 'debug' && process.env.APP_LOG_LEVEL?.toLowerCase() === 'silent') {
    return
  }

  // Safely process the additional arguments without cutting off objects or non-strings
  const strippedArgs = args.map(stripNewLinesAndSpaces)

  // Apply color formatting after stripping newlines and spaces
  logFunc(logPrefix, logMessage, ...strippedArgs)
}

/**
 * An object that provides methods for logging messages with different log levels.
 *
 * The available log levels are:
 * - `info`: For informational messages.
 * - `warn`: For warning messages.
 * - `error`: For error messages.
 * - `debug`: For debug messages.
 * - `query`: For logging SQL queries.
 * - `silent`: Suppresses all logging.
 *
 * Example usage:
 *  logger.info('This is an info message');
 *  logger.debug('This is a debug message');
 *  logger.error('This is an error message', { someError: 'details' });
 *  logger.warn('This is a warning');
 *  logger.query('SELECT * FROM users');
 *  logger.server('This is a server message');
 *
 * Each method takes a message string and optional additional arguments to be logged.
 */
const logger = {
  info: (message, ...args) => log('info', message, ...args),
  warn: (message, ...args) => log('warn', message, ...args),
  error: (message, ...args) => log('error', message, ...args),
  debug: (message, ...args) => log('debug', message, ...args),
  query: (message, ...args) => log('query', message, ...args),
  server: (message, ...args) => log('server', message, ...args),
}

export default logger
