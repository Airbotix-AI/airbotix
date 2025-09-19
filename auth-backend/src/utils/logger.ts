import winston from 'winston';
import { config } from '../config/env';

const logger = winston.createLogger({
  level: config.app.env === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.app.env === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message, stack }) =>
              `${timestamp} [${level}]: ${stack || message}`
          )
        )
  ),
  transports: [
    new winston.transports.Console({
      silent: config.app.env === 'test',
    }),
  ],
});

if (config.app.env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export { logger };