import React from 'react';
import { StoriesFactory, getActions } from '../../.storybook/config';
import { CardListItem } from './';

const title = 'my.gov.au';
const text = 'login: ***, password: ***';
const actions = getActions('onClick');

export default function stories(stories: StoriesFactory): void {
  stories('CardListItem')
    .add('simple example', () => (
      <CardListItem
        title={title}
        text={text}
        {...actions}
      />
    ))
    .add('long title', () => (
      <CardListItem
        title={title.repeat(10)}
        text={text}
        {...actions}
      />
    ))
    .add('long text', () => (
      <CardListItem
        title={title}
        text={text.repeat(100)}
        {...actions}
      />
    ))
    .add('long title and text', () => (
      <CardListItem
        title={title.repeat(10)}
        text={text.repeat(100)}
        {...actions}
      />
    ));
}
