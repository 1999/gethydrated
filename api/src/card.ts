export type Card = {
  id: string;
  revision: string;
  meta: {
    title: string;
    prevRevision?: string;
    created_at: Date;
    deleted: boolean;
  };
  data: {
    login?: string;
    email?: string;
    fieldId?: string;
    notes?: string;
    tags?: string[];
  };
};

type AssertionCheck = (value: any) => boolean;

const uuudv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_NOTE_LENGTH = 5000;
const MAX_TAG_LENGTH = 50;
const MAX_TAGS_COUNT = 10;
const MAX_GENERIC_STRING_LENGTH = 1000;

const isString = (value: any) => typeof value === 'string';
const isUuidv4 = (value: any) => isString(value) && uuudv4Regex.test(value);
const isValidRevision = (value: any) => isUuidv4(value) || value === 'root';
const isValidPrevRevision = (value: any) => value === undefined || (isString(value) && isValidRevision(value));
const isValidTitle = (value: any) => isString(value) && value.length <= MAX_GENERIC_STRING_LENGTH;
const isOptionalString = (value: any) => value === undefined || (isString(value) && value.length <= MAX_GENERIC_STRING_LENGTH);
const isValidDate = (value: any) => value === undefined || !isNaN((new Date(value)).valueOf());
const isValidDeleted = (value: any) => value === 0 || value === 1;
const isValidNote = (value: any) => value === undefined || (isString(value) && value.length <= MAX_NOTE_LENGTH);
const isValidTag = (value: any) => isString(value) && value.length <= MAX_TAG_LENGTH;
const isValidTagList = (value: any) => value === undefined || (Array.isArray(value) && value.length <= MAX_TAGS_COUNT && value.every(isValidTag));

const assertValid = (card: any, field: string, check: AssertionCheck): void => {
  if (!check(card[field])) {
    throw new Error(`Invalid ${field} field value: does not pass ${check.name} check`);
  }
};

/**
 * Validate incoming cards, use only known props
 */
export const sanitiseIncomingCards = (cards: any): Card[] => {
  if (!Array.isArray(cards)) {
    throw new Error('Incoming data is not a valid list of cards');
  }

  return cards.map((card) => {
    assertValid(card, 'id', isUuidv4);
    assertValid(card, 'revision', isValidRevision);
    assertValid(card, 'prev_revision', isValidPrevRevision);
    assertValid(card, 'title', isValidTitle);
    // TODO restrict fields longer than allowed lengthon the client
    assertValid(card, 'login', isOptionalString);
    assertValid(card, 'email', isOptionalString);
    assertValid(card, 'fieldId', isOptionalString);
    assertValid(card, 'created_at', isValidDate);
    assertValid(card, 'deleted', isValidDeleted);
    // TODO restrict saving longer notes on the client
    assertValid(card, 'notes', isValidNote);
    // TODO restrict saving unsupported tags on the client
    assertValid(card, 'tags', isValidTagList);

    return {
      id: card.id,
      revision: card.revision,
      meta: {
        title: card.title,
        ...(card.prev_revision ? { prevRevision: card.prev_revision } : {}),
        created_at: new Date(card.created_at),
        deleted: card.deleted === 1,
      },
      data: {
        ...(card.login ? { login: card.login } : {}),
        ...(card.email ? { email: card.email } : {}),
        ...(card.fieldId ? { fieldId: card.fieldId } : {}),
        notes: card.notes,
        tags: card.tags,
      },
    };
  });
};
