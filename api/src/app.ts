import express from 'express';
import pino from 'pino';

const app = express();
const logger = pino();

app.listen(8082, () => {
  logger.info(`App is listening to incoming connections on port 8082`);
});
