import { Sequelize, default as SequalizeBase } from 'sequelize';

// const dbLogger = logger.child({ module: 'orm' });
const sequelize = new Sequelize('postgres://postgres:postgres@db:5432/cards');

export class Card extends SequalizeBase.Model {}
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

export default async function syncModels() {
  await sequelize.sync();
}