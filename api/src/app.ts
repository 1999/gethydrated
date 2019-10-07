import express from 'express';
import pino from 'pino';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';

import config from './config';
import { insertCards, syncModels as syncDatabaseModels } from './database';
import { asyncHandler } from './express-async-handler';
import { sanitiseIncomingCards } from './card';

const logger = pino({ level: config.logLevel });
const app = express();

async function main() {
  await syncDatabaseModels(logger);

  app.use(cors({ origin: true, credentials: true }));
  app.post('/sync', jsonBodyParser({ limit: '4Mb' }), asyncHandler(async (req, res) => {
    const cards = sanitiseIncomingCards(req.body.cards);

    // TODO group imcoming cards by id
    // TODO sort incoming cards by revision
    // TODO insert: if id doesn't exist - store
    // TODO insert: if [id, revision] exists ignore
    // TODO is there existing card with this [id, revision]? yes - looks like a merge conflict

    await insertCards(cards);
    res.sendStatus(202);
  }));

  app.listen(config.port, () => {
    logger.info(`App is listening to incoming connections on port ${config.port}`);
  });
}

process.on('unhandledRejection', (err) => {
  logger.fatal('Asynchronous action failed', { err });
  process.exit(1);
});

main();
