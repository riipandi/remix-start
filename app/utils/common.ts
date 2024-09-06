import pico from 'picocolors'

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'QUERY'

/**
 * Generates a formatted timestamp string.
 * @param date - Optional Date object. Defaults to current date/time.
 * @param localtime - Whether to use local time. Defaults to true.
 * @returns Formatted timestamp string.
 */
function logTimestamp(date?: Date, localtime = true): string {
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
 * TODO replace with `node:utils.styleText` (requires node >= 21)
 * Parses the log level and returns a colored string representation.
 * @param level - The log level.
 * @returns Colored string representation of the log level.
 */
const parseLogLevel = (level: LogLevel): string => {
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
 * Logs a message with the specified log level.
 * @param level - The log level.
 * @param message - The message to log.
 * @param args - Additional arguments to log.
 */
function log(level: LogLevel, message: string | unknown, ...args: unknown[]): void {
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

  if (level === 'DEBUG' && process.env.APP_LOG_LEVEL?.toLowerCase() === 'silent') {
    return
  }

  logFunc(logPrefix, logMessage, ...args)
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
 *
 * Each method takes a message string and optional additional arguments to be logged.
 */
export const logger = {
  info: (message: string | unknown, ...args: unknown[]) => log('INFO', message, ...args),
  warn: (message: string | unknown, ...args: unknown[]) => log('WARN', message, ...args),
  error: (message: string | unknown, ...args: unknown[]) => log('ERROR', message, ...args),
  debug: (message: string | unknown, ...args: unknown[]) => log('DEBUG', message, ...args),
  query: (message: string | unknown, ...args: unknown[]) => log('QUERY', message, ...args),
}
