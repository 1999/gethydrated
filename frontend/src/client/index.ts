export type CardFormFields = {
  title: string;
  login?: string;
  email?: string;
  fieldId?: string;
  password?: string;
  notes?: string;
  tags: string[];
}

export type Card = CardFormFields & {
  id: string;
  revision: string;
};

export type CardMeta = {
  id: string;
  revision: string;
};

export interface AppClient {
  getList(): Promise<Card[]>;
  // can be rejected with CardDeletedError and CardMissingError
  getById(id: string): Promise<Card>;
  deleteById(id: string): Promise<void>;
  search(query: string): Promise<Card[]>;
  // can be rejected with SaveConflictError
  save(meta: CardMeta | null, card: CardFormFields, force?: boolean): Promise<void>;

  subscribe(event: 'refresh', callback: () => void): void;
  unsubscribe(event: 'refresh', callback: () => void): void;
}

export class SaveConflictError extends Error {
  public constructor() {
    super('Save conflict');
  }
}

export class CardMissingError extends Error {
  public constructor() {
    super('Card does not exist');
  }
}

export class CardDeletedError extends Error {
  public constructor() {
    super('This card has already been deleted');
  }
}
