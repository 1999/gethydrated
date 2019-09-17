import express from 'express';
import pino from 'pino';
import AWS from 'aws-sdk';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';

import config from './config';
import syncDatabaseModels from './database';
import sync from './routes/sync';
import { assertQueueExists } from './queue';

const logger = pino();
const app = express();

const sqs = new AWS.SQS({
  ...config.sqs.connection,
  // logger: ...
});

async function main() {
  await Promise.all([
    syncDatabaseModels(),
    assertQueueExists(sqs),
  ]);

  sqs.receiveMessage({ QueueUrl: config.sqs.queueUrl, WaitTimeSeconds: 20 }, (err, data) => {
    console.log('receive', { err, data });
  });

  app.use(cors({ origin: true, credentials: true }));
  app.post('/sync', jsonBodyParser({ limit: '4Mb' }), sync(sqs));

  app.listen(80, () => {
    logger.info(`App is listening to incoming connections on port 80`);
  });
}

main();
