import { Queue } from './';
import { CardGroups } from '../card';
import { Database } from '../database';

export class InMemoryQueue implements Queue {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async addCards(groups: CardGroups) {
    process.nextTick(async () => {
      this.processSave(groups);
    });
  }

  private async processSave(groups: CardGroups) {
    await this.database.insertCards(groups);
    // TODO insert: if id doesn't exist - store
    // TODO insert: if [id, revision] exists ignore
    // TODO is there existing card with this [id, revision]? yes - looks like a merge conflict
  }
}
