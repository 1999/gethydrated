import React, { useEffect } from 'react';
import Faker from 'faker';
import { StoriesFactory, getActions, getAppClient, sleep } from '../../.storybook/config';
import { CardList } from './';

const actions = getActions('onCardCopy', 'onCardEdit', 'onCardDelete', 'onCardAdd');
const cards = Array.from({ length: 12 }).map(() => ({
  id: Faker.lorem.slug(),
  revision: Faker.lorem.slug(),
  title: Faker.internet.domainName(),
  login: Faker.lorem.sentence(),
  password: Faker.internet.password(),
  tags: [],
}));

const subscribers = new Set<() => void>();

const appClient = getAppClient({
  async getList() {
    await sleep(500);
    return cards;
  },

  async search(query) {
    await sleep(1000);
    return cards.filter((card) => card.title.includes(query));
  },

  async deleteById(id) {
    await sleep(500);
    actions.onCardDelete(id);
  },

  subscribe(_, callback) {
    subscribers.add(callback);
  },

  unsubscribe(_, callback) {
    subscribers.delete(callback);
  },
});

const CardListStory: React.FunctionComponent = () => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      for (const subscribe of subscribers) {
        subscribe();
      }
    }, 5000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <CardList
      client={appClient}
      {...actions}
    />
  );
};

export default function stories(stories: StoriesFactory): void {
  stories('CardList')
    .add('example', () => <CardListStory />);
}
