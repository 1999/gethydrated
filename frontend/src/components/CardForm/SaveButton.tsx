import React from 'react';
import { PALETTE } from '../../shared';
import { Button } from '../Button';

export type Props = {
  disabled: boolean;
  onClick: () => void;
}

const SaveButton: React.FunctionComponent<Props> = ({ disabled, onClick }) => {
  return (
    <Button
      background={PALETTE.GREEN}
      disabled={disabled}
      onClick={onClick}
    >
      Save
    </Button>
  );
};

export default SaveButton;
