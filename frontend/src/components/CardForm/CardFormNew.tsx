import React, { Fragment, useState, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { IconChevronDown } from '../Icon';
import { Helmet } from '../Helmet';
import { ActiveElementContainer, Body, Row, Input, Textarea, CardFormContainer, CardForm, Footer } from './shared-styled';
import Header from './Header';
import SaveButton from './SaveButton';
import { buildTagsList } from './tags';
import { AppClient } from '../../client';

export type Props = {
  client: AppClient;
  onBack: () => void;
  onAfterSave: () => void;
};

const CardFormNew: React.FunctionComponent<Props> = ({ client, onBack, onAfterSave }) => {
  const [showAllFields, setAllFieldsVisibility] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setCustomNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setSaving] = useState(false);

  const onChevronClick: MouseEventHandler<HTMLDivElement> = () => {
    setAllFieldsVisibility(true);
  };

  const onSaveAttempt = async () => {
    if (!title) {
      alert('Can\'t save the card without a site or app name');
      return;
    }

    setSaving(true);
    const tagsList = buildTagsList(tags);
    // TODO process error
    await client.save(null, { title, email, login, fieldId, password, notes, tags: tagsList });
    setSaving(false);

    onAfterSave();
  };

  return (
    <CardFormContainer>
      <Helmet title="New card" />
      <CardForm>
        <Header
          onBack={onBack}
          title="New card"
        />
        <Body>
          <Row>
            <ActiveElementContainer>
              <Input
                placeholder="Site or app name"
                value={title}
                onChange={(evt) => setTitle(evt.currentTarget.value)}
                autoCapitalize="off"
              />
            </ActiveElementContainer>
          </Row>
          <Row>
            <ActiveElementContainer>
              <Input
                placeholder="E-mail (optional)"
                type="email"
                value={email}
                onChange={(evt) => setEmail(evt.currentTarget.value)}
                autoCapitalize="off"
              />
            </ActiveElementContainer>
            {!showAllFields && (
              <ChevronContainer onClick={onChevronClick}>
                <IconChevronDown/>
              </ChevronContainer>
            )}
          </Row>
          {showAllFields && (
            <Fragment>
              <Row>
                <ActiveElementContainer>
                  <Input
                    placeholder="Login (optional)"
                    value={login}
                    onChange={(evt) => setLogin(evt.currentTarget.value)}
                    autoCapitalize="off"
                  />
                </ActiveElementContainer>
              </Row>
              <Row>
                <ActiveElementContainer>
                  <Input
                    placeholder="ID (optional)"
                    type="number"
                    value={fieldId}
                    onChange={(evt) => setFieldId(evt.currentTarget.value)}
                    autoCapitalize="off"
                  />
                </ActiveElementContainer>
              </Row>
            </Fragment>
          )}
          <Row>
            <ActiveElementContainer>
              <Input
                placeholder="Password (optional)"
                type="password"
                value={password}
                onChange={(evt) => setPassword(evt.currentTarget.value)}
                autoCapitalize="off"
              />
            </ActiveElementContainer>
          </Row>
          <Row>
            <ActiveElementContainer>
              <Textarea
                placeholder="Custom notes (optional)"
                value={notes}
                onChange={(evt) => setCustomNotes(evt.currentTarget.value)}
              />
            </ActiveElementContainer>
          </Row>
          <Row>
            <ActiveElementContainer>
              <Input
                placeholder="Tags (separated with comma, optional)"
                value={tags}
                onChange={(evt) => setTags(evt.currentTarget.value)}
                autoCapitalize="off"
              />
            </ActiveElementContainer>
          </Row>
        </Body>
      </CardForm>
      <Footer>
        <SaveButton
          disabled={isSaving}
          onClick={onSaveAttempt}
        />
      </Footer>
    </CardFormContainer>
  );
};

const ChevronContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default CardFormNew;
