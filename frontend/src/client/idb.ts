import { open as openDatabase } from 'sklad2';
import uniqueId from 'uuid/v4';
import { AppClient, CardFormFields, CardMeta, SaveConflictError, CardDeletedError, CardMissingError } from './';

/* eslint-disable @typescript-eslint/camelcase */

type CardDatabaseMeta = {
  id: string;
  revision?: string;
  created_at?: Date;
  latest?: number;
  prev_revision?: string;
  deleted?: number;
  synced?: number;
};

type CardDatabase = CardFormFields & Omit<Required<CardDatabaseMeta>, 'prev_revision'> & {
  prev_revision?: string;
};

export class IndexedDBAppClient implements AppClient {
  private connection = openDatabase('gethydrated_cards', [
    (database) => {
      const store = database.createObjectStore('cards', { autoIncrement: false, keyPath: ['id', 'revision'] });
      store.createIndex('by_latest', ['id', 'latest'], { unique: false });
      store.createIndex('by_latest_list', ['deleted', 'latest', 'created_at', 'id'], { unique: false });
      store.createIndex('by_synced', 'synced');
    },
  ]);

  public async getList() {
    return await this.getLatestUniqueCards();
  }

  public async getById(id: string) {
    return await this.getLatestCardRevision(id);
  }

  public async deleteById(id: string) {
    const sklad = await this.connection;
    const latestCard = await this.getLatestCardRevision(id);

    const oldValue = this.prepareCardForDatabase({
      id,
      revision: latestCard.revision,
      created_at: latestCard.created_at,
      latest: 0,
      ...(latestCard.prev_revision ? { prev_revision: latestCard.prev_revision } : {}),
    }, latestCard);


    const newValue = this.prepareCardForDatabase({
      id,
      created_at: latestCard.created_at,
      prev_revision: latestCard.revision,
      deleted: 1,
    }, latestCard);

    await sklad.upsertIntoOneStore('cards', [
      { value: oldValue },
      { value: newValue },
    ]);
  }

  public async search(query: string) {
    const records = await this.getLatestUniqueCards();
    const includes = (input: string[], search: string): boolean => {
      return input.some((inputString) => inputString.toLowerCase().includes(search.toLowerCase()));
    };

    return records.filter((record) => {
      if (includes([record.title], query)) {
        return true;
      }

      if (includes(record.tags, query)) {
        return true;
      }

      const optionalFields: Array<'login' | 'email' | 'fieldId' | 'notes'> = ['login', 'email', 'fieldId', 'notes'];
      for (const field of optionalFields) {
        // looks like a TSC bug here
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (record[field] && includes([record[field]!], query)) {
          return true;
        }
      }

      return false;
    });
  }

  public async save(meta: CardMeta | null, card: CardFormFields, force?: boolean) {
    if (meta) {
      await this.update(meta, card, force);
    } else {
      await this.insert(card);
    }

    await this.sendLocalCards();
  }

  public subscribe() {} // eslint-disable-line @typescript-eslint/no-empty-function
  public unsubscribe() {} // eslint-disable-line @typescript-eslint/no-empty-function

  private async insert(card: CardFormFields): Promise<void> {
    const id = uniqueId();
    const sklad = await this.connection;
    const meta: CardDatabaseMeta = { id, revision: 'root' };
    const value = this.prepareCardForDatabase(meta, card);

    await sklad.insertIntoOneStore('cards', [{ value }]);
  }

  private async update(meta: CardMeta, card: CardFormFields, force?: boolean): Promise<void> {
    const sklad = await this.connection;
    const latestCard = await this.getLatestCardRevision(meta.id);

    if (!force && meta.revision !== latestCard.revision) {
      throw new SaveConflictError();
    }

    const oldValue = this.prepareCardForDatabase({
      id: meta.id,
      revision: latestCard.revision,
      created_at: latestCard.created_at,
      latest: 0,
      ...(latestCard.prev_revision ? { prev_revision: latestCard.prev_revision } : {}),
    }, latestCard);

    const newValue = this.prepareCardForDatabase({
      id: meta.id,
      created_at: latestCard.created_at,
      prev_revision: latestCard.revision,
    }, card);

    await sklad.upsertIntoOneStore('cards', [
      { value: newValue },
      { value: oldValue },
    ]);
  }

  private prepareCardForDatabase(meta: CardDatabaseMeta, card: CardFormFields): CardDatabase {
    return {
      // card meta
      id: meta.id,
      revision: meta.revision || uniqueId(),
      created_at: meta.created_at || new Date(),
      latest: meta.latest === undefined ? 1 : meta.latest,
      deleted: meta.deleted === undefined ? 0 : meta.deleted,
      synced: meta.synced || 0,
      // card values
      title: card.title,
      tags: card.tags,
      ...(card.login ? { login: card.login } : {}),
      ...(card.email ? { email: card.email } : {}),
      ...(card.fieldId ? { fieldId: card.fieldId } : {}),
      ...(card.password ? { password: card.password } : {}),
      ...(card.notes ? { notes: card.notes } : {}),
    };
  }

  private async getLatestUniqueCards(): Promise<CardDatabase[]> {
    const sklad = await this.connection;

    return await sklad.getOneStore('cards', {
      indexName: 'by_latest_list',
      range: IDBKeyRange.bound([0, 1], [1, 1]),
    });
  }

  private async getLatestCardRevision(id: string): Promise<CardDatabase> {
    const sklad = await this.connection;
    const latestResults = await sklad.getOneStore('cards', {
      indexName: 'by_latest',
      range: IDBKeyRange.only([id, 1]),
    });

    if (!latestResults.length) {
      throw new CardMissingError();
    }

    if (latestResults.length !== 1) {
      // TODO special error maybe?
      throw new Error('Found multiple latest revisions of one card');
    }

    const latest = latestResults[0];
    if (latest.deleted) {
      throw new CardDeletedError();
    }

    return latest;
  }

  private async sendLocalCards(): Promise<void> {
    const sklad = await this.connection;
    const newCards = await sklad.getOneStore('cards', {
      indexName: 'by_synced',
      range: IDBKeyRange.only(0),
    });

    try {
      const res = await fetch('http://localhost:8082/sync', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ cards: newCards }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        // TODO log this
        // throw new Error(`Failed syncing cards (${res.status})`);
      }
    } catch (err) {
      // TODO log this
      // throw new Error('Could not sync cards');
    }
  }
}
