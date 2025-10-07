type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isProduction = import.meta.env.VITE_ENV === 'production'

function formatMessage(level: LogLevel, args: unknown[]): unknown[] {
  const prefix = `[${level.toUpperCase()}]`
  return [prefix, ...args]
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProduction) console.debug(...formatMessage('debug', args))
  },
  info: (...args: unknown[]) => {
    if (!isProduction) console.log(...formatMessage('info', args))
  },
  warn: (...args: unknown[]) => {
    if (!isProduction) console.warn(...formatMessage('warn', args))
  },
  error: (...args: unknown[]) => {
    // Always log errors
    console.error(...formatMessage('error', args))
  },
}

export default logger


