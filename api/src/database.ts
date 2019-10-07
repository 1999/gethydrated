import { Sequelize, default as SequalizeBase } from 'sequelize';
import config from './config';
import { Logger } from 'pino';
import { Card } from './card';

class CardModel extends SequalizeBase.Model {}

const initModels = (sequelize: Sequelize) => {
  CardModel.init({
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
  CardModel.removeAttribute('id');
};

export const syncModels = async (logger: Logger): Promise<void> => {
  const dbLogger = logger.child({ module: 'orm' });
  const sequelize = new Sequelize(`postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.dbName}`, {
    logging: (sql, timing) => {
      dbLogger.debug('SQL resuest finished', { sql, timing });
    }
  });

  initModels(sequelize);
  await sequelize.sync();
};

export const insertCards = async (cards: Card[]): Promise<void> => {
  // TODO bulk insert
  for (const card of cards) {
    await CardModel.findOrCreate({
      where: {
        card_id: card.id,
        revision: card.revision,
      },
      defaults: {
        card_id: card.id,
        revision: card.revision,
        prev_revision: card.meta.prevRevision || '',
        created_at: card.meta.created_at.toUTCString(),
        deleted: Number(card.meta.deleted),
        title: card.meta.title,
        data: card.data,
      },
    });
  }
};
