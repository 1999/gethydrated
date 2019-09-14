import express from 'express';
import pino from 'pino';
import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';
import { Sequelize, default as SequalizeBase } from 'sequelize';

const logger = pino();
// const dbLogger = logger.child({ module: 'orm' });
const sequelize = new Sequelize('postgres://postgres:postgres@db:5432/cards');
const app = express();


async function main() {
  class Card extends SequalizeBase.Model {}

  Card.init({
    card_id: SequalizeBase.STRING,
    revision: SequalizeBase.STRING,
    prev_revision: SequalizeBase.STRING,
    created_at: SequalizeBase.STRING,
    deleted: SequalizeBase.BOOLEAN,
    title: SequalizeBase.STRING,
    data: SequalizeBase.JSON,
  }, {
    sequelize,
    tableName: 'cards',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['card_id', 'revision'],
      },
    ],
  });
  Card.removeAttribute('id');

  await sequelize.sync();

  app.use(cors({ origin: true, credentials: true }));

  app.post('/sync', jsonBodyParser({ limit: '4Mb' }), async (req, res) => {
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

    res.json({ foo: 'bar' });
  });

  app.listen(80, () => {
    logger.info(`App is listening to incoming connections on port 80`);
  });
}

main();
