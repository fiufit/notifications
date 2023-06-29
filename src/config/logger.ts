import pino from 'pino';
import dotenv from 'dotenv';
dotenv.config();

const logLevelOptions = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

// Logger config
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.ENVIRONMENT === 'testing' ? logLevelOptions[6] : logLevelOptions[3],
});

export { logger };
