import winston from 'winston';

// Konfigurasi format log
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Membuat winston logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Menulis log ke konsol
    new winston.transports.Console(),

    // Menulis log error ke file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      dirname: 'logs',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),

    // Menulis semua log ke file
    new winston.transports.File({
      filename: 'logs/combined.log',
      dirname: 'logs',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Jika bukan production, tambahkan format yang lebih bagus untuk konsol
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

// Func yang digunakan untuk mencetak log HTTP requests
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
};
