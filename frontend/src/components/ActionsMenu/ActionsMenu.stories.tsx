import React from 'react';
import { StoriesFactory } from '../../.storybook/config';
import { ActionsMenu } from './';

export default function stories(stories: StoriesFactory): void {
  stories('ActionsMenu')
    .add('example', () => (
      <ActionsMenu
        label="my.gov.au"
      />
    ));
}
