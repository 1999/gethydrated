import { Queue } from './';
import { CardGroups } from '../card';
import { Database } from '../database';
import { Logger } from 'pino';

export class InMemoryQueue implements Queue {
  private database: Database;
  private logger: Logger;

  constructor(database: Database, logger: Logger) {
    this.database = database;
    this.logger = logger.child({ module: 'queue-memory' });
  }

  async addCards(groups: CardGroups) {
    process.nextTick(async () => {
      this.processSave(groups);
    });
  }

  private async processSave(groups: CardGroups): Promise<void> {
    // TODO parallel
    for (const [id, revisions] of Object.entries(groups)) {
      if (await this.database.cardExists(id)) {
        for (const cardRevision of revisions) {
          const databaseCardRevision = await this.database.getCardByRevision(cardRevision.id, cardRevision.revision);

          if (databaseCardRevision) {
            if (databaseCardRevision.meta.prevRevision !== cardRevision.meta.prevRevision) {
              console.log({ db: databaseCardRevision.meta.prevRevision, ui: cardRevision.meta.prevRevision})

              throw new Error('Unexpected previous revision');
            }

            this.logger.info('Existing card revision found');
          } else {
            if (!cardRevision.meta.prevRevision) {
              throw new Error('No previous revision for new revision card');
            }

            const databaseParentRevision = await this.database.getCardByRevision(cardRevision.id, cardRevision.meta.prevRevision);
            if (!databaseParentRevision) {
              throw new Error('Could not find card with previous revision in the database');
            }

            const databaseParentChildRevision = await this.database.getCardByPreviousRevision(cardRevision.id, cardRevision.meta.prevRevision);
            if (databaseParentChildRevision) {
              throw new Error('Conflict occured: card with prevRevision already has a child');
            }

            await this.database.insertCard(cardRevision);
            this.logger.info('Existing card revision inserted', { id, revision: cardRevision.revision });
          }
        }
      } else {
        for (let i = 0; i < revisions.length; i++) {
          const cardRevision = revisions[i];

          if (i === 0 && cardRevision.revision !== 'root') {
            throw new Error('Unexpected new card revision');
          }

          await this.database.insertCard(cardRevision);
          this.logger.info('New card revision inserted', { id, revision: cardRevision.revision });
        }
      }
    }
  }
}
