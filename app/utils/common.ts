import pico from 'picocolors'

export type EnumValues<Type> = Type[keyof Type]

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'QUERY'

export function logTimestamp(date?: Date, localtime = true): string {
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

// TODO replace with `node:utils.styleText` (requires node >= 21)
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

export function logger(level: LogLevel, message: string, ...args: unknown[]): void {
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

  // If log level === DEBUG and env is not development, don't print the log
  if (level === 'DEBUG' && process.env.APP_LOG_LEVEL?.toLowerCase() !== 'debug') {
    return
  }

  logFunc(logPrefix, logMessage, ...args)
}
