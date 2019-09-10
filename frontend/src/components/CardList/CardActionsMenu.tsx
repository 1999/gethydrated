import React, { useState } from 'react';
import { PALETTE } from '../../shared';
import { ActionsMenu } from '../ActionsMenu';
import { Button } from '../Button';

export type Props = {
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onAfterDelete: () => void;
  title: string;
};

const CardActionsMenu: React.FunctionComponent<Props> = ({ onCopy, onEdit, onDelete, title, onAfterDelete }) => {
  const [isDeleting, setDelete] = useState(false);

  const onDeleteAttempt = async () => {
    setDelete(true);

    try {
      await onDelete();
    } catch (err) {
      // TODO process error
    }

    setDelete(false);
    onAfterDelete();
  };

  return (
    <ActionsMenu label={title}>
      <Button
        background={PALETTE.GREEN}
        disabled={false}
        onClick={onCopy}
      >
        Copy data from this card
      </Button>
      <Button
        background={PALETTE.MARINE}
        disabled={false}
        onClick={onEdit}
      >
        Edit card
      </Button>
      <Button
        background={PALETTE.RED}
        disabled={isDeleting}
        onClick={onDeleteAttempt}
      >
        {isDeleting ? 'Please wait...' : 'Delete this card'}
      </Button>
    </ActionsMenu>
  );
};

export default CardActionsMenu;
