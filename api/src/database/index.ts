import { Card } from '../card';

export type Database = {
  insertCard(card: Card): Promise<void>;
  cardExists(id: string): Promise<boolean>;
  getCardByRevision(id: string, revision: string): Promise<Card | null>;
  getCardByPreviousRevision(id: string, prevRevision: string): Promise<Card | null>;
};
