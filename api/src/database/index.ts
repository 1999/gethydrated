import { CardGroups } from '../card';

export type Database = {
  insertCards(cardGroups: CardGroups): Promise<void>;
};
