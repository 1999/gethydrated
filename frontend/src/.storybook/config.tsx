import React from 'react';
import { addDecorator, configure, storiesOf, Story } from '@storybook/react';
import { action, HandlerFunction } from '@storybook/addon-actions';
import { GlobalContainer } from '../shared';
import { AppClient } from '../client';

const ctx = require.context('../components', true, /\.stories\.tsx$/);
const stories = ctx.keys();

export type StoriesFactory = (storyName: string) => Story;
const storyFactory = (name: string) => storiesOf(name, module);

export const getActions = <T extends string>(...actionNames: T[]): Record<T, HandlerFunction> => {
  return actionNames.reduce((memo, name) => {
    memo[name] = action(name);
    return memo;
  }, {} as Record<string, HandlerFunction>);
};

export const getAppClient = (methods: Partial<AppClient>): AppClient => {
  const notImplemented = (method: keyof AppClient) => () => { throw new Error(`Method ${method} is not implemented`) };

  return {
    getList: methods.getList || notImplemented('getList'),
    getById: methods.getById || notImplemented('getById'),
    save: methods.save || notImplemented('save'),
    deleteById: methods.deleteById || notImplemented('deleteById'),
    search: methods.search || notImplemented('search'),
    subscribe: methods.subscribe || notImplemented('subscribe'),
    unsubscribe: methods.unsubscribe || notImplemented('unsubscribe'),
  };
};

export const sleep = (timeoutMs: number) => new Promise((resolve) => setTimeout(resolve, timeoutMs));

addDecorator((story) => (
  <GlobalContainer>
    {story()}
  </GlobalContainer>
));

configure(() => {
  for (const story of stories) {
    ctx(story).default(storyFactory);
  }
}, module);
