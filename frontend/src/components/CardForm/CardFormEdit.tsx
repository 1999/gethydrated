import React, { useEffect, useState, Fragment } from 'react';
import { Helmet } from '../Helmet';
import { AppClient, CardFormFields, Card } from '../../client';
import { FillArea } from '../../shared';
import CardFormEditView from './CardFormEditView';

export type Props = {
  onBack: () => void;
  onAfterSave: () => void;
  client: AppClient;
  id: string;
};

const CardFormEdit: React.FunctionComponent<Props> = ({ client, onBack, onAfterSave, id }) => {
  const [card, setCard] = useState<null | Card>(null);
  const [err, setError] = useState<null | Error>(null);

  useEffect(() => {
    client.getById(id)
      .then(setCard)
      .catch(setError);
  }, []);

  const onSave = async (fields: CardFormFields, force?: boolean) => {
    if (!card) {
      // TODO should this even be allowed?
      throw new Error('Could not save missing card');
    }

    await client.save({ id, revision: card.revision }, fields, force);
    onAfterSave();
  }

  if (err) {
    return (
      <Fragment>
        <FillArea>{err.message}</FillArea>
        <Helmet title="Error!" />
      </Fragment>
    );
  }

  if (card === null) {
    return (
      <Fragment>
        <FillArea>Loading...</FillArea>
        <Helmet title="Loading..." />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <CardFormEditView
        onBack={onBack}
        onSave={onSave}
        {...card}
      />
      <Helmet title={card.title} />
    </Fragment>
  );
};

export default CardFormEdit;
