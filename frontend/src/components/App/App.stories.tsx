import React from 'react';
import { StoriesFactory } from '../../.storybook/config';
import { App } from './';
import { MemoryRouter } from 'react-router';
import { InMemoryAppClient } from '../../client/in-memory';

export default function stories(stories: StoriesFactory): void {
  const story = stories('App');

  story
    .add('in memory', () => (
      <MemoryRouter initialEntries={['/']}>
        <App
          client={new InMemoryAppClient()}
        />
      </MemoryRouter>
    ));
}
