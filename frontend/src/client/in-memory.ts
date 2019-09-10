import Faker from 'faker';
import { AppClient, Card, SaveConflictError, CardMeta } from './';

let id = 0;
const sleep = (timeoutMs: number) => new Promise((resolve) => setTimeout(resolve, timeoutMs));
const getUniqueId = () => String(++id);

export class InMemoryAppClient implements AppClient {
  protected cards: Card[] = Array.from({ length: 12 }).map(() => ({
    id: Faker.lorem.slug(),
    revision: getUniqueId(),
    title: Faker.internet.domainName(),
    login: Faker.lorem.sentence(),
    password: Faker.internet.password(),
    tags: [],
  }));

  public async getList() {
    await sleep(500);
    return this.cards;
  }

  public async getById(id: string) {
    await sleep(500);
    const card = this.cards.find((card) => card.id === id);

    if (!card) {
      throw new Error('Could not find card');
    }

    return card;
  }

  public async save(meta: CardMeta | null, card: Card, force?: boolean) {
    if (meta !== null) {
      const cardIndex = this.cards.findIndex((card) => card.id === meta.id);

      if (cardIndex === -1) {
        throw new Error('Could not find card');
      }

      if (Math.random() > 0.5 && !force) {
        throw new SaveConflictError();
      }

      this.cards[cardIndex] = {
        id: meta.id,
        ...card,
      };
    } else {
      const id = getUniqueId();

      this.cards.push({
        id,
        revision: id,
        ...card,
      });
    }
  }

  public async deleteById(id: string) {
    await sleep(500);
    const cardIndex = this.cards.findIndex((card) => card.id === id);

    if (cardIndex === -1) {
      throw new Error('Could not find card');
    }

    this.cards.splice(cardIndex, 1);
  }

  public async search(query: string) {
    await sleep(500);
    return this.cards.filter((card) => card.title.includes(query));
  }

  public subscribe() {} // eslint-disable-line @typescript-eslint/no-empty-function
  public unsubscribe() {} // eslint-disable-line @typescript-eslint/no-empty-function
}
