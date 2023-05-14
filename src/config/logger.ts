import pino from 'pino';

const logLevelOptions = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

// Logger config
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: logLevelOptions[3],
});

export { logger };
