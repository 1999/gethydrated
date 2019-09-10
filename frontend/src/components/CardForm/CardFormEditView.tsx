import React, { useState } from 'react';
import { Row, ActiveElementContainer, CardFormContainer, CardForm, Body, Input, Textarea, Footer } from './shared-styled';
import Header from './Header';
import SaveButton from './SaveButton';
import { serialiseTagsList, buildTagsList } from './tags';
import { CardFormFields, SaveConflictError } from '../../client';

export type Props = CardFormFields & {
  onBack: () => void;
  onSave: (fields: CardFormFields, force?: boolean) => Promise<void>;
};

const CardFormEditView: React.FunctionComponent<Props> = ({
  onBack,
  onSave,
  title: defaultTitle,
  login: defaultLogin,
  email: defaultEmail,
  fieldId: defaultFieldId,
  password: defaultPasswordValue,
  notes: defaultNotes,
  tags: defaultTags
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [login, setLogin] = useState(defaultLogin);
  const [email, setEmail] = useState(defaultEmail);
  const [fieldId, setFieldId] = useState(defaultFieldId);
  const [password, setPassword] = useState(defaultPasswordValue);
  const [notes, setCustomNotes] = useState(defaultNotes);
  const [tags, setTags] = useState(serialiseTagsList(defaultTags));
  const [isSaving, setSaving] = useState(false);

  const onSaveAttempt = async () => {
    if (!title) {
      alert('Can\'t save the card without a site or app name');
      return;
    }

    setSaving(true);

    const tagsList = buildTagsList(tags);
    const fields = { title, email, login, fieldId, password, notes, tags: tagsList };

    try {
      await onSave(fields);
    } catch (err) {
      console.log(err);
      if (err instanceof SaveConflictError) {
        if (confirm('There is a new version of this card. Do you really want to save this version?')) {
          await onSave(fields, true);
        }
      } else {
        alert(`Error occured while saving: ${err.message}`);
      }

      setSaving(false);
    }
  };

  return (
    <CardFormContainer>
      <CardForm>
        <Header
          onBack={onBack}
          title="Edit card"
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
          </Row>
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

export default CardFormEditView;
