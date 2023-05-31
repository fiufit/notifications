import { env, logger, database, app } from '@src/config';

/**
 * @description Start the app listening on port and host defined in the env file
 */
const run = () => {
  const { host, port } = env;
  logger.info(`Starting server`);
  app.listen(port, host, () => {
    logger.info(`Server started on address [${host}] and port [${port}]`);
    database.connect();
  });
};

run();
