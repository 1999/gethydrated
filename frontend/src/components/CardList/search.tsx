import React from 'react';
import styled from 'styled-components';
import { rowItem, PALETTE, formElementStyle } from '../../shared';

export type Props = {
  onSearch: (query: string) => void;
  query: string;
}

const Search: React.FunctionComponent<Props> = ({ query, onSearch }) => {
  return (
    <SearchContainer>
      <SearchLabel hidden={query.length === 0}>
        Search:
      </SearchLabel>
      <SearchInputContainer>
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(evt) => onSearch(evt.currentTarget.value)}
          autoCapitalize="off"
        />
      </SearchInputContainer>
    </SearchContainer>
  );
};

const Input = styled.input`
  ${formElementStyle};
`;

const SearchContainer = styled.div`
  ${rowItem};

  background: white;
  display: flex;
  position: sticky;
  top: 0;
  padding: 16px;
`;

const SearchLabel = styled.span`
  padding-right: 16px;
  flex-grow: 0;
  color: ${PALETTE.PLACEHOLDER};
`;

const SearchInputContainer = styled.span`
  flex-grow: 1;
`;

export default Search;
