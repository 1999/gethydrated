import React, { useState, useEffect, Fragment } from 'react';
import { CardListItem } from '../CardListItem';
import CardActionsMenu from './CardActionsMenu';
import styled, { css } from 'styled-components';
import { PALETTE, desktop, FillArea } from '../../shared';
import Search from './search';
import { ActionsMenu } from '../ActionsMenu';
import { Button } from '../Button';

export type ViewCard = {
  id: string;
  title: string;
  text: string;
};

export type Props = {
  cards: ViewCard[];
  isOutdated: boolean;
  isSearching: boolean;
  searchQuery: string;
  onCardAdd(): void;
  onCardCopy(id: string): void;
  onCardEdit(id: string): void;
  onCardDelete(id: string): Promise<void>;
  onAfterCardDelete(): void;
  onRefresh(): void;
  onSearch(query: string): void;
}

const findCardById = (cards: ViewCard[], id: string): ViewCard => {
  const card = cards.find((card) => card.id === id);
  if (!card) {
    throw new Error('Could not find card by id');
  }

  return card;
};

const CardListView: React.FunctionComponent<Props> = ({
  cards,
  isOutdated,
  isSearching,
  onCardCopy,
  onCardDelete,
  onCardEdit,
  onCardAdd,
  onRefresh,
  onSearch,
  onAfterCardDelete,
  searchQuery,
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setActiveCardId(null);
      }
    }

    document.addEventListener('keydown', onKeyDown, false);

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    }
  });

  const onEdit = () => {
    if (activeCardId) {
      onCardEdit(activeCardId);
    }
  }

  const onCopy = () => {
    if (activeCardId) {
      onCardCopy(activeCardId);
    }
  }

  const onDelete = async () => {
    if (activeCardId && confirm('Card will be permanently deleted. Proceed?')) {
      try {
        await onCardDelete(activeCardId);
      } catch (err) {
        // TODO process error
      }

      onAfterCardDelete();
    }
  }

  const activeCard = activeCardId
    ? findCardById(cards, activeCardId)
    : null;

  return (
    <Container>
      <Search
        onSearch={onSearch}
        query={searchQuery}
      />
      {isSearching && (
        <FillArea>Searching...</FillArea>
      )}
      {!isSearching && (
        <Fragment>
          {cards.map((card) => (
            <CardListItem
              {...card}
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
            />
          ))}
          {searchQuery.length > 0 && cards.length === 0 && (
            <FillArea>No results</FillArea>
          )}
          <Overlay
            show={activeCard !== null || isOutdated}
            onClick={() => setActiveCardId(null)}
          />
          <AddContainer onClick={onCardAdd}>+</AddContainer>
          <Menu show={activeCard !== null}>
            <CardActionsMenu
              onCopy={onCopy}
              onEdit={onEdit}
              onDelete={onDelete}
              onAfterDelete={() => setActiveCardId(null)}
              title={activeCard && activeCard.title || ''}
            />
          </Menu>
          <Menu show={isOutdated}>
            <ActionsMenu label="Cards list is outdated">
              <Button
                background={PALETTE.MARINE}
                disabled={false}
                onClick={onRefresh}
              >
                Refresh
              </Button>
            </ActionsMenu>
          </Menu>
        </Fragment>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Overlay = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: ${PALETTE.BLACK};
  display: ${(props) => props.show ? 'block' : 'none'};
  opacity: ${(props) => props.show ? 0.4 : 0};
`;

const Menu = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 0;
  transform: ${(props) => props.show ? 'translateY(0)' : 'translateY(100%)'};
  width: 100%;

  transition: transform 0.1s linear;
`;

const AddContainer = styled.div`
  position: fixed;
  border-radius: 50%;
  bottom: 16px;
  right: 16px;
  background: ${PALETTE.FACEBOOK};
  color: ${PALETTE.WHITE};
  font-weight: 500;
  user-select: none;

  width: 64px;
  height: 64px;
  text-align: center;
  line-height: 64px;
  font-size: 40px;

  ${desktop(css`
    cursor: pointer;
  `)}
`;

export default CardListView;
