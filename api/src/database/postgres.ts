import { Database } from './';
import { CardGroups } from '../card';
import { Sequelize, default as SequalizeBase } from 'sequelize';
import { Logger } from 'pino';
import config from '../config';

class CardModel extends SequalizeBase.Model {}

export class PostgresDatabase implements Database {
  private sequelize: Sequelize;

  static async initialise(logger: Logger) {
    const dbLogger = logger.child({ module: 'postgres-database' });
    const sequelize = new Sequelize(`postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.dbName}`, {
      logging: (sql) => {
        dbLogger.debug('SQL resuest finished', { sql });
      }
    });

    const database = new PostgresDatabase(sequelize);
    await sequelize.sync();

    return database;
  }

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.syncModels();
  }

  async insertCards(cardGroups: CardGroups) {
    // TODO bulk insert
    for (const [id, cards] of Object.entries(cardGroups)) {
      for (const card of cards) {
        await CardModel.findOrCreate({
          where: {
            card_id: id,
            revision: card.revision,
          },
          defaults: {
            card_id: id,
            revision: card.revision,
            prev_revision: card.meta.prevRevision || '',
            created_at: card.meta.created_at.toUTCString(),
            deleted: Number(card.meta.deleted),
            title: card.meta.title,
            data: card.data,
          },
        });
      }
    }
  }

  private syncModels() {
    CardModel.init({
      card_id: SequalizeBase.STRING,
      revision: SequalizeBase.STRING,
      prev_revision: SequalizeBase.STRING,
      created_at: SequalizeBase.STRING,
      deleted: SequalizeBase.BOOLEAN,
      title: SequalizeBase.STRING,
      data: SequalizeBase.JSON,
    }, {
      sequelize: this.sequelize,
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
  }
}
