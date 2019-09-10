import React, { useEffect, useReducer, Fragment } from 'react';
import CardListView from './CardListView';
import { reducer, Actions } from './state';
import { AppClient } from '../../client';
import { mapToViewCard } from './card-format-mapper';
import { FillArea } from '../../shared';
import { Helmet } from '../Helmet';

export type Props = {
  client: AppClient;
  onCardAdd: () => void;
  onCardCopy: (id: string) => void;
  onCardEdit: (id: string) => void;
};

const CardList: React.FunctionComponent<Props> = ({ client, onCardAdd, onCardCopy, onCardEdit }) => {
  const [{ searchQuery, isLoadingDefaultCards, isSearching, isOutdated, showCards, error }, dispatch] = useReducer(reducer, {
    searchQuery: '',
    allCards: [],
    showCards: [],
    isLoadingDefaultCards: true,
    isOutdated: false,
    isSearching: false,
    error: null,
  });

  const onListRefresh = () => {
    dispatch({ type: Actions.MARK_OUTDATED });
  };

  useEffect(() => {
    dispatch({ type: Actions.LOAD_ALL_CARDS });

    client.subscribe('refresh', onListRefresh);
    return () => client.unsubscribe('refresh', onListRefresh);
  }, []);

  useEffect(() => {
    if (!isLoadingDefaultCards) {
      return;
    }

    client.getList()
      .then((cards) => dispatch({ type: Actions.SET_CARDS_LIST_DEFAULT, cards }))
      .catch((err) => {
        dispatch({ type: Actions.SET_ERROR, err });
      });
  }, [isLoadingDefaultCards]);

  useEffect(() => {
    const onQueryChange = async () => {
      if (searchQuery) {
        dispatch({ type: Actions.SET_SEARCH_QUERY, searchQuery });

        try {
          const results = await client.search(searchQuery);
          dispatch({ type: Actions.FINISH_SEARCH, searchQuery, cards: results });
        } catch (err) {
          dispatch({ type: Actions.SET_ERROR, err });
        }
      } else {
        dispatch({ type: Actions.CLEAR_SEARCH });
      }
    };

    onQueryChange();
  }, [searchQuery]);

  if (error) {
    return (
      <Fragment>
        <FillArea>{error.message}</FillArea>
        <Helmet title="Error!" />
      </Fragment>
    );
  }

  if (isLoadingDefaultCards) {
    return (
      <Fragment>
        <FillArea>Loading...</FillArea>
        <Helmet title="Loading..." />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <CardListView
        cards={showCards.map(mapToViewCard)}
        isSearching={isSearching}
        isOutdated={isOutdated}
        searchQuery={searchQuery}
        onCardAdd={onCardAdd}
        onCardCopy={onCardCopy}
        onCardDelete={(id) => client.deleteById(id)}
        onCardEdit={onCardEdit}
        onAfterCardDelete={() => dispatch({ type: Actions.LOAD_ALL_CARDS })}
        onRefresh={() => dispatch({ type: Actions.LOAD_ALL_CARDS })}
        onSearch={(query) => dispatch({ type: Actions.SET_SEARCH_QUERY, searchQuery: query })}
      />
      <Helmet title="TODO: cards list" />
    </Fragment>
  );
};

export default CardList;
