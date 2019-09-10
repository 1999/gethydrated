import styled from 'styled-components';
import { formElementStyle, rowItem } from '../../shared';

export const Body = styled.div`
  margin-top: 8px;
`;

export const Row = styled.div`
  ${rowItem};
  display: flex;
`;

export const ActiveElementContainer = styled.div`
  flex-grow: 1;
`;

export const Input = styled.input`
  ${formElementStyle};
`;

export const Textarea = styled.textarea`
  ${formElementStyle};
  height: 120px;
`;

export const CardFormContainer = styled.div`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: -moz-available;
  min-height: stretch;
  display: flex;
  flex-direction: column;
`;

export const CardForm = styled.div`
  flex-grow: 1;
`;

export const Footer = styled.div`
  flex-grow: 0;
`;
