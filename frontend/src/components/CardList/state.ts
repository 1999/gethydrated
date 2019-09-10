import { Reducer } from 'react';
import { Card } from '../../client';

export enum Actions {
  SET_CARDS_LIST_DEFAULT,
  SET_SEARCH_QUERY,
  FINISH_SEARCH,
  CLEAR_SEARCH,
  LOAD_ALL_CARDS,
  MARK_OUTDATED,
  SET_ERROR,
}

export type State = {
  searchQuery: string;
  allCards: Card[];
  showCards: Card[];
  isOutdated: boolean;
  isSearching: boolean;
  isLoadingDefaultCards: boolean;
  error: Error | null;
};

export type ActionLoadAllCards = {
  type: Actions.LOAD_ALL_CARDS;
};

export type ActionSetSearchQuery = {
  type: Actions.SET_SEARCH_QUERY;
  searchQuery: string;
};

export type ActionClearSearch = {
  type: Actions.CLEAR_SEARCH;
};

export type ActionFinishSearch = {
  type: Actions.FINISH_SEARCH;
  cards: Card[];
  searchQuery: string;
};

export type ActionSetAllCards = {
  type: Actions.SET_CARDS_LIST_DEFAULT;
  cards: Card[];
};

export type ActionMarkOutdated = {
  type: Actions.MARK_OUTDATED;
};

export type ActionSetError = {
  type: Actions.SET_ERROR;
  err: Error;
};

export type Action =
  ActionLoadAllCards |
  ActionSetSearchQuery |
  ActionClearSearch |
  ActionFinishSearch |
  ActionSetAllCards |
  ActionMarkOutdated |
  ActionSetError;

export type CardListReducer = Reducer<State, Action>;

export const reducer: CardListReducer = (state, action): State => {
  switch (action.type) {
    case Actions.LOAD_ALL_CARDS:
      return { ...state, allCards: [], showCards: [], isLoadingDefaultCards: true, isOutdated: false };

    case Actions.SET_ERROR:
      return { ...state, error: action.err };

    case Actions.SET_SEARCH_QUERY:
      return state.isLoadingDefaultCards
        ? { ...state }
        : { ...state, searchQuery: action.searchQuery, isSearching: true };

    case Actions.CLEAR_SEARCH:
      return state.isLoadingDefaultCards
        ? { ...state }
        : { ...state, searchQuery: '', showCards: state.allCards, isSearching: false };

    case Actions.FINISH_SEARCH:
      return state.searchQuery !== action.searchQuery
        ? { ...state }
        : { ...state, showCards: action.cards, isSearching: false };

    case Actions.SET_CARDS_LIST_DEFAULT:
      return { ...state, allCards: action.cards, showCards: action.cards, isLoadingDefaultCards: false };

    case Actions.MARK_OUTDATED:
      return { ...state, isOutdated: true };

    default:
      return state;
  }
};
