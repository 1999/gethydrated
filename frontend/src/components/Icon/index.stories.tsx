import React from 'react';
import { StoriesFactory } from '../../.storybook/config';
import { IconBack, IconEye, IconChevronDown } from './';

export default function stories(stories: StoriesFactory): void {
  stories('Icon')
    .add('back', () => <IconBack/>)
    .add('eye', () => <IconEye/>)
    .add('down', () => <IconChevronDown/>);
}
