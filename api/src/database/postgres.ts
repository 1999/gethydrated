import { Database } from './';
import { Card } from '../card';
import { Sequelize, default as SequalizeBase } from 'sequelize';
import { Logger } from 'pino';
import config from '../config';

class CardModel extends SequalizeBase.Model {
  card_id: string;
  revision: string;
  prev_revision?: string;
  created_at: string;
  deleted: boolean;
  title: string;
  data: any;
}

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

  async cardExists(id: string) {
    const total = await CardModel.count({
      where: {
        card_id: id,
      },
    });

    return total > 0;
  }

  async getCardByRevision(id: string, revision: string) {
    const record = await CardModel.findOne<CardModel>({
      where: {
        card_id: id,
        revision,
      },
    });

    return record ? this.buildCardObject(record) : null;
  }

  async getCardByPreviousRevision(id: string, prevRevision: string) {
    const record = await CardModel.findOne<CardModel>({
      where: {
        card_id: id,
        prev_revision: prevRevision,
      },
    });

    return record ? this.buildCardObject(record) : null;
  }

  async insertCard(card: Card) {
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
          fields: ['card_id'],
        },
        {
          unique: true,
          fields: ['card_id', 'revision'],
        },
        {
          unique: true,
          fields: ['card_id', 'prev_revision'],
        },
      ],
    });
    CardModel.removeAttribute('id');
  }

  private buildCardObject(databaseRecord: CardModel): Card {
    return {
      id: databaseRecord.getDataValue('card_id'),
      revision: databaseRecord.getDataValue('revision'),
      meta: {
        title: databaseRecord.getDataValue('title'),
        prevRevision: databaseRecord.getDataValue('prev_revision') || undefined,
        created_at: new Date(databaseRecord.getDataValue('created_at')),
        deleted: databaseRecord.getDataValue('deleted')
      },
      data: databaseRecord.getDataValue('data'),
    };
  }
}
