import express from 'express';
import pino from 'pino';
import AWS from 'aws-sdk';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';

import config from './config';
import syncDatabaseModels from './database';
import { assertQueueExists, putIntoQueue, listenQueueChanges } from './queue';

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

  listenQueueChanges(sqs);

  app.use(cors({ origin: true, credentials: true }));
  app.post('/sync', jsonBodyParser({ limit: '4Mb' }), async (req, res, next) => {
    // TODO validate incoming cards structure
    // TODO sanitise incoming cards data (only use known props)
    // TODO group imcoming cards by id
    // TODO sort incoming cards by revision
    // TODO insert: if id doesn't exist - store
    // TODO insert: if [id, revision] exists ignore
    // TODO is there existing card with this [id, revision]? yes - looks like a merge conflict

    try {
      await putIntoQueue(sqs, req.body.cards);
      res.sendStatus(202);
    } catch (err) {
      next(err);
    }
  });

  app.listen(80, () => {
    logger.info(`App is listening to incoming connections on port 80`);
  });
}

main();
