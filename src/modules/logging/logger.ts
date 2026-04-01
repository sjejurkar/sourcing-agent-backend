import pino from 'pino';
import { config } from '../config/config';
import { LogContext } from './logger.types';

// Create base logger
const pinoLogger = pino({
  level: config.logging.level,
  transport: config.logging.pretty && config.server.nodeEnv === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Create child logger with context
export const createLogger = (context: LogContext = {}) => {
  return pinoLogger.child(context);
};

// Export base logger
export const logger = pinoLogger;
