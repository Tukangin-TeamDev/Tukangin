/**
 * Simple logger utility
 */

// Logger levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Function for adding timestamp prefix
const timestamp = (): string => {
  return new Date().toISOString();
};

// Function for colorizing console output in development
const colorize = (level: LogLevel, message: string): string => {
  if (process.env.NODE_ENV === 'production') {
    return message;
  }

  const colors = {
    debug: '\x1b[34m', // blue
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
    reset: '\x1b[0m'   // reset
  };

  return `${colors[level]}${message}${colors.reset}`;
};

// Main logger
const logger = {
  debug: (message: string, meta?: any): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        colorize('debug', `[${timestamp()}] [DEBUG] ${message}`),
        meta ? meta : ''
      );
    }
  },

  info: (message: string, meta?: any): void => {
    console.info(
      colorize('info', `[${timestamp()}] [INFO] ${message}`),
      meta ? meta : ''
    );
  },

  warn: (message: string, meta?: any): void => {
    console.warn(
      colorize('warn', `[${timestamp()}] [WARN] ${message}`),
      meta ? meta : ''
    );
  },

  error: (message: string, error?: any): void => {
    console.error(
      colorize('error', `[${timestamp()}] [ERROR] ${message}`),
      error instanceof Error ? error.stack : error ? error : ''
    );
  }
};

export default logger;
