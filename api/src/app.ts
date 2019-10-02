import express from 'express';
import pino from 'pino';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';

import config from './config';
import syncDatabaseModels, { Card } from './database';

const logger = pino();
const app = express();

async function main() {
  await syncDatabaseModels();

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
      for (const card of req.body.cards) {
        await Card.findOrCreate({
          where: {
            card_id: card.id,
            revision: card.revision,
          },
          defaults: {
            card_id: card.id,
            revision: card.revision,
            prev_revision: '', // TODO
            created_at: card.created_at,
            deleted: card.deleted,
            title: card.title,
            data: card, // TODO
          },
        });
      }

      res.sendStatus(202);
    } catch (err) {
      next(err);
    }
  });

  app.listen(config.port, () => {
    logger.info(`App is listening to incoming connections on port ${config.port}`);
  });
}

process.on('unhandledRejection', (err) => {
  logger.fatal('Asynchronous action failed', { err });
  process.exit(1);
});

main();
