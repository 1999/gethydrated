import React from 'react';
import styled from 'styled-components';
import { textOverflowEllipsis, rowItem, PALETTE } from '../../shared';

export type Props = {
  onClick: () => void;
  title: string;
  text: string;
};

const CardListItem: React.FunctionComponent<Props> = ({ onClick, title, text }) => {
  return (
    <Container onClick={() => onClick()}>
      <Title>{title}</Title>
      <Text>{text}</Text>
    </Container>
  );
}

const Container = styled.div`
  ${rowItem};
  ${textOverflowEllipsis};
  cursor: pointer;
`;

const Title = styled.span`
  font-weight: 500;
  padding-right: 16px;
`;

const Text = styled.span`
  color: ${PALETTE.PLACEHOLDER};
`;

export default CardListItem;
