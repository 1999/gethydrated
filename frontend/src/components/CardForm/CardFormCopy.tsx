import React, { useEffect, useState, Fragment } from 'react';
import { AppClient, CardFormFields } from '../../client';
import { Helmet } from '../Helmet';
import { FillArea } from '../../shared';
import CardFormCopyView from './CardFormCopyView';

export type Props = {
  onBack: () => void;
  client: AppClient;
  id: string;
};

const CardFormCopy: React.FunctionComponent<Props> = ({ client, onBack, id }) => {
  const [card, setCard] = useState<null | CardFormFields>(null);
  const [err, setError] = useState<null | Error>(null);

  useEffect(() => {
    client.getById(id)
      .then(setCard)
      .catch(setError);
  }, []);

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
      <CardFormCopyView
        onBack={onBack}
        {...card}
      />
      <Helmet title={card.title} />
    </Fragment>
  );
};

export default CardFormCopy;
