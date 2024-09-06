import { default as pico } from 'picocolors'

/**
 * Formats the current timestamp for logs.
 * @param {Date} [date] Optional date to use for the timestamp. Defaults to the current date.
 * @param {boolean} [localtime=true] Whether to use local time or UTC. Defaults to local time.
 * @returns {string} Formatted timestamp string.
 */
export function logTimestamp(date, localtime = true) {
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

/**
 * Parse the log level to return a color-coded string.
 * TODO: Replace with `node:utils.styleText` for Node >= 21.
 * @param {string} level The log level to parse.
 * @returns {string} A color-coded log level string.
 */
const parseLogLevel = (level) => {
  const colors = {
    INFO: pico.green,
    WARN: pico.yellow,
    ERROR: pico.red,
    DEBUG: pico.magenta,
    QUERY: pico.blue,
  }
  return colors[level] ? colors[level](level) : pico.gray(level)
}

/**
 * Logs a message with a given log level and optional arguments.
 * @param {string} level The log level (INFO, WARN, ERROR, DEBUG, QUERY).
 * @param {string} message The message to log.
 * @param {...any} args Additional arguments to log.
 */
export default function logger(level, message, ...args) {
  const logPrefix = `${logTimestamp()} ${parseLogLevel(level)}`
  const logMethod = {
    INFO: console.info,
    WARN: console.warn,
    ERROR: console.error,
    DEBUG: console.debug,
    QUERY: console.log,
  }
  const logFunc = logMethod[level] || console.log
  const logMessage = level === 'INFO' || level === 'WARN' ? ` ${message}` : message

  // If log level is DEBUG and environment is not set to 'debug', do not print the log.
  if (level === 'DEBUG' && process.env.APP_LOG_LEVEL?.toLowerCase() !== 'debug') {
    return
  }

  logFunc(logPrefix, logMessage, ...args)
}
