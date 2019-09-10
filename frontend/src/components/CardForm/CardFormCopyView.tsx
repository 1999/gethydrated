import React, { useState, useEffect, MouseEventHandler } from 'react';
import { Row, CardFormContainer, CardForm, Body } from './shared-styled';
import Header from './Header';
import styled from 'styled-components';
import { PALETTE, textOverflowEllipsis } from '../../shared';
import { hidePassword } from '../password-hide';
import { CardFormFields } from '../../client';
import { IconEye } from '../Icon';

export type Props = CardFormFields & {
  onBack: () => void;
};

const CardFormCopyView: React.FunctionComponent<Props> = ({
  onBack,
  title,
  login,
  email,
  fieldId,
  password,
  notes,
}) => {
  const [copiedField, copyField] = useState<string | null>(null);
  const [shouldHidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => copyField(null), 1000);
    return () => clearTimeout(timeoutId);
  });

  const onCopy = (key: string, value: string) => async () => {
    try {
      // @see https://github.com/microsoft/TSJS-lib-generator/pull/735
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (navigator.permissions as any).query({ name: 'clipboard-write' });
      await navigator.clipboard.writeText(value);

      copyField(key);
    } catch (err) {
      // TODO process error
    }
  };

  const onEyeClick: MouseEventHandler<HTMLSpanElement> = (evt) => {
    setHidePassword(false);
    evt.stopPropagation();
  };

  const fields = [
    {
      label: 'E-mail',
      value: email,
    },
    {
      label: 'Login',
      value: login,
    },
    {
      label: 'ID',
      value: fieldId,
    },
    {
      label: 'Password',
      value: password,
      encrypt: shouldHidePassword,
    },
    {
      label: 'Custom notes',
      value: notes,
      multiline: true,
    },
  ];

  return (
    <CardFormContainer>
      <CardForm>
        <Header
          onBack={onBack}
          title={title}
        />
        <Body>
          <TextCallout>Tap on the field that you want to copy and its value will be copied to your clipboard.</TextCallout>
          {fields.map((field) => {
            if (!field.value) {
              return null;
            }

            const fieldValue = field.value;

            const value = field.encrypt
              ? hidePassword(fieldValue)
              : field.value;

            return (
              <RowCopier key={field.label} onClick={onCopy(field.label, fieldValue)}>
                <Label>{field.label}</Label>
                <Value multiline={field.multiline}>{value}</Value>
                {field.encrypt && (
                  <EyeContainer onClick={onEyeClick}>
                    <IconEye/>
                  </EyeContainer>
                )}
                <Copied visible={copiedField === field.label}>Copied!</Copied>
              </RowCopier>
            );
          })}
        </Body>
      </CardForm>
    </CardFormContainer>
  );
};

const RowCopier = styled(Row)`
  cursor: pointer;
  position: relative;
`;

const Label = styled.span`
  color: ${PALETTE.PLACEHOLDER};
  flex-grow: 0;
  white-space: nowrap;

  display: flex;
  align-items: center;
`;

const Value = styled.span<{ multiline?: boolean }>`
  padding-left: 16px;
  flex-grow: 1;
  ${(props) => props.multiline ? null : textOverflowEllipsis};
  line-height: ${(props) => props.multiline ? 36 : 48}px;
`;

const EyeContainer = styled.span`
  flex-grow: 0;
  display: flex;
  align-items: center;
  cursor: pointer;

  position: relative;
  z-index: 3;
`;

const TextCallout = styled.div`
  background: ${PALETTE.LIGHTBLUE};
  line-height: 32px;
  padding: 16px;
`;

const Copied = styled.div<{ visible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;

  background: ${PALETTE.BLACK};
  color: ${PALETTE.WHITE};
  font-weight: 500;
  transition: opacity 0.1s linear;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => props.visible ? 0.9 : 0};
`;

export default CardFormCopyView;
