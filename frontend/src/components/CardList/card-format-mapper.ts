import { Card } from '../../client';
import { ViewCard } from './CardListView';
import { hidePassword } from '../password-hide';

const buildViewCardText = (card: Card): string => {
  const fields = [
    card.login ? `login: ${card.login}` : '',
    card.email ? `e-mail: ${card.email}` : '',
    card.fieldId ? `ID: ${card.fieldId}` : '',
    card.password ? `password: ${hidePassword(card.password)}` : '',
    card.notes ? `custom notes: ${card.notes.replace(/\n/g, ' ')}` : '',
    card.tags.length ? `tags: ${card.tags.join(', ')}` : '',
  ].filter(Boolean);

  return fields.join(', ');
};

export const mapToViewCard = (card: Card): ViewCard => ({
  id: card.id,
  title: card.title,
  text: buildViewCardText(card),
});
