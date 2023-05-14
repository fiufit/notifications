import dotenv from 'dotenv';
import { logger } from '@src/config/logger';

enum Name {
  HOST = 'HOST',
  PORT = 'PORT',
  DB_URI = 'DB_URI',
}

// Default values
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 7777;
const DEFAULT_DB_URI = '';

// Set environment variables
logger.info('Reading environment variables');
dotenv.config();

/**
 * @description Validate a host.
 * @param {string} host must be a string type.
 * @returns {string} host or DEFAULT_HOST if not provided.
 */
const _getHost = (host?: string): string => {
  if (!host) {
    logger.warn(`${Name.HOST} env variable not found, default taken: [${Name.HOST}=${DEFAULT_HOST}]`);
    return DEFAULT_HOST;
  }
  logger.info(`[${Name.HOST}=${host}]`);
  return host;
};

/**
 * @description Validate a port.
 * @param {string} port Port value must be a string type.
 * @returns {number} Port cast to number or DEFAULT_PORT in case of error.
 */
const _getPort = (port?: string): number => {
  if (!port) {
    logger.warn(`${Name.PORT} env variable not found, default taken: [${Name.PORT}=${DEFAULT_PORT}]`);
    return DEFAULT_PORT;
  }

  const intPort = parseInt(port);
  if (!intPort) {
    logger.warn(`${Name.PORT} env variable is not a number, default taken: [${Name.PORT}=${DEFAULT_PORT}]`);
    return DEFAULT_PORT;
  }
  logger.info(`[${Name.PORT}=${port}]`);
  return intPort;
};

/**
 * @description Validates a database URI.
 * @param {string} databaseURI Database uri value must be a string type.
 * @returns {number} Port cast to number or DEFAULT_PORT in case of error.
 */
const _getDatabaseURI = (databaseURI?: string): string => {
  if (!databaseURI) {
    logger.warn(`${Name.DB_URI} env variable not found`);
    return DEFAULT_DB_URI;

  }
  return databaseURI;
};

// Enviroment variable values
const env = {
  host: _getHost(process.env.HOST),
  port: _getPort(process.env.PORT),
  databaseURI: _getDatabaseURI(process.env.DB_URI),
};

export { env };
