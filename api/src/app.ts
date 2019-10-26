import express from 'express';
import pino from 'pino';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';

import config from './config';
import { asyncHandler } from './express-async-handler';
import { sanitiseIncomingCards, groupCards } from './card';
import { InMemoryQueue } from './queue/in-memory';
import { PostgresDatabase } from './database/postgres';

const logger = pino({ level: config.logLevel });
const app = express();

async function main() {
  const database = await PostgresDatabase.initialise(logger);
  const queue = new InMemoryQueue(database, logger);

  const allowCors = cors({ origin: true, credentials: true });
  app.use(allowCors);

  app.post('/sync', jsonBodyParser({ limit: '4Mb' }), asyncHandler(async (req, res) => {
    const cards = sanitiseIncomingCards(req.body.cards);
    const cardGroups = groupCards(cards);
    await queue.addCards(cardGroups);

    res.sendStatus(202);
  }));

  app.listen(config.port, () => {
    logger.info(`App is listening to incoming connections on port ${config.port}`);
  });
}

process.on('unhandledRejection', (err) => {
  logger.fatal('Asynchronous action failed', { err: (err as any).message });
  process.exit(1);
});

main();
