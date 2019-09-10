import React from 'react';
import styled from 'styled-components';
import { IconBack } from '../Icon';
import { textOverflowEllipsis } from '../../shared';

export type Props = {
  onBack: () => void;
  title: string;
}

const Header: React.FunctionComponent<Props> = ({ onBack, title }) => {
  return (
    <Container>
      <Back>
        <IconContainer onClick={onBack}>
          <IconBack/>
        </IconContainer>
      </Back>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  line-height: 48px;
  padding: 0 8px;
`;

const Back = styled.div`
  flex-grow: 0;
`;

const IconContainer = styled.div`
  display: ${(props) => props.hidden ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`;

const Title = styled.div`
  flex-grow: 1;
  font-size: 20px;
  line-height: 48px;
  padding-left: 8px;

  ${textOverflowEllipsis};
`;

export default Header;
