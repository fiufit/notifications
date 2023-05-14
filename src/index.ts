import { env, logger, database, app } from '@src/config';

/**
 * @description Start the app listening on port and host defined in the env file
 */
const listen = (callback: () => void) => {
  const { host, port } = env;
  logger.info(`Starting server`);
  app.listen(port, host, () => {
    logger.info(`Server started on address [${host}] and port [${port}]`);
    callback();
  });
};

/**
 * @description Start a connection to the database
 */
const connectDatabase = async (): Promise<void> => {
  database.connect();
};

/**
 * @description Run the application.
 */
const run = () => {
  listen(connectDatabase);
};

run();
