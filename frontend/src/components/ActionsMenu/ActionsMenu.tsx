import React, { Fragment } from 'react';
import { PALETTE, textOverflowEllipsis } from '../../shared';
import styled from 'styled-components';

export type Props = {
  label: string;
};

const CardActionsMenu: React.FunctionComponent<Props> = ({ children, label }) => {
  return (
    <Fragment>
      <Label>{label}</Label>
      {children}
    </Fragment>
  );
};

const Label = styled.div`
  background: ${PALETTE.WHITE};
  font-size: 20px;
  font-weight: 500;
  line-height: 92px;
  padding: 0 16px;
  text-align: center;

  ${textOverflowEllipsis};
`;

export default CardActionsMenu;
