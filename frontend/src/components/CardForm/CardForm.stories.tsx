import React from 'react';
import { StoriesFactory, getActions, getAppClient, sleep } from '../../.storybook/config';
import { CardFormNew, CardFormEdit, CardFormCopy } from './';
import { CardMissingError, CardDeletedError } from '../../client';

const actions = getActions('onBack', 'onSave', 'onAfterSave');

const newCardClient = getAppClient({
  async save(id, fields) {
    await sleep(500);
    actions.onSave({ id, fields });
  }
});

const editCardClient = getAppClient({
  async save(id, fields) {
    await sleep(500);
    actions.onSave({ id, fields });
  },

  async getById() {
    await sleep(500);
    return {
      id: 'DUMMY-id',
      revision: 'DUMMY-revision',
      title: 'my.gov.au',
      email: 'info@staypositive.ru',
      password: 'secret password',
      notes: 'mobile phone used: 1234 567 890',
      tags: ['gov', 'personal'],
    };
  }
});

const missingCardClient = getAppClient({
  async getById() {
    await sleep(500);
    throw new CardMissingError();
  }
});

const deletedCardClient = getAppClient({
  async getById() {
    await sleep(500);
    throw new CardDeletedError();
  }
});

export default function stories(stories: StoriesFactory): void {
  stories('CardForm')
    .add('new card', () => (
      <CardFormNew
        client={newCardClient}
        {...actions}
      />
    ))
    .add('edit card', () => (
      <CardFormEdit
        client={editCardClient}
        id="foo"
        {...actions}
      />
    ))
    .add('edit card (missing)', () => (
      <CardFormEdit
        client={missingCardClient}
        id="foo"
        {...actions}
      />
    ))
    .add('edit card (deleted)', () => (
      <CardFormEdit
        client={deletedCardClient}
        id="foo"
        {...actions}
      />
    ))
    .add('copy card', () => (
      <CardFormCopy
        client={editCardClient}
        id="foo"
        {...actions}
      />
    ))
    .add('copy card (missing)', () => (
      <CardFormCopy
        client={missingCardClient}
        id="foo"
        {...actions}
      />
    ))
    .add('copy card (deleted)', () => (
      <CardFormCopy
        client={deletedCardClient}
        id="foo"
        {...actions}
      />
    ));
}
