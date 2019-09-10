import React from 'react';
import { StoriesFactory, getActions } from '../../.storybook/config';
import { Button } from './';
import { PALETTE } from '../../shared';

const actions = getActions('onClick');

export default function stories(stories: StoriesFactory): void {
  const story = stories('Button');

  story
    .add('enabled', () => (
      <Button
        background={PALETTE.GREEN}
        disabled={false}
        {...actions}
      >
        Save
      </Button>
    ))
    .add('disabled', () => (
      <Button
        background={PALETTE.GREEN}
        disabled={true}
        {...actions}
      >
        Save
      </Button>
    ));
}
