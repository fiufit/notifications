import mongoose from 'mongoose';
import { env } from '@src/config/env';
import { logger } from '@src/config/logger';

/**
 * @description Configure event listeners to the database.
 */
const _configureEventListeners = () => {
  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to the database');
  });

  mongoose.connection.on('disconnecting', () => {
    logger.info('Disconnecting from the database');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Database connection established');
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('Database disconnected');
  });
};

/**
 * @description Establish a connection to the database. If an error
 * occurs no other tries to reconnect are attempt.
 */
const connect = async (): Promise<void> => {
  const { databaseURI } = env;

  _configureEventListeners();
  try {
    await mongoose.connect(databaseURI);
  } catch (error) {
    logger.error(`Could not connect to the database - ${error}`);
  }
};

const database = {
  connect,
}

export { database };
