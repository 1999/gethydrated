import React from 'react';
import styled from 'styled-components';
import { PALETTE, globalStyle } from '../../shared';

export type Props = {
  background: string;
  disabled: boolean;
  onClick: () => void;
};

const Button: React.FunctionComponent<Props> = (props) => {
  return (
    <StyledButton background={props.background} {...props}/>
  );
};

const StyledButton = styled.button<{ background: string }>`
  ${globalStyle};

  background: ${(props) => props.background};
  border: none;
  color: ${PALETTE.WHITE};
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
  display: block;
  font-size: 20px;
  font-weight: 500;
  line-height: 64px;
  opacity: ${(props) => props.disabled ? 0.5 : 1};
  outline: none;
  width: 100%;
`;

export default Button;
