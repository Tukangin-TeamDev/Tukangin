import winston from 'winston';
import path from 'path';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${stack ? '\n' + stack : ''}`;
  })
);

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Create logger
const logger = winston.createLogger({
  level: level(),
  levels: logLevels,
  format: logFormat,
  transports: [
    // Console log for development
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), logFormat),
    }),

    // Save logs to file in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          // Error logs
          new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
          }),
          // All logs
          new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
          }),
        ]
      : []),
  ],
});

export default logger;
